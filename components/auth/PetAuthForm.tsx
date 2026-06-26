"use client";

import { useMemo, useState } from "react";
import { generatePetId } from "@/lib/jiv-crypto";
import {
  getUser,
  loadPetProfile,
  savePetProfile,
  setActivePetId,
  upsertUser,
} from "@/lib/jiv-storage";

type Props = {
  onAuthenticated: (petId: string) => void;
};

export default function PetAuthForm({ onAuthenticated }: Props) {
  const [ownerMobile, setOwnerMobile] = useState("");
  const [simMobile, setSimMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [generatedPetId, setGeneratedPetId] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return (
      ownerMobile.trim().length >= 8 &&
      simMobile.trim().length >= 8 &&
      password.length >= 4 &&
      confirmPassword.length >= 4
    );
  }, [ownerMobile, simMobile, password, confirmPassword]);

  async function sha256Hex(input: string) {
    const enc = new TextEncoder().encode(input);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    const bytes = new Uint8Array(buf);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      const petId = await generatePetId(ownerMobile, simMobile);
      setGeneratedPetId(petId);

      const existingUser = getUser(petId);
      const passwordHash = await sha256Hex(password);

      if (!existingUser) {
        // Register (demo-grade: localStorage, hashed password).
        upsertUser(petId, {
          ownerMobile: ownerMobile.trim(),
          simMobile: simMobile.trim(),
          passwordHash,
        });

        const existingProfile = loadPetProfile(petId);
        if (!existingProfile) {
          savePetProfile({
            petId,
            petName: "",
            breed: "",
            ageYears: "",
            weightKg: "",
            ownerName: "",
            medicalNotes: "",
            registrationStatus: "Active",
            linkedSimMobile: simMobile.trim(),
            lastUpdatedISO: new Date().toISOString(),
          });
        }

        setSuccessMsg("Pet registered successfully");
      } else {
        // Login (demo-grade).
        if (existingUser.passwordHash !== passwordHash) {
          setError("Invalid password.");
          return;
        }
        setSuccessMsg("Login successful");
      }

      setActivePetId(petId);
      onAuthenticated(petId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration/Login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
      <div className="mb-4">
        <div className="text-sm font-semibold text-slate-900">
          User Registration / Login
        </div>
        <div className="mt-1 text-xs leading-5 text-slate-600">
          Owner Mobile + SIM800L generate a unique Pet ID. Data is stored in
          localStorage for this academic demo.
        </div>
      </div>

      <form onSubmit={onSubmit} className="grid gap-4">
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="space-y-1">
            <div className="text-xs font-medium text-slate-700">
              Owner Mobile Number
            </div>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-300"
              value={ownerMobile}
              onChange={(e) => setOwnerMobile(e.target.value)}
              inputMode="tel"
              placeholder="e.g., 98xxxxxxxx"
              autoComplete="tel"
              required
            />
          </label>
          <label className="space-y-1">
            <div className="text-xs font-medium text-slate-700">
              SIM800L Mobile Number (used in collar)
            </div>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-300"
              value={simMobile}
              onChange={(e) => setSimMobile(e.target.value)}
              inputMode="tel"
              placeholder="e.g., 99xxxxxxxx"
              autoComplete="tel"
              required
            />
          </label>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <label className="space-y-1">
            <div className="text-xs font-medium text-slate-700">Password</div>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="new-password"
              required
            />
          </label>
          <label className="space-y-1">
            <div className="text-xs font-medium text-slate-700">
              Confirm Password
            </div>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-300"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              autoComplete="new-password"
              required
            />
          </label>
        </div>

        {generatedPetId ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
            Generated Pet ID: <span className="font-semibold">{generatedPetId}</span>
          </div>
        ) : null}

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
            {error}
          </div>
        ) : null}
        {successMsg ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
            {successMsg}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit || busy}
          className="rounded-xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Please wait..." : "Register / Login"}
        </button>
      </form>
    </div>
  );
}

