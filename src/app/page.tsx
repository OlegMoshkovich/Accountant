import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { FIRM_NAME } from "@/lib/constants";

const services = [
  {
    title: "Steuerberatung",
    en: "Tax advisory",
    body: "Laufende Steuerberatung, Steuererklärungen und Vertretung gegenüber dem Finanzamt für Privatpersonen und Unternehmen.",
  },
  {
    title: "Wirtschaftsprüfung",
    en: "Audit",
    body: "Prüfung von Jahres- und Konzernabschlüssen sowie betriebswirtschaftliche Beratung mit langjähriger Erfahrung.",
  },
  {
    title: "Jahresabschlüsse",
    en: "Annual accounts",
    body: "Erstellung von Jahresabschlüssen, Buchhaltung und Lohnabrechnung – zuverlässig und termingerecht.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-brand-800 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-bold tracking-tight">
            {FIRM_NAME}
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <a href="#leistungen" className="hidden text-brand-100 hover:text-white sm:inline">
              Leistungen
            </a>
            <a href="#kontakt" className="hidden text-brand-100 hover:text-white sm:inline">
              Kontakt
            </a>
            <SignedOut>
              <Link
                href="/sign-in"
                className="rounded-md bg-white px-4 py-2 font-medium text-brand-800 transition hover:bg-brand-50"
              >
                Mandantenportal
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/portal"
                className="rounded-md bg-white px-4 py-2 font-medium text-brand-800 transition hover:bg-brand-50"
              >
                Zum Portal
              </Link>
            </SignedIn>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-brand-800 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 pb-20 pt-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-200">
              Wirtschaftsprüfungs- &amp; Steuerberatungsgesellschaft
            </p>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              Alteingesessene und renommierte Sozietät für Wirtschaftsprüfung und
              Steuerberatung.
            </h1>
            <p className="mt-5 max-w-lg text-brand-100">
              Seit vielen Jahren bieten wir unseren Mandanten – Privatpersonen,
              Freiberufler, Industrie-, Handels- und Dienstleistungsunternehmen –
              qualifizierte Beratung in allen steuerlichen, rechtlichen und
              betriebswirtschaftlichen Fragen.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/sign-up"
                className="rounded-md bg-white px-6 py-3 font-semibold text-brand-800 transition hover:bg-brand-50"
              >
                Zugang beantragen
              </Link>
              <Link
                href="/sign-in"
                className="rounded-md border border-brand-300 px-6 py-3 font-semibold text-white transition hover:bg-brand-700"
              >
                Anmelden
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-brand-600 bg-brand-900/40 p-8 shadow-xl">
            <h2 className="text-lg font-semibold text-white">
              Ihr sicheres Mandantenportal
            </h2>
            <ul className="mt-5 space-y-4 text-sm text-brand-100">
              <li className="flex gap-3">
                <CheckIcon /> Steuererklärungen und Bescheide jederzeit abrufen
              </li>
              <li className="flex gap-3">
                <CheckIcon /> Jahresabschlüsse und Unterlagen zentral an einem Ort
              </li>
              <li className="flex gap-3">
                <CheckIcon /> Verschlüsselte, geschützte Ablage Ihrer Dokumente
              </li>
              <li className="flex gap-3">
                <CheckIcon /> Freigabe neuer Zugänge durch unsere Kanzlei
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="leistungen" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold text-brand-800">
          Unsere Leistungen
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">
                {s.en}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-brand-800">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact / Footer */}
      <footer id="kontakt" className="bg-brand-900 text-brand-100">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2">
          <div>
            <p className="text-lg font-bold text-white">{FIRM_NAME}</p>
            <p className="mt-2 text-sm">
              Wirtschaftsprüfungsgesellschaft · Steuerberatungsgesellschaft
            </p>
            <p className="mt-4 text-sm leading-relaxed">
              Hirsch-Gereuth-Str. 32
              <br />
              81369 München
            </p>
          </div>
          <div className="text-sm sm:text-right">
            <p>Tel.: 0 89 / 74 00 98 88</p>
            <p>Fax: 0 89 / 74 00 98 89</p>
            <p className="mt-2">E-Mail: vom.hau@web.de</p>
          </div>
        </div>
        <div className="border-t border-brand-700">
          <div className="mx-auto max-w-6xl px-6 py-4 text-xs text-brand-300">
            © {new Date().getFullYear()} {FIRM_NAME}. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 flex-none text-brand-300"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.3 3.3 6.8-6.8a1 1 0 011.4 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}
