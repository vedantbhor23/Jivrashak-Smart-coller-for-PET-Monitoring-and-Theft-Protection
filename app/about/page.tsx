import {
  ShieldCheck,
  CircuitBoard,
  Users,
  BookOpen,
  Mail,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">About the Project</h1>
        <p className="mt-2 text-sm text-slate-600">
          An IoT-based smart pet monitoring system designed for health, safety, and tracking.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <CircuitBoard className="h-5 w-5 text-sky-700" />
            <h2 className="text-lg font-bold text-slate-900">Project Overview</h2>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            JIV RASHAK is a smart collar-based pet monitoring system designed to
            track health parameters such as temperature, activity, and movement
            of pets. The system uses IoT technology to collect sensor data and
            visualize it through a web-based dashboard. The aim of the project
            is to provide an affordable and reliable solution for pet monitoring,
            ensuring timely alerts and better pet care.
          </p>

          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs leading-6 text-slate-700">
            Designed for academic evaluation and project presentation.
          </div>
        </section>

        <aside className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-emerald-700" />
            <h2 className="text-lg font-bold text-slate-900">Project Team</h2>
          </div>
          <div className="mt-4 space-y-2 text-sm text-slate-800">
            <div>Siddesh Choudhari</div>
            <div>Vedant Bhor</div>
            <div>Rajnandini Kanade</div>
            <div>Ketaki Mahamuni</div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">Project Guide</div>
            <div className="mt-2 text-sm text-slate-700">
              Mrs. Swapnali Londhe
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <section className="lg:col-span-1 rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="text-lg font-bold text-slate-900">Institution</div>
          <div className="mt-3 text-sm text-slate-700">
            PES Modern College of Engineering, Pune
          </div>
        </section>

        <section className="lg:col-span-2 rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-sky-700" />
            <h2 className="text-lg font-bold text-slate-900">Technology Stack Used</h2>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              "Arduino / Microcontroller",
              "Sensors (Temperature, Motion, GPS)",
              "SIM800L GSM Module",
              "ThingSpeak Cloud Platform",
              "CSV-based Data Processing",
              "HTML, CSS, JavaScript",
              "Wix Platform (Frontend)",
              "Chart.js for Graphs",
              "Google Maps API",
              "IoT-based Monitoring System",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-4 rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-emerald-700" />
          <h2 className="text-lg font-bold text-slate-900">Contact Information</h2>
        </div>
        <div className="mt-3 text-sm text-slate-700">
          This project is developed as part of academic curriculum. For queries and demonstration purposes, please contact the project team.
        </div>

        <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900">
          <Mail className="h-4 w-4 text-sky-700" />
          Smartcoller1@gmail.com
        </div>

        <div className="mt-4 text-xs text-slate-600">
          Important Notes: This page is for academic and evaluation purposes only. No commercial use. No personal data collection.
        </div>
      </section>
    </div>
  );
}

