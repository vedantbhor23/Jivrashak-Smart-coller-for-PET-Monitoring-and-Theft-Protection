"use client";

import { useEffect, useState } from "react";
import {
  getActivePetId,
  loadVetRequests,
  saveVetRequests,
  type VetAppointmentRequest,
} from "@/lib/jiv-storage";
import { CalendarDays, Phone, Stethoscope } from "lucide-react";

const vets = [
  {
    name: "Dr. A. Sharma",
    qualification: "Veterinary Physician",
    specialization: "General Care & Preventive Medicine",
    location: "Pune, Maharashtra",
    availability: "Available for Consultation",
  },
  {
    name: "Dr. R. Joshi",
    qualification: "Veterinary Surgeon",
    specialization: "Cardio & Monitoring Guidance",
    location: "Mumbai, Maharashtra",
    availability: "Online / Offline",
  },
  {
    name: "Dr. N. Kulkarni",
    qualification: "Veterinary Doctor",
    specialization: "Nutrition & Behavior",
    location: "Pune, Maharashtra",
    availability: "Online (Limited Slots)",
  },
] as const;

export default function VetConnectPage() {
  const [petId, setPetId] = useState<string>("");

  const [petOwnerName, setPetOwnerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [petName, setPetName] = useState("");
  const [petIdField, setPetIdField] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const id = getActivePetId();
    if (id) {
      setPetId(id);
      setPetIdField(id);
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMsg(null);
    if (!petIdField.trim()) {
      setError("Pet ID is required. Login/Register from Dashboard or Pet Profile first.");
      return;
    }
    if (
      !petOwnerName.trim() ||
      !mobileNumber.trim() ||
      !petName.trim() ||
      !issueDescription.trim() ||
      !preferredDate.trim() ||
      !preferredTime.trim()
    ) {
      setError("Please fill all fields.");
      return;
    }

    setBusy(true);
    try {
      const requests = loadVetRequests();
      const newReq: VetAppointmentRequest = {
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `req-${Date.now()}`,
        petOwnerName: petOwnerName.trim(),
        mobileNumber: mobileNumber.trim(),
        petName: petName.trim(),
        petId: petIdField.trim(),
        issueDescription: issueDescription.trim(),
        preferredDate: preferredDate.trim(),
        preferredTime: preferredTime.trim(),
        createdAtISO: new Date().toISOString(),
      };
      saveVetRequests([...requests, newReq]);
      setMsg("Appointment request submitted successfully. Vet will review and contact you.");
      setPetOwnerName("");
      setMobileNumber("");
      setPetName("");
      setIssueDescription("");
      setPreferredDate("");
      setPreferredTime("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit request.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Vet Connect</h1>
        <p className="mt-2 text-sm text-slate-600">
          Connect with veterinary professionals for guidance and consultation.
        </p>
      </div>

      <div className="mt-6">
        <div className="text-sm font-semibold text-slate-900">Veterinarians</div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {vets.map((v) => (
            <div
              key={v.name}
              className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur"
            >
              <div className="text-sm font-bold text-slate-900">{v.name}</div>
              <div className="mt-2 text-xs text-slate-600">{v.qualification}</div>
              <div className="mt-3 text-xs font-semibold text-slate-800">
                {v.specialization}
              </div>
              <div className="mt-2 text-xs text-slate-600">{v.location}</div>
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                {v.availability}
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
                <Phone className="h-4 w-4 text-sky-700" />
                Contact via appointment request (no direct phone on demo)
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-900">
              Appointment Request Form
            </div>
            <div className="mt-1 text-xs text-slate-600">
              Strictly communication and appointment requests only.
            </div>
          </div>
          <CalendarDays className="h-4 w-4 text-sky-700" />
        </div>

        <form onSubmit={onSubmit} className="mt-5 grid gap-4 lg:grid-cols-2">
          <label className="space-y-1">
            <div className="text-xs font-medium text-slate-700">Pet Owner Name</div>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-300"
              value={petOwnerName}
              onChange={(e) => setPetOwnerName(e.target.value)}
              required
              placeholder="Your name"
            />
          </label>
          <label className="space-y-1">
            <div className="text-xs font-medium text-slate-700">Mobile Number</div>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-300"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              inputMode="tel"
              required
              placeholder="e.g., 98xxxxxxxx"
            />
          </label>

          <label className="space-y-1">
            <div className="text-xs font-medium text-slate-700">Pet Name</div>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-300"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              required
              placeholder="Pet name"
            />
          </label>
          <label className="space-y-1">
            <div className="text-xs font-medium text-slate-700">Pet ID</div>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-300"
              value={petIdField}
              onChange={(e) => setPetIdField(e.target.value)}
              required
              placeholder={petId ? petId : "Login to auto-fill"}
            />
          </label>

          <label className="space-y-1 lg:col-span-2">
            <div className="text-xs font-medium text-slate-700">Issue Description</div>
            <textarea
              className="min-h-[120px] w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-300"
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              required
              placeholder="Symptoms observed, behavior changes, health concerns, emergency or general inquiry..."
            />
          </label>

          <label className="space-y-1">
            <div className="text-xs font-medium text-slate-700">Preferred Date</div>
            <input
              type="date"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-300"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              required
            />
          </label>
          <label className="space-y-1">
            <div className="text-xs font-medium text-slate-700">Preferred Time</div>
            <input
              type="time"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-300"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              required
            />
          </label>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800 lg:col-span-2">
              {error}
            </div>
          ) : null}
          {msg ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 lg:col-span-2">
              {msg}
            </div>
          ) : null}

          <div className="flex items-center gap-3 lg:col-span-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>

        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-900">
          ⚠ This platform is intended for communication and appointment requests only.
          It does not provide medical diagnosis or treatment. In case of emergency, please visit the nearest veterinary clinic immediately.
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-xs leading-6 text-slate-700">
          <Stethoscope className="mt-0.5 h-4 w-4 text-emerald-700" />
          This module represents a future enhancement of the system. In future versions, real-time consultation and automated health analysis may be integrated.
        </div>
      </div>
    </div>
  );
}

