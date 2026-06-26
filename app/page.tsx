import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  Bell,
  Cloud,
  HeartPulse,
  ShieldCheck,
  ThermometerSun,
  BookOpen,
  UserRound,
  MapPin,
  ClipboardList,
  Stethoscope,
  LayoutDashboard,
} from "lucide-react";

const ButtonLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-200/70 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-sky-50"
    >
      {children}
    </Link>
  );
};

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 right-0 h-72 w-72 opacity-5">
          <Image
            src="/assets/logo.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </div>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-14 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs text-slate-700">
              <ShieldCheck className="h-3.5 w-3.5 text-sky-700" />
              Smart IoT Monitoring System
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              JIVRAKSHAK
            </h1>
            <p className="mt-2 text-xl font-semibold text-sky-800">
              Because Pets Deserve Smart Care
            </p>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-700">
              Jivrakshak is a smart pet monitoring platform designed to track
              your pet’s health, activity, and safety in real time using IoT-based
              technology.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800"
              >
                <LayoutDashboard className="h-4 w-4" />
                View Dashboard
              </Link>
              <Link
                href="/pet-care"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-200/70 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-sky-50"
              >
                <BookOpen className="h-4 w-4 text-sky-700" />
                Explore Pet Care
              </Link>
              <Link
                href="/vet-connect"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200/70 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-emerald-50"
              >
                <Stethoscope className="h-4 w-4 text-emerald-700" />
                Book Vet
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/pet-profile">
                <UserRound className="h-4 w-4 text-slate-700" />
                Pet Profile
              </ButtonLink>
              <ButtonLink href="/health-logs">
                <ClipboardList className="h-4 w-4 text-slate-700" />
                Health Logs
              </ButtonLink>
              <ButtonLink href="/alerts">
                <Bell className="h-4 w-4 text-slate-700" />
                Alerts
              </ButtonLink>
              <ButtonLink href="/ml-insights">
                <Cloud className="h-4 w-4 text-slate-700" />
                ML Insights
              </ButtonLink>
              <ButtonLink href="/about">
                <MapPin className="h-4 w-4 text-slate-700" />
                About / Contact
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-7 shadow-sm backdrop-blur">
            <div className="text-sm font-semibold text-slate-900">
              Monitoring Modules (Academic Demo)
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: <ThermometerSun className="h-4 w-4 text-sky-700" />,
                  title: "Health Signals",
                  desc: "Temperature & heart rate thresholds.",
                },
                {
                  icon: <Activity className="h-4 w-4 text-emerald-700" />,
                  title: "Activity & Safety",
                  desc: "Movement tracking using uploaded data.",
                },
                {
                  icon: <Cloud className="h-4 w-4 text-sky-700" />,
                  title: "CSV Processing",
                  desc: "Visualize ThingSpeak exports in charts.",
                },
                {
                  icon: <Bell className="h-4 w-4 text-red-700" />,
                  title: "Alerting",
                  desc: "Fever / hypothermia / abnormal heart rate.",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-center gap-3">
                    {c.icon}
                    <div className="text-xs font-semibold text-slate-900">
                      {c.title}
                    </div>
                  </div>
                  <div className="mt-2 text-xs leading-5 text-slate-600">
                    {c.desc}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs leading-6 text-slate-700">
              Note: This homepage does not display live sensor data. Charts and
              alerts appear after you upload CSV files on the dashboard/log pages.
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 lg:py-14">
        <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">About Jivrakshak</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">
            Jivrakshak is an intelligent pet monitoring system that helps pet
            owners track temperature, activity, and safety conditions of their
            pets. The system uses smart sensors and cloud-based monitoring to
            ensure timely alerts and better pet care.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900">Key Features</h2>
          <div className="text-xs text-slate-500">Technology-focused and academic layout</div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {[
            {
              title: "Real-Time Health Monitoring",
              desc: "Temperature and heart rate tracking with alert zones.",
              icon: <HeartPulse className="h-5 w-5 text-sky-700" />,
            },
            {
              title: "Temperature & Activity Tracking",
              desc: "Health signals mapped over time using CSV exports.",
              icon: <ThermometerSun className="h-5 w-5 text-emerald-700" />,
            },
            {
              title: "Smart Alerts & Notifications",
              desc: "Fever, hypothermia, bradycardia, tachycardia detection.",
              icon: <Bell className="h-5 w-5 text-red-700" />,
            },
            {
              title: "Cloud-Based Data Visualization",
              desc: "Charts update after CSV upload (ThingSpeak export).",
              icon: <Cloud className="h-5 w-5 text-sky-700" />,
            },
            {
              title: "Pet Safety & Care Assistance",
              desc: "Location path + safety guidance for pet owners.",
              icon: <ShieldCheck className="h-5 w-5 text-emerald-700" />,
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur"
            >
              <div className="flex items-center gap-3">
                {f.icon}
                <div className="text-sm font-semibold text-slate-900">
                  {f.title}
                </div>
              </div>
              <div className="mt-3 text-xs leading-5 text-slate-600">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
