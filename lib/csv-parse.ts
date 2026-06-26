import Papa from "papaparse";
import type { JivCsvRecord } from "@/lib/jiv-storage";

function normalizeHeader(h: string) {
  return h.toLowerCase().replace(/[\s_-]+/g, "");
}

function parseMaybeNumber(value: unknown): number | undefined {
  if (value === null || value === undefined) return undefined;
  const raw = String(value).trim();
  if (!raw) return undefined;
  const cleaned = raw.replace(/[^0-9.+-eE]/g, "");
  if (!cleaned) return undefined;
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : undefined;
}

function parseTimestampISO(value: unknown): string {
  if (value === null || value === undefined) return new Date().toISOString();
  const raw = String(value).trim();
  if (!raw) return new Date().toISOString();

  // If numeric epoch is provided.
  if (/^\d+(\.\d+)?$/.test(raw)) {
    const n = Number(raw);
    // Seconds vs milliseconds heuristic.
    const ms = raw.length <= 10 ? n * 1000 : n;
    const d = new Date(ms);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }

  const d = new Date(raw);
  if (!Number.isNaN(d.getTime())) return d.toISOString();
  return new Date().toISOString();
}

export async function parseThingSpeakCsvFile(
  petId: string,
  file: File
): Promise<JivCsvRecord> {
  const text = await file.text();

  const parsed = Papa.parse<Record<string, unknown>>(text, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors?.length) {
    // Keep it user-friendly for academic demo.
    throw new Error(
      `CSV parse error: ${parsed.errors[0]?.message ?? "Unknown error"}`
    );
  }

  const rows = (parsed.data ?? []).filter((r) => r && Object.keys(r).length > 0);

  // Build header map once.
  const first = rows[0] ?? {};
  const headerMap: Record<
    "timestamp" | "temperature" | "heartRate" | "latitude" | "longitude" | "activity",
    string | null
  > = {
    timestamp: null,
    temperature: null,
    heartRate: null,
    latitude: null,
    longitude: null,
    activity: null,
  };

  for (const key of Object.keys(first)) {
    const h = normalizeHeader(key);
    if (!headerMap.timestamp && (h.includes("timestamp") || h === "time" || h.includes("time"))) {
      headerMap.timestamp = key;
      continue;
    }
    if (!headerMap.temperature && (h.includes("temperature") || h === "temp" || h.includes("temp"))) {
      headerMap.temperature = key;
      continue;
    }
    if (!headerMap.heartRate && (h.includes("heartrate") || (h.includes("heart") && h.includes("rate")) || h.includes("heartbpm"))) {
      headerMap.heartRate = key;
      continue;
    }
    if (!headerMap.latitude && (h.includes("latitude") || h === "lat")) {
      headerMap.latitude = key;
      continue;
    }
    if (!headerMap.longitude && (h.includes("longitude") || h === "lon" || h === "lng")) {
      headerMap.longitude = key;
      continue;
    }
    if (!headerMap.activity && (h.includes("activity") || h.includes("movement") || h.includes("intensity") || h.includes("motion"))) {
      headerMap.activity = key;
      continue;
    }
  }

  const points = rows.map((row) => {
    const timestampISO = parseTimestampISO(
      headerMap.timestamp ? row[headerMap.timestamp] : undefined
    );

    const activityRaw = headerMap.activity
      ? row[headerMap.activity]
      : undefined;
    const activityNum = headerMap.activity ? parseMaybeNumber(activityRaw) : undefined;
    const activityValue =
      activityNum !== undefined
        ? activityNum
        : activityRaw === null || activityRaw === undefined
          ? undefined
          : typeof activityRaw === "object"
            ? undefined
            : String(activityRaw);

    return {
      timestampISO,
      temperatureC: headerMap.temperature
        ? parseMaybeNumber(row[headerMap.temperature])
        : undefined,
      heartRateBpm: headerMap.heartRate
        ? parseMaybeNumber(row[headerMap.heartRate])
        : undefined,
      latitude: headerMap.latitude
        ? parseMaybeNumber(row[headerMap.latitude])
        : undefined,
      longitude: headerMap.longitude
        ? parseMaybeNumber(row[headerMap.longitude])
        : undefined,
      activity: headerMap.activity ? activityValue : undefined,
    };
  });

  // Sort by time to keep charts/map consistent.
  points.sort(
    (a, b) => new Date(a.timestampISO).getTime() - new Date(b.timestampISO).getTime()
  );

  return {
    petId,
    uploadedAt: new Date().toISOString(),
    points,
  };
}

