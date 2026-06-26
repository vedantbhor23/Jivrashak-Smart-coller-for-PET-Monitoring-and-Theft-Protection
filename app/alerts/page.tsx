"use client";

import { useMemo, useState } from "react";
import { getActivePetId, loadAlerts, type AlertEvent } from "@/lib/jiv-storage";
import { Bell } from "lucide-react";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString([], { year: "numeric", month: "short", day: "2-digit" });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function AlertsPage() {
  const [petId] = useState<string | null>(() => getActivePetId());
  const [alerts] = useState<AlertEvent[]>(() => {
    const id = getActivePetId();
    if (!id) return [];
    return loadAlerts(id) ?? [];
  });

  const stats = useMemo(() => {
    const total = alerts.length;
    const critical = alerts.filter((a) => a.status === "Critical").length;
    const warning = alerts.filter((a) => a.status === "Warning").length;
    const last = alerts
      .slice()
      .sort((a, b) => new Date(b.timeISO).getTime() - new Date(a.timeISO).getTime())[0];
    return { total, critical, warning, lastTimeISO: last?.timeISO ?? null };
  }, [alerts]);

  const ordered = useMemo(() => {
    return alerts
      .slice()
      .sort((a, b) => new Date(b.timeISO).getTime() - new Date(a.timeISO).getTime())
      .slice(0, 200);
  }, [alerts]);

  const types = useMemo(() => {
    const map = [
      { key: "Fever Alert", label: "High Temperature Alert", hint: "Temp > 39.4°C → Fever; Temp ≥ 41°C → Critical" },
      { key: "Hypothermia Alert", label: "Low Temperature Alert", hint: "Temp < 37.2°C → Hypothermia" },
      { key: "Bradycardia", label: "Heart Rate Alert", hint: "Heart Rate < 60 bpm → Bradycardia; > 180 bpm → Tachycardia" },
      { key: "Sudden Movement", label: "Movement Alert", hint: "Sudden abnormal movement or inactivity (CSV dependent)" },
      { key: "Tamper Alert", label: "Tamper Alert", hint: "Collar removal / invalid location detected (CSV dependent)" },
    ];

    return map.map((t) => ({
      ...t,
      count: alerts.filter((a) => a.alertType === t.key).length,
    }));
  }, [alerts]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Alerts & Notifications</h1>
          <p className="mt-2 text-sm text-slate-600">
            Real-time alerts generated based on pet health and activity conditions.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200/70 bg-white/70 px-4 py-3 text-xs text-slate-700">
          {petId ? (
            <>
              Pet ID: <span className="font-semibold">{petId}</span>
            </>
          ) : (
            "Upload CSV from Dashboard/Health Logs"
          )}
        </div>
      </div>

      {!petId ? (
        <div className="mt-6 rounded-2xl border border-amber-200/70 bg-amber-50 p-6 text-sm text-amber-900">
          No active Pet ID found. Please register/login from the <a className="font-semibold underline" href="/dashboard">Dashboard</a> or upload CSV data in the Dashboard/Health Logs pages.
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
              <div className="text-xs text-slate-600">Total Alerts Detected</div>
              <div className="mt-2 text-3xl font-bold text-slate-900">{stats.total}</div>
            </div>
            <div className="rounded-2xl border border-red-200/70 bg-red-50/60 p-6 shadow-sm backdrop-blur">
              <div className="text-xs text-red-800">Critical Alerts</div>
              <div className="mt-2 text-3xl font-bold text-red-800">{stats.critical}</div>
            </div>
            <div className="rounded-2xl border border-amber-200/70 bg-amber-50/60 p-6 shadow-sm backdrop-blur">
              <div className="text-xs text-amber-900">Warning Alerts</div>
              <div className="mt-2 text-3xl font-bold text-amber-900">{stats.warning}</div>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
              <div className="text-xs text-slate-600">Last Alert Time</div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                {stats.lastTimeISO ? new Date(stats.lastTimeISO).toLocaleString() : "—"}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-1 rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-slate-900">Alert Types</div>
                <Bell className="h-4 w-4 text-sky-700" />
              </div>
              <div className="mt-4 space-y-3">
                {types.map((t) => (
                  <div
                    key={t.key}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-xs font-semibold text-slate-900">{t.label}</div>
                      <div
                        className={`text-xs font-semibold ${
                          t.count > 0
                            ? "text-sky-800"
                            : "text-slate-400"
                        }`}
                      >
                        {t.count} detected
                      </div>
                    </div>
                    <div className="mt-2 text-xs leading-5 text-slate-600">
                      {t.hint}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-slate-600">
                Alert data is generated from CSV files uploaded from ThingSpeak and processed using predefined threshold logic.
              </div>
            </div>

            <div className="lg:col-span-2 rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
              <div className="text-sm font-semibold text-slate-900">
                Alert Log
              </div>
              <div className="mt-1 text-xs text-slate-600">Date • Time • Alert Type • Parameter • Value • Status</div>

              <div className="mt-4 overflow-auto">
                <table className="min-w-[820px] w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-xs text-slate-600">
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Time</th>
                      <th className="px-4 py-3">Alert Type</th>
                      <th className="px-4 py-3">Parameter</th>
                      <th className="px-4 py-3">Value</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-xs text-slate-600">
                          No alerts detected. Upload a CSV from Dashboard/Health Logs to generate events.
                        </td>
                      </tr>
                    ) : (
                      ordered.map((a, idx) => {
                        const rowBg =
                          a.status === "Critical"
                            ? "bg-red-50/70"
                            : a.status === "Warning"
                              ? "bg-amber-50/70"
                              : "bg-emerald-50/70";
                        const statusText =
                          a.status === "Critical"
                            ? "text-red-800"
                            : a.status === "Warning"
                              ? "text-amber-900"
                              : "text-emerald-900";

                        return (
                          <tr key={`${a.timeISO}-${idx}`} className={`border-t border-slate-100 ${rowBg}`}>
                            <td className="px-4 py-3 text-xs text-slate-700">
                              {formatDate(a.timeISO)}
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-700">
                              {formatTime(a.timeISO)}
                            </td>
                            <td className="px-4 py-3 text-xs font-semibold text-slate-800">
                              {a.alertType}
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-700">
                              {a.parameter}
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-700">
                              {a.value}
                            </td>
                            <td className={`px-4 py-3 text-xs font-semibold ${statusText}`}>
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
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs leading-6 text-slate-700">
            Important Notes: This page displays alert events only. No graphs or raw sensor data are shown here. Designed for monitoring and safety verification in academic demonstrations.
          </div>
        </>
      )}
    </div>
  );
}

