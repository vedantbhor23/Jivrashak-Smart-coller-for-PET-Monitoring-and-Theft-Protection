import type { AlertEvent, JivCsvRecord } from "@/lib/jiv-storage";

function toISOStringOrFallback(timeISO: string) {
  const d = new Date(timeISO);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function evaluateTemperature(temperatureC?: number) {
  if (temperatureC === undefined || Number.isNaN(temperatureC)) return null;
  if (temperatureC >= 41) {
    return {
      alertType: "Critical Alert" as const,
      status: "Critical" as const,
      parameter: "Temperature" as const,
      value: `${temperatureC.toFixed(1)}°C`,
    };
  }
  if (temperatureC > 39.4) {
    return {
      alertType: "Fever Alert" as const,
      status: "Warning" as const,
      parameter: "Temperature" as const,
      value: `${temperatureC.toFixed(1)}°C`,
    };
  }
  if (temperatureC < 37.2) {
    return {
      alertType: "Hypothermia Alert" as const,
      status: "Warning" as const,
      parameter: "Temperature" as const,
      value: `${temperatureC.toFixed(1)}°C`,
    };
  }
  return null;
}

function evaluateHeartRate(heartRateBpm?: number) {
  if (heartRateBpm === undefined || Number.isNaN(heartRateBpm)) return null;
  if (heartRateBpm > 180) {
    return {
      alertType: "Tachycardia" as const,
      status: "Critical" as const,
      parameter: "Heart Rate" as const,
      value: `${heartRateBpm.toFixed(0)} bpm`,
    };
  }
  if (heartRateBpm < 60) {
    return {
      alertType: "Bradycardia" as const,
      status: "Warning" as const,
      parameter: "Heart Rate" as const,
      value: `${heartRateBpm.toFixed(0)} bpm`,
    };
  }
  return null;
}

function evaluateMovement(activity?: number | string) {
  if (activity === undefined || activity === null) return null;

  if (typeof activity === "number") {
    if (activity === 0) {
      return {
        alertType: "No Movement" as const,
        status: "Warning" as const,
        parameter: "Movement" as const,
        value: "No movement",
      };
    }
    if (activity >= 80) {
      return {
        alertType: "Sudden Movement" as const,
        status: "Warning" as const,
        parameter: "Movement" as const,
        value: `Intensity ${activity}`,
      };
    }
    return null;
  }

  const s = String(activity).trim().toLowerCase();
  if (!s) return null;
  if (s.includes("sudden")) {
    return {
      alertType: "Sudden Movement" as const,
      status: "Warning" as const,
      parameter: "Movement" as const,
      value: "Sudden",
    };
  }
  if (s.includes("no") || s.includes("inactive") || s.includes("none")) {
    return {
      alertType: "No Movement" as const,
      status: "Warning" as const,
      parameter: "Movement" as const,
      value: "Inactive",
    };
  }
  return null;
}

function evaluateTamper(latitude?: number, longitude?: number) {
  const latMissing = latitude === undefined || latitude === 0;
  const lonMissing = longitude === undefined || longitude === 0;
  if (latMissing || lonMissing) {
    return {
      alertType: "Tamper Alert" as const,
      status: "Critical" as const,
      parameter: "Tamper" as const,
      value: "Location missing/invalid",
    };
  }
  return null;
}

export function evaluateAlertsFromCsvRecord(record: JivCsvRecord): AlertEvent[] {
  const alerts: AlertEvent[] = [];

  for (const p of record.points) {
    const timeISO = toISOStringOrFallback(p.timestampISO);

    const temp = evaluateTemperature(p.temperatureC);
    if (temp) {
      alerts.push({
        timeISO,
        parameter: temp.parameter,
        value: temp.value,
        status: temp.status,
        alertType: temp.alertType,
      });
    }

    const hr = evaluateHeartRate(p.heartRateBpm);
    if (hr) {
      alerts.push({
        timeISO,
        parameter: hr.parameter,
        value: hr.value,
        status: hr.status,
        alertType: hr.alertType,
      });
    }

    const movement = evaluateMovement(p.activity);
    if (movement) {
      alerts.push({
        timeISO,
        parameter: movement.parameter,
        value: movement.value,
        status: movement.status,
        alertType: movement.alertType,
      });
    }

    const tamper = evaluateTamper(p.latitude, p.longitude);
    if (tamper) {
      alerts.push({
        timeISO,
        parameter: tamper.parameter,
        value: tamper.value,
        status: tamper.status,
        alertType: tamper.alertType,
      });
    }
  }

  // Sort ascending by time
  alerts.sort((a, b) => new Date(a.timeISO).getTime() - new Date(b.timeISO).getTime());
  return alerts;
}

export function getWorstSeverityForPoint(temperatureC?: number, heartRateBpm?: number) {
  const temp = evaluateTemperature(temperatureC);
  const hr = evaluateHeartRate(heartRateBpm);
  const statuses = [temp?.status, hr?.status].filter(Boolean) as Array<
    "Warning" | "Critical"
  >;
  if (statuses.includes("Critical")) return "Critical";
  if (statuses.includes("Warning")) return "Warning";
  return "Normal";
}

