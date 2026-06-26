"use client";

import { useMemo, useState } from "react";
import {
  getActivePetId,
  loadAlerts,
  loadCsvRecord,
  saveAlerts,
  saveCsvRecord,
  type AlertEvent,
} from "@/lib/jiv-storage";
import { parseThingSpeakCsvFile } from "@/lib/csv-parse";
import { evaluateAlertsFromCsvRecord } from "@/lib/alert-logic";
import TemperatureLineChart from "@/components/charts/TemperatureLineChart";
import HeartRateLineChart from "@/components/charts/HeartRateLineChart";
import ActivityLevelChart from "@/components/charts/ActivityLevelChart";
import { Download, UploadCloud, ClipboardList } from "lucide-react";

function formatDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString([], {
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

type Point = {
  timestampISO: string;
  temperatureC?: number;
  heartRateBpm?: number;
  latitude?: number;
  longitude?: number;
  activity?: number | string;
};

function toCsv(points: Point[]) {
  const header = [
    "timestampISO",
    "temperatureC",
    "heartRateBpm",
    "latitude",
    "longitude",
    "activity",
  ];
  const lines = [header.join(",")];
  for (const p of points) {
    const row = [
      JSON.stringify(p.timestampISO ?? ""),
      p.temperatureC ?? "",
      p.heartRateBpm ?? "",
      p.latitude ?? "",
      p.longitude ?? "",
      JSON.stringify(p.activity ?? ""),
    ];
    lines.push(row.join(","));
  }
  return lines.join("\n");
}

function downloadTextFile(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function HealthLogsPage() {
  const [petId] = useState<string | null>(() => getActivePetId());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  const [points, setPoints] = useState<Point[]>(() => {
    const id = getActivePetId();
    if (!id) return [];
    return loadCsvRecord(id)?.points ?? [];
  });
  const [alerts, setAlerts] = useState<AlertEvent[]>(() => {
    const id = getActivePetId();
    if (!id) return [];
    return loadAlerts(id) ?? [];
  });

  const alertSummaryRows = useMemo(() => {
    return alerts.slice().sort((a, b) => new Date(b.timeISO).getTime() - new Date(a.timeISO).getTime()).slice(0, 30);
  }, [alerts]);

  async function onLoadData() {
    if (!petId) {
      setError("No active Pet ID found. Login via Dashboard or Pet Profile first.");
      return;
    }
    if (!fileToUpload) {
      setError("Please select a CSV file first.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const rec = await parseThingSpeakCsvFile(petId, fileToUpload);
      const computedAlerts = evaluateAlertsFromCsvRecord(rec);
      saveCsvRecord(rec);
      saveAlerts(petId, computedAlerts);
      setPoints(rec.points);
      setAlerts(computedAlerts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load CSV.");
    } finally {
      setBusy(false);
    }
  }

  function onDownloadReport() {
    if (!points.length) return;
    const csv = toCsv(points);
    downloadTextFile(`jivrakshak-health-report-${petId ?? "pet"}.csv`, csv);
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Health & Activity Logs</h1>
        <p className="mt-2 text-sm text-slate-600">
          Visual representation of pet health data collected through IoT sensors.
        </p>
      </div>

      {!petId ? (
        <div className="mt-6 rounded-2xl border border-amber-200/70 bg-amber-50 p-6 text-sm text-amber-900">
          No active Pet ID found. Please register/login from the <a className="font-semibold underline" href="/dashboard">Dashboard</a> or <a className="font-semibold underline" href="/pet-profile">Pet Profile</a> first.
        </div>
      ) : (
        <>
          <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">Upload CSV Data</div>
                <div className="mt-1 text-xs text-slate-600">
                  Upload ThingSpeak CSV and process it for charts + alert summary.
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800">
                Pet ID: {petId}
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
                <span className="inline-flex items-center gap-2 font-semibold text-slate-800">
                  <UploadCloud className="h-4 w-4 text-sky-700" />
                  Upload ThingSpeak CSV Data
                </span>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={(e) => setFileToUpload(e.target.files?.[0] ?? null)}
                />
              </label>

              <button
                type="button"
                disabled={!fileToUpload || busy}
                onClick={onLoadData}
                className="rounded-xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "Processing..." : "Load Data"}
              </button>
            </div>

            {error ? (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                {error}
              </div>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
              <div className="text-xs text-slate-700">
                Data is visualization-only. No live sensor connection on this page.
              </div>
              <button
                type="button"
                onClick={onDownloadReport}
                disabled={!points.length}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download className="h-4 w-4 text-sky-700" />
                Download CSV Report
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <TemperatureLineChart points={points} />
            <HeartRateLineChart points={points} />
          </div>

          <div className="mt-4">
            <ActivityLevelChart points={points} />
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-slate-900">
                Alert Summary
              </div>
              <ClipboardList className="h-4 w-4 text-sky-700" />
            </div>
            <div className="mt-2 text-xs text-slate-600">
              Time • Parameter • Value • Status
            </div>

            <div className="mt-4 overflow-auto">
              <table className="min-w-[680px] w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs text-slate-600">
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">Parameter</th>
                    <th className="px-4 py-3">Value</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {alertSummaryRows.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-xs text-slate-600">
                        No abnormal conditions detected in the uploaded CSV.
                      </td>
                    </tr>
                  ) : (
                    alertSummaryRows.map((a, idx) => {
                      const pill =
                        a.status === "Critical"
                          ? "text-red-800"
                          : a.status === "Warning"
                            ? "text-amber-900"
                            : "text-emerald-900";
                      return (
                        <tr key={`${a.timeISO}-${idx}`} className="border-t border-slate-100">
                          <td className="px-4 py-3 text-xs text-slate-700">
                            {formatDateTime(a.timeISO)}
                          </td>
                          <td className="px-4 py-3 text-xs font-semibold text-slate-800">
                            {a.parameter}
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-700">
                            {a.value}
                          </td>
                          <td className={`px-4 py-3 text-xs font-semibold ${pill}`}>
                            {a.status}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs leading-6 text-slate-700">
            Important Notes: This page is for data visualization only. Data comes from CSV (ThingSpeak export).
            API integration can be added later; designed for academic monitoring.
          </div>
        </>
      )}
    </div>
  );
}

