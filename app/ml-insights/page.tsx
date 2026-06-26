"use client";

import { useMemo } from "react";
import TemperatureLineChart from "@/components/charts/TemperatureLineChart";
import HeartRateLineChart from "@/components/charts/HeartRateLineChart";
import ActivityLevelChart from "@/components/charts/ActivityLevelChart";

function nowMinusMinutes(mins: number) {
  return new Date(Date.now() - mins * 60 * 1000).toISOString();
}

export default function MlInsightsPage() {
  const dummyPoints = useMemo(() => {
    const times = Array.from({ length: 12 }).map((_, i) => nowMinusMinutes((11 - i) * 5));
    return times.map((t, idx) => ({
      timestampISO: t,
      temperatureC: 38.1 + Math.sin(idx / 2) * 1.6 + (idx % 5 === 0 ? 0.9 : 0),
      heartRateBpm: 72 + Math.cos(idx / 2) * 25 + (idx % 6 === 0 ? 35 : 0),
      latitude: 18.5206 + idx * 0.0012,
      longitude: 73.8567 + idx * 0.001,
      activity: idx % 4 === 0 ? 0 : 60 + (idx % 7) * 5,
    }));
  }, []);

  const predicted = useMemo(() => {
    // Dummy deterministic "prediction" for academic UI.
    // In real future version, replace with ML inference using historical patterns.
    const last = dummyPoints[dummyPoints.length - 1];
    const temp = last.temperatureC ?? 0;
    const hr = last.heartRateBpm ?? 0;
    if (temp >= 41 || hr > 180) {
      return { status: "Critical", risk: "High", suggested: "Vet Consultation" };
    }
    if (temp > 39.4 || temp < 37.2 || hr < 60 || hr > 180) {
      return { status: "Warning", risk: "Medium", suggested: "Observation / Vet Consultation" };
    }
    return { status: "Normal", risk: "Low", suggested: "Observation" };
  }, [dummyPoints]);

  const behavior = useMemo(() => {
    const lastActivity = dummyPoints[dummyPoints.length - 1].activity;
    if (typeof lastActivity === "number" && lastActivity === 0) {
      return "Inactive State";
    }
    return "Normal Activity";
  }, [dummyPoints]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">ML Insights – Future Scope</h1>
        <p className="mt-2 text-sm text-slate-600">
          Predictive analysis and intelligent insights based on pet health data.
        </p>
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-900">
          This section represents future enhancements and uses sample data for demonstration purposes.
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="text-sm font-semibold text-slate-900">
            Health Risk Prediction (Demo)
          </div>
          <div className="mt-1 text-xs text-slate-600">
            Health risk prediction based on temperature, heart rate, and activity patterns using machine learning models.
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-xs text-slate-600">Predicted Health Status</div>
              <div className="mt-2 text-xl font-bold text-slate-900">
                {predicted.status}
              </div>
              <div className="mt-2 text-xs text-slate-600">
                Normal / Warning / Critical
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-xs text-slate-600">Risk Level</div>
              <div className="mt-2 text-xl font-bold text-slate-900">
                {predicted.risk}
              </div>
              <div className="mt-2 text-xs text-slate-600">
                Low / Medium / High
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-xs text-slate-600">Suggested Action</div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                {predicted.suggested}
              </div>
              <div className="mt-2 text-xs text-slate-600">
                Demo UI suggestion only
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="text-sm font-semibold text-slate-900">Behavior Analysis</div>
          <div className="mt-1 text-xs text-slate-600">
            Behavior patterns are analyzed using historical activity and movement data.
          </div>
          <div className="mt-4 space-y-3 text-sm">
            {[
              { label: "Normal Activity", desc: "Consistent activity patterns" },
              { label: "Reduced Activity", desc: "Lower-than-usual movement intensity" },
              { label: "Abnormal Movement", desc: "Out-of-pattern movement spikes" },
              { label: "Inactive State", desc: "Extended inactivity window" },
            ].map((b) => {
              const active = b.label === behavior;
              return (
                <div
                  key={b.label}
                  className={`rounded-xl border p-4 ${
                    active
                      ? "border-sky-200 bg-sky-50/70"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="text-xs font-semibold text-slate-900">
                    {b.label}
                  </div>
                  <div className="mt-1 text-xs text-slate-600">{b.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <TemperatureLineChart points={dummyPoints} />
        <HeartRateLineChart points={dummyPoints} />
      </div>

      <div className="mt-4">
        <ActivityLevelChart points={dummyPoints} />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
        <div className="text-sm font-semibold text-slate-900">Insight Summary</div>
        <div className="mt-3 grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-xs text-slate-600">Overall Health Condition</div>
            <div className="mt-2 text-sm font-bold text-slate-900">
              {predicted.status}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-xs text-slate-600">Behavior Status</div>
            <div className="mt-2 text-sm font-bold text-slate-900">
              {behavior}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-xs text-slate-600">Risk Level</div>
            <div className="mt-2 text-sm font-bold text-slate-900">
              {predicted.risk}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-xs text-slate-600">Suggested Action</div>
            <div className="mt-2 text-sm font-bold text-slate-900">
              {predicted.suggested}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-xs leading-6 text-emerald-900">
          This module represents the future scope of the project. In future versions, real-time machine learning models will be integrated to provide automatic health predictions and anomaly detection.
        </div>

        <div className="mt-4 text-xs text-slate-600">
          IMPORTANT: This page is for demonstration and academic purpose only. Data shown here is sample or simulated. No real-time ML processing is implemented.
        </div>
      </div>
    </div>
  );
}

