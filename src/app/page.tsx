import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { FIRM_NAME } from "@/lib/constants";
import { getDict } from "@/lib/i18n";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

export default async function HomePage() {
  const { locale, t } = await getDict();

  return (
    <div className="min-h-screen bg-brand-800">
      {/* Header */}
      <header className="bg-brand-800 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-bold tracking-tight">
            {FIRM_NAME}
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <LocaleSwitcher locale={locale} tone="dark" />
            <SignedOut>
              <Link
                href="/sign-in"
                className="bg-white px-4 py-2 font-medium text-brand-800 transition hover:bg-brand-50"
              >
                {t.nav.clientPortal}
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/portal"
                className="bg-white px-4 py-2 font-medium text-brand-800 transition hover:bg-brand-50"
              >
                {t.nav.toPortal}
              </Link>
            </SignedIn>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-brand-800 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 pb-20 pt-10 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              {t.home.heroTitle}
            </h1>
            <p className="mt-5 max-w-lg text-brand-100">{t.home.heroBody}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/sign-up"
                className="bg-white px-6 py-3 font-semibold text-brand-800 transition hover:bg-brand-50"
              >
                {t.home.requestAccess}
              </Link>
              <Link
                href="/sign-in"
                className="border border-brand-300 px-6 py-3 font-semibold text-white transition hover:bg-brand-700"
              >
                {t.home.signIn}
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[320px] md:self-stretch">
            <Image
              src="/haus_konfi.jpg"
              alt={t.home.imageAlt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="leistungen" className="bg-brand-800 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold text-white">
            {t.home.servicesTitle}
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {t.home.services.map((s) => (
              <div
                key={s.title}
                className="border border-brand-600 bg-brand-800 p-6 transition hover:border-brand-400"
              >
                <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-100">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Footer */}
      <footer id="kontakt" className="bg-brand-800 text-brand-100">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2">
          <div>
            <p className="text-lg font-bold text-white">{FIRM_NAME}</p>
            <p className="mt-2 text-sm">{t.home.footerType}</p>
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
        <div className="border-t border-brand-600">
          <div className="mx-auto max-w-6xl px-6 py-4 text-xs text-brand-300">
            © {new Date().getFullYear()} {FIRM_NAME}. {t.home.rightsReserved}
          </div>
        </div>
      </footer>
    </div>
  );
}
