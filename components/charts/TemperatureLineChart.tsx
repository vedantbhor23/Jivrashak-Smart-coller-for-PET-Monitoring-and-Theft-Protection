"use client";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import type { TooltipItem } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

function severityColor(tempC: number) {
  if (tempC >= 41) return { fill: "#dc2626", stroke: "#b91c1c" }; // red critical
  if (tempC > 39.4 || tempC < 37.2) return { fill: "#f59e0b", stroke: "#d97706" }; // yellow warning
  return { fill: "#10b981", stroke: "#059669" }; // green normal
}

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function TemperatureLineChart({
  points,
}: {
  points: Array<{ timestampISO: string; temperatureC?: number }>;
}) {
  const filtered = points.filter(
    (p) => p.temperatureC !== undefined && Number.isFinite(p.temperatureC)
  );

  const labels = filtered.map((p) => formatTime(p.timestampISO));
  const values = filtered.map((p) => p.temperatureC as number);
  const colors = values.map((v) => severityColor(v));

  const data = {
    labels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: values,
        borderWidth: 2,
        borderColor: "#0ea5e9",
        tension: 0.25,
        pointRadius: 4,
        pointBackgroundColor: colors.map((c) => c.fill),
        pointBorderColor: colors.map((c) => c.stroke),
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<"line">) => {
            const y = ctx.parsed?.y;
            const v = typeof y === "number" ? y : Number(y);
            return ` ${v.toFixed(1)} °C`;
          },
        },
      },
    },
    scales: {
      y: {
        title: { display: true, text: "°C" },
        grid: { color: "rgba(15, 23, 42, 0.06)" },
      },
      x: {
        grid: { color: "rgba(15, 23, 42, 0.04)" },
      },
    },
  } as const;

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">
            Temperature vs Time
          </div>
          <div className="mt-1 text-xs text-slate-600">
            Alert zones: Fever & Hypothermia (yellow), Critical (red)
          </div>
        </div>
      </div>

      <div className="mt-4 h-72">
        <Line data={data} options={options} />
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Normal
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
          Warning
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          Critical
        </div>
      </div>
    </div>
  );
}

