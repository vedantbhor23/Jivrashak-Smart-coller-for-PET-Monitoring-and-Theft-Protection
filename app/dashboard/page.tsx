"use client";

import { useEffect, useMemo, useState } from "react";
import PetAuthForm from "@/components/auth/PetAuthForm";
import {
  getActivePetId,
  loadAlerts,
  loadCsvRecord,
  loadPetProfile,
  saveAlerts,
  saveCsvRecord,
} from "@/lib/jiv-storage";
import { parseThingSpeakCsvFile } from "@/lib/csv-parse";
import { evaluateAlertsFromCsvRecord, getWorstSeverityForPoint } from "@/lib/alert-logic";
import TemperatureLineChart from "@/components/charts/TemperatureLineChart";
import HeartRateLineChart from "@/components/charts/HeartRateLineChart";
import LocationMap from "@/components/maps/LocationMap";
import { Bell, UploadCloud, ShieldCheck } from "lucide-react";

type LatLng = { lat: number; lng: number };

function formatDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function severityPill(severity: "Normal" | "Warning" | "Critical") {
  if (severity === "Critical") {
    return { bg: "bg-red-50", border: "border-red-200", text: "text-red-800" };
  }
  if (severity === "Warning") {
    return {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-900",
    };
  }
  return { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-900" };
}

export default function DashboardPage() {
  const [petId, setPetId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csvRecordPoints, setCsvRecordPoints] = useState<
    Array<{
      timestampISO: string;
      temperatureC?: number;
      heartRateBpm?: number;
      latitude?: number;
      longitude?: number;
      activity?: number | string;
    }>
  >([]);
  const [alerts, setAlerts] = useState<ReturnType<typeof loadAlerts>>([]);
  const [lastUpdatedISO, setLastUpdatedISO] = useState<string | null>(null);

  const [profileSimMobile, setProfileSimMobile] = useState<string>("");

  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  useEffect(() => {
    const id = getActivePetId();
    if (id) setPetId(id);
  }, []);

  useEffect(() => {
    if (!petId) return;
    const rec = loadCsvRecord(petId);
    const storedAlerts = loadAlerts(petId);
    const profile = loadPetProfile(petId);

    setCsvRecordPoints(rec?.points ?? []);
    setAlerts(storedAlerts ?? []);
    setLastUpdatedISO(rec?.uploadedAt ?? null);
    setProfileSimMobile(profile?.linkedSimMobile ?? "");
  }, [petId]);

  const latestPoint = useMemo(() => {
    if (csvRecordPoints.length === 0) return null;
    return csvRecordPoints[csvRecordPoints.length - 1] ?? null;
  }, [csvRecordPoints]);

  const worstSeverity = useMemo(() => {
    if (!latestPoint) return "Normal" as const;
    return getWorstSeverityForPoint(
      latestPoint.temperatureC,
      latestPoint.heartRateBpm
    ) as "Normal" | "Warning" | "Critical";
  }, [latestPoint]);

  const status = worstSeverity === "Normal" ? "Normal" : "Alert";
  const statusPill = severityPill(worstSeverity);

  const currentTemp = latestPoint?.temperatureC;
  const currentHr = latestPoint?.heartRateBpm;

  const tempSeverity = useMemo(() => {
    if (currentTemp === undefined) return "Normal" as const;
    const s = getWorstSeverityForPoint(currentTemp, currentHr);
    return s;
  }, [currentTemp, currentHr]);

  const hrSeverity = useMemo(() => {
    if (currentHr === undefined) return "Normal" as const;
    const s = getWorstSeverityForPoint(currentTemp, currentHr);
    return s;
  }, [currentTemp, currentHr]);

  const coloredAlerts = useMemo(() => {
    // Evaluate only the latest point for the "Alert Logic" display.
    if (!latestPoint) return [];
    const out: Array<{
      label: string;
      severity: "Normal" | "Warning" | "Critical";
      met: boolean;
      displayColor: string;
    }> = [];

    const t = latestPoint.temperatureC;
    const hr = latestPoint.heartRateBpm;

    const tempCritical = t !== undefined && t >= 41;
    const tempFever = t !== undefined && t > 39.4;
    const tempHypo = t !== undefined && t < 37.2;

    out.push({
      label: "Fever Alert (Temp > 39.4°C)",
      met: !!tempFever,
      severity: tempCritical ? "Critical" : tempFever ? "Warning" : "Normal",
      displayColor: tempCritical ? "red" : tempFever ? "amber" : "emerald",
    });
    out.push({
      label: "Hypothermia Alert (Temp < 37.2°C)",
      met: !!tempHypo,
      severity: tempHypo ? "Warning" : "Normal",
      displayColor: tempHypo ? "amber" : "emerald",
    });
    out.push({
      label: "Critical Alert (Temp ≥ 41°C)",
      met: !!tempCritical,
      severity: tempCritical ? "Critical" : "Normal",
      displayColor: tempCritical ? "red" : "emerald",
    });

    const brady = hr !== undefined && hr < 60;
    const tachy = hr !== undefined && hr > 180;
    out.push({
      label: "Bradycardia (Heart Rate < 60 bpm)",
      met: !!brady,
      severity: brady ? "Warning" : "Normal",
      displayColor: brady ? "amber" : "emerald",
    });
    out.push({
      label: "Tachycardia (Heart Rate > 180 bpm)",
      met: !!tachy,
      severity: tachy ? "Critical" : "Normal",
      displayColor: tachy ? "red" : "emerald",
    });

    return out;
  }, [latestPoint]);

  const locationPath: LatLng[] = useMemo(() => {
    return csvRecordPoints
      .filter((p) => p.latitude !== undefined && p.longitude !== undefined)
      .map((p) => ({ lat: p.latitude as number, lng: p.longitude as number }));
  }, [csvRecordPoints]);

  const latestLatLng = useMemo(() => {
    if (!latestPoint?.latitude || !latestPoint?.longitude) return null;
    if (latestPoint.latitude === 0 && latestPoint.longitude === 0) return null;
    return { lat: latestPoint.latitude, lng: latestPoint.longitude };
  }, [latestPoint]);

  async function onShowResults() {
    if (!petId) return;
    if (!fileToUpload) {
      setError("Please select a CSV file first.");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const rec = await parseThingSpeakCsvFile(petId, fileToUpload);
      const computedAlerts = evaluateAlertsFromCsvRecord(rec);
      saveCsvRecord(rec);
      saveAlerts(petId, computedAlerts);

      setCsvRecordPoints(rec.points);
      setAlerts(computedAlerts);
      setLastUpdatedISO(rec.uploadedAt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load CSV.");
    } finally {
      setBusy(false);
    }
  }

  if (!petId) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900">
          JIVRAKSHAK – Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Smart pet monitoring dashboard for academic demonstration.
        </p>

        <div className="mt-6">
          <PetAuthForm onAuthenticated={(id) => setPetId(id)} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            LIVE MONITORING DASHBOARD
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Monitoring for health, activity, and safety from CSV (ThingSpeak export).
          </p>
        </div>
        <div className="rounded-xl border border-slate-200/70 bg-white/70 px-4 py-3 text-xs text-slate-700">
          Active Pet ID: <span className="font-semibold">{petId}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1 rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">
              Pet Information Panel
            </div>
            <ShieldCheck className="h-4 w-4 text-sky-700" />
          </div>
          <div className="mt-5 space-y-3 text-sm">
            <div>
              <div className="text-xs font-medium text-slate-600">Pet ID</div>
              <div className="font-semibold text-slate-900">{petId}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-600">
                Last Updated Time
              </div>
              <div className="font-semibold text-slate-900">
                {lastUpdatedISO ? formatDateTime(lastUpdatedISO) : "—"}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-600">Status</div>
              <div
                className={`mt-1 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusPill.bg} ${statusPill.border} ${statusPill.text}`}
              >
                {status}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">
                CSV Upload (ThingSpeak Export)
              </div>
              <div className="mt-1 text-xs text-slate-600">
                Upload CSV and click <span className="font-semibold">Show Results</span>.
              </div>
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
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setFileToUpload(f);
                }}
              />
            </label>

            <button
              type="button"
              disabled={!fileToUpload || busy}
              onClick={onShowResults}
              className="rounded-xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Processing..." : "Show Results"}
            </button>
          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
              {error}
            </div>
          ) : null}
          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs leading-6 text-slate-700">
            After upload, the dashboard generates charts, location path, and alerts
            based on predefined temperature/heart-rate threshold logic.
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1 rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="text-sm font-semibold text-slate-900">
            Health Monitoring
          </div>
          <div className="mt-5 space-y-4">
            <div>
              <div className="text-xs font-medium text-slate-600">
                Temperature (°C)
              </div>
              <div className="mt-1 text-2xl font-bold text-slate-900">
                {currentTemp !== undefined ? currentTemp.toFixed(1) : "—"}
              </div>
              <div className="mt-2 text-xs text-slate-600">
                Severity:{" "}
                <span className={`font-semibold ${severityPill(tempSeverity).text}`}>
                  {tempSeverity}
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-600">
                Heart Rate (BPM)
              </div>
              <div className="mt-1 text-2xl font-bold text-slate-900">
                {currentHr !== undefined ? currentHr.toFixed(0) : "—"}
              </div>
              <div className="mt-2 text-xs text-slate-600">
                Severity:{" "}
                <span className={`font-semibold ${severityPill(hrSeverity).text}`}>
                  {hrSeverity}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-slate-900">
              Alert Logic (Threshold Evaluation)
            </div>
            <Bell className="h-4 w-4 text-sky-700" />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {coloredAlerts.map((a) => {
              const pill =
                a.severity === "Critical"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : a.severity === "Warning"
                    ? "border-amber-200 bg-amber-50 text-amber-900"
                    : "border-emerald-200 bg-emerald-50 text-emerald-900";

              return (
                <div
                  key={a.label}
                  className={`rounded-xl border px-4 py-3 ${pill}`}
                >
                  <div className="text-xs font-semibold">{a.label}</div>
                  <div className="mt-1 text-xs">
                    Status:{" "}
                    <span className="font-bold">{a.met ? a.severity : "Normal"}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {latestPoint ? (
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs leading-6 text-slate-700">
              Latest data point evaluated. For live location, call the SIM number attached to the collar:{" "}
              <span className="font-semibold">{profileSimMobile || "—"}</span>
            </div>
          ) : (
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs leading-6 text-slate-700">
              Upload a CSV to evaluate alert thresholds and show current health status.
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div>
          <TemperatureLineChart points={csvRecordPoints} />
        </div>
        <div>
          <HeartRateLineChart points={csvRecordPoints} />
        </div>
      </div>

      <div className="mt-4">
        <LocationMap path={locationPath} latest={latestLatLng} />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-900">
              Alert Logs
            </div>
            <div className="mt-1 text-xs text-slate-600">
              Time • Parameter • Value • Status
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-auto">
          <table className="min-w-[640px] w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-600">
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Parameter</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {alerts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-5 text-xs text-slate-600">
                    No alerts detected yet. Upload a CSV to generate alert events.
                  </td>
                </tr>
              ) : (
                alerts
                  .slice(-50)
                  .reverse()
                  .map((a, idx) => {
                    const time = formatDateTime(a.timeISO);
                    const pill =
                      a.status === "Critical"
                        ? "text-red-800"
                        : a.status === "Warning"
                          ? "text-amber-900"
                          : "text-emerald-900";
                    return (
                      <tr
                        key={`${a.timeISO}-${idx}-${a.alertType}`}
                        className="border-t border-slate-100"
                      >
                        <td className="px-4 py-3 text-xs text-slate-700">
                          {time}
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

        <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs leading-6 text-slate-700">
          Important Notes: This page is for monitoring only. Data comes from uploaded CSV
          (ThingSpeak export). No live sensor connection is shown in this academic demo.
        </div>
      </div>
    </div>
  );
}

