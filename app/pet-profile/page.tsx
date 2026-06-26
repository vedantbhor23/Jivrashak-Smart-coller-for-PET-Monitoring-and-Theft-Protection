"use client";

import { useEffect, useMemo, useState } from "react";
import PetAuthForm from "@/components/auth/PetAuthForm";
import {
  getActivePetId,
  loadPetProfile,
  savePetProfile,
  type PetProfile,
} from "@/lib/jiv-storage";
import { ClipboardList, Stethoscope, LayoutDashboard } from "lucide-react";
import Link from "next/link";

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

export default function PetProfilePage() {
  const [petId, setPetId] = useState<string | null>(null);
  const [profile, setProfile] = useState<PetProfile | null>(null);
  const [busy, setBusy] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    const id = getActivePetId();
    if (id) setPetId(id);
  }, []);

  useEffect(() => {
    if (!petId) return;
    const p = loadPetProfile(petId);
    setProfile(p);
  }, [petId]);

  const lastUpdated = useMemo(() => profile?.lastUpdatedISO ?? null, [profile]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setBusy(true);
    setSaveMsg(null);
    try {
      savePetProfile({
        ...profile,
        lastUpdatedISO: new Date().toISOString(),
        registrationStatus: "Active",
      });
      setSaveMsg("Pet profile saved successfully");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">PET PROFILE</h1>
        <p className="mt-2 text-sm text-slate-600">
          Digital medical card for each pet. Connected to Dashboard, Health Logs, and Vet section.
        </p>
      </div>

      {!petId ? (
        <div className="mt-6">
          <PetAuthForm onAuthenticated={(id) => setPetId(id)} />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    Pet Profile Card
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    Manage pet identity and medical notes (no live sensor data here).
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800">
                  Collar ID: {petId}
                </div>
              </div>

              <form onSubmit={onSave} className="mt-6 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-1">
                    <div className="text-xs font-medium text-slate-700">
                      Pet Name
                    </div>
                    <input
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-300"
                      value={profile?.petName ?? ""}
                      onChange={(e) =>
                        setProfile((prev) =>
                          prev
                            ? { ...prev, petName: e.target.value }
                            : prev
                        )
                      }
                      placeholder="e.g., Max"
                      required
                    />
                  </label>
                  <label className="space-y-1">
                    <div className="text-xs font-medium text-slate-700">
                      Breed
                    </div>
                    <input
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-300"
                      value={profile?.breed ?? ""}
                      onChange={(e) =>
                        setProfile((prev) =>
                          prev
                            ? { ...prev, breed: e.target.value }
                            : prev
                        )
                      }
                      placeholder="e.g., Labrador"
                      required
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-1">
                    <div className="text-xs font-medium text-slate-700">Age</div>
                    <input
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-300"
                      value={profile?.ageYears ?? ""}
                      onChange={(e) => {
                        const raw = e.target.value;
                        setProfile((prev) =>
                          prev
                            ? {
                                ...prev,
                                ageYears: raw === "" ? "" : Number(raw),
                              }
                            : prev
                        );
                      }}
                      inputMode="numeric"
                      placeholder="e.g., 3"
                    />
                  </label>
                  <label className="space-y-1">
                    <div className="text-xs font-medium text-slate-700">
                      Weight (kg)
                    </div>
                    <input
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-300"
                      value={profile?.weightKg ?? ""}
                      onChange={(e) => {
                        const raw = e.target.value;
                        setProfile((prev) =>
                          prev
                            ? {
                                ...prev,
                                weightKg: raw === "" ? "" : Number(raw),
                              }
                            : prev
                        );
                      }}
                      inputMode="decimal"
                      placeholder="e.g., 18.5"
                    />
                  </label>
                </div>

                <label className="space-y-1">
                  <div className="text-xs font-medium text-slate-700">
                    Owner Name
                  </div>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-300"
                    value={profile?.ownerName ?? ""}
                    onChange={(e) =>
                      setProfile((prev) =>
                        prev
                          ? { ...prev, ownerName: e.target.value }
                          : prev
                      )
                    }
                    placeholder="e.g., Vedant"
                    required
                  />
                </label>

                <label className="space-y-1">
                  <div className="text-xs font-medium text-slate-700">
                    Medical Notes (editable)
                  </div>
                  <textarea
                    className="min-h-[110px] w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-300"
                    value={profile?.medicalNotes ?? ""}
                    onChange={(e) =>
                      setProfile((prev) =>
                        prev
                          ? { ...prev, medicalNotes: e.target.value }
                          : prev
                      )
                    }
                    placeholder="Allergies, known issues, routine notes..."
                  />
                </label>

                {saveMsg ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
                    {saveMsg}
                  </div>
                ) : null}

                <button
                  disabled={!profile || busy}
                  className="rounded-xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
                  type="submit"
                >
                  {busy ? "Saving..." : "Save Profile"}
                </button>
              </form>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
              <div className="text-sm font-semibold text-slate-900">
                Profile Status
              </div>
              <div className="mt-5 space-y-4 text-sm">
                <div>
                  <div className="text-xs font-medium text-slate-600">
                    Registration Status
                  </div>
                  <div className="font-semibold text-slate-900">
                    {profile?.registrationStatus ?? "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-600">
                    Last Updated Time
                  </div>
                  <div className="font-semibold text-slate-900">
                    {lastUpdated ? formatDateTime(lastUpdated) : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-600">
                    Linked SIM Number
                  </div>
                  <div className="font-semibold text-slate-900">
                    {profile?.linkedSimMobile ?? "—"}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs leading-6 text-slate-700">
                This page manages pet identity and profile only. No graphs, no live sensor data.
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
              <div className="text-sm font-semibold text-slate-900">
                Profile Connections
              </div>
              <div className="mt-4 grid gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-sky-50"
                >
                  <span className="inline-flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4 text-sky-700" />
                    View Dashboard
                  </span>
                  <span className="text-xs text-slate-500">→</span>
                </Link>
                <Link
                  href="/health-logs"
                  className="inline-flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-sky-50"
                >
                  <span className="inline-flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-sky-700" />
                    View Health Logs
                  </span>
                  <span className="text-xs text-slate-500">→</span>
                </Link>
                <Link
                  href="/vet-connect"
                  className="inline-flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-emerald-50"
                >
                  <span className="inline-flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-emerald-700" />
                    Vet Consultation
                  </span>
                  <span className="text-xs text-slate-500">→</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

