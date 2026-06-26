import Image from "next/image";
import Link from "next/link";
import {
  Brain,
  ShieldCheck,
  Syringe,
  Stethoscope,
  LayoutDashboard,
  Newspaper,
  UserRound,
  Bell,
} from "lucide-react";

const nav = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pet-profile", label: "Pet Profile", icon: UserRound },
  { href: "/health-logs", label: "Health Logs", icon: Stethoscope },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/ml-insights", label: "ML Insights", icon: Brain },
  { href: "/pet-care", label: "Pet Care & Blogs", icon: Newspaper },
  { href: "/vet-connect", label: "Vet Connect", icon: Syringe },
  { href: "/about", label: "About / Contact", icon: ShieldCheck },
] as const;

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/70 backdrop-blur">
      <div className="mx-auto w-full max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-slate-200 bg-white">
              <Image src="/assets/logo.png" alt="Jivrakshak logo" fill sizes="40px" priority />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-wide text-slate-900">
                JIVRAKSHAK
              </span>
              <span className="text-xs text-slate-600">
                Smart Pet Monitoring & Care
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.slice(1).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-sky-50 hover:text-slate-900"
                >
                  <Icon className="h-3.5 w-3.5 text-sky-700/70 transition group-hover:text-emerald-700" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

