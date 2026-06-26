"use client";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ActivityLevelChart({
  points,
}: {
  points: Array<{
    timestampISO: string;
    activity?: number | string;
  }>;
}) {
  const extracted = points
    .map((p) => {
      if (typeof p.activity === "number" && Number.isFinite(p.activity)) {
        return { t: p.timestampISO, v: p.activity };
      }
      if (typeof p.activity === "string") {
        const n = Number(p.activity);
        if (Number.isFinite(n)) return { t: p.timestampISO, v: n };
      }
      return null;
    })
    .filter(Boolean) as Array<{ t: string; v: number }>;

  if (extracted.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 text-sm text-slate-700">
        Activity data is not available in the uploaded CSV (expected an
        `Activity` / `Movement` column).
      </div>
    );
  }

  const labels = extracted.map((p) => formatTime(p.t));
  const values = extracted.map((p) => p.v);

  const data = {
    labels,
    datasets: [
      {
        label: "Activity / Movement intensity",
        data: values,
        backgroundColor: values.map((v) =>
          v >= 80 ? "rgba(220,38,38,0.75)" : "rgba(16,185,129,0.65)"
        ),
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
    },
    scales: {
      y: {
        grid: { color: "rgba(15, 23, 42, 0.06)" },
      },
      x: {
        grid: { color: "rgba(15, 23, 42, 0.04)" },
      },
    },
  } as const;

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 shadow-sm">
      <div className="text-sm font-semibold text-slate-900">
        Pet Activity Level Over Time
      </div>
      <div className="mt-1 text-xs text-slate-600">
        Bar chart from uploaded CSV (academic representation).
      </div>

      <div className="mt-4 h-72">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

