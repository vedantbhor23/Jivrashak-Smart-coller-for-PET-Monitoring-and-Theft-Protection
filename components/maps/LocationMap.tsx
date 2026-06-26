"use client";

import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";

type LatLng = { lat: number; lng: number };

export default function LocationMap({
  path,
  latest,
}: {
  path: LatLng[];
  latest?: LatLng | null;
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const center = latest ?? path[0] ?? null;

  if (!center) {
    return (
      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 text-sm text-slate-700">
        Location map will appear after you upload a CSV containing Latitude and Longitude.
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-5">
        <div className="text-sm font-semibold text-slate-900">
          Map Placeholder
        </div>
        <div className="mt-2 text-xs leading-5 text-slate-600">
          Google Maps API key is not configured. Latest coordinates:
        </div>
        <div className="mt-2 text-xs text-slate-800">
          Lat: {center.lat.toFixed(6)} · Lng: {center.lng.toFixed(6)}
        </div>
        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
          To get live location, call the SIM number attached to the collar.
        </div>
      </div>
    );
  }

  const mapPath = path.map((p) => ({ lat: p.lat, lng: p.lng }));

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-0 overflow-hidden">
      <LoadScript googleMapsApiKey={apiKey}>
        <div className="h-80 w-full">
          <GoogleMap
            mapContainerClassName="h-full w-full"
            center={center}
            zoom={15}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              clickableIcons: false,
            }}
          >
            {mapPath.length > 1 ? (
              <Polyline
                path={mapPath}
                options={{
                  strokeColor: "#0ea5e9",
                  strokeOpacity: 0.7,
                  strokeWeight: 3,
                }}
              />
            ) : null}
            {latest ? (
              <Marker
                position={latest}
                options={{
                  icon: {
                    path: "M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z",
                    fillColor: "#059669",
                    fillOpacity: 0.9,
                    strokeColor: "#065f46",
                    strokeWeight: 1,
                    scale: 1.2,
                  },
                }}
              />
            ) : null}
          </GoogleMap>
        </div>
      </LoadScript>

      <div className="border-t border-slate-200/70 p-4">
        <div className="text-xs font-semibold text-slate-900">
          Latest location
        </div>
        <div className="mt-1 text-xs text-slate-700">
          Lat: {center.lat.toFixed(6)} · Lng: {center.lng.toFixed(6)}
        </div>
        <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
          To get live location, call the SIM number attached to the collar.
        </div>
      </div>
    </div>
  );
}

