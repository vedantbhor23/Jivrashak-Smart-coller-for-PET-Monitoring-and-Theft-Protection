import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/70 backdrop-blur">
      <div className="mx-auto w-full max-w-7xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-2">
            <div className="text-sm font-semibold text-slate-900">Jivrakshak</div>
            <div className="text-sm text-slate-600">
              Smart Monitoring for a Safer Pet Life
            </div>
            <div className="text-xs text-slate-500">College Project</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold text-slate-900">Team & Guide</div>
            <div className="text-sm text-slate-600">Placeholder: Team members & guide info</div>
            <div className="text-xs text-slate-500">Academic demonstration</div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-slate-900">Links</div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/about"
                className="rounded-full border border-slate-200/70 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-sky-50"
              >
                Contact / About
              </Link>
            </div>
            <div className="text-xs text-slate-500">
              Navigation for dashboard, logs, alerts, and pet care.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

