import Image from "next/image";
import Link from "next/link";
import { FIRM_NAME } from "@/lib/constants";
import { getDict } from "@/lib/i18n";
import { HomeHeader } from "@/components/HomeHeader";

export default async function HomePage() {
  const { locale, t } = await getDict();

  return (
    <div className="min-h-screen bg-brand-800">
      {/* Header */}
      <HomeHeader
        locale={locale}
        labels={{ clientPortal: t.nav.clientPortal, toPortal: t.nav.toPortal }}
      />

      {/* Section 1: Hero — centered horizontally & vertically */}
      <section className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center bg-brand-800 py-16 text-white">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              {t.home.heroTitle}
            </h1>
            <p className="mt-5 max-w-lg text-brand-100 md:max-w-none">
              {t.home.heroBody}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
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

          <div className="w-full">
            <Image
              src="/haus_konfi.jpg"
              alt={t.home.imageAlt}
              width={1200}
              height={900}
              priority
              className="h-auto w-full object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Section 2: Services + Contact */}
      <section
        id="leistungen"
        className="flex min-h-[100svh] flex-col bg-brand-800 text-white md:min-h-0"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-8 md:block md:flex-none md:py-20">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            {t.home.servicesTitle}
          </h2>
          <div className="flex flex-1 flex-col justify-center md:block md:flex-none">
            <div className="grid gap-3 md:mt-10 md:grid-cols-3 md:gap-6">
              {t.home.services.map((s) => (
                <div
                  key={s.title}
                  className="border border-brand-600 bg-brand-800 p-4 transition hover:border-brand-400 md:p-7"
                >
                  <h3 className="text-base font-semibold text-white md:text-xl">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-snug text-brand-100 md:mt-3 md:text-base md:leading-relaxed">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer id="kontakt" className="text-brand-100">
          <div className="mx-auto grid w-full max-w-6xl gap-4 px-6 py-6 sm:grid-cols-2 md:gap-6 md:py-12">
            <div>
              <p className="text-base font-bold text-white md:text-lg">{FIRM_NAME}</p>
              <p className="mt-1 text-sm md:mt-2">{t.home.footerType}</p>
              <p className="mt-2 text-sm leading-relaxed md:mt-4">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Hirsch-Gereuth-Str.+32%2C+81369+M%C3%BCnchen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white hover:underline"
                >
                  Hirsch-Gereuth-Str. 32
                  <br />
                  81369 München
                </a>
              </p>
            </div>
            <div className="text-sm sm:text-right">
              <p>Tel.: 0 89 / 74 00 98 88</p>
              <p>Fax: 0 89 / 74 00 98 89</p>
              <p className="mt-1 md:mt-2">E-Mail: vom.hau@web.de</p>
            </div>
          </div>
          <div className="border-t border-brand-600">
            <div className="mx-auto w-full max-w-6xl px-6 py-3 text-xs text-brand-300 md:py-5">
              © {new Date().getFullYear()} {FIRM_NAME}. {t.home.rightsReserved}
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
}
