"use client";

import { useState } from "react";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import type { Locale } from "@/lib/i18n/dictionaries";

/**
 * Marketing-site header. On desktop the language switcher and portal button sit
 * inline; on mobile they collapse behind a hamburger menu so the firm name has
 * room to breathe on a single line.
 */
export function SiteHeader({
  locale,
  firmName,
  labels,
}: {
  locale: Locale;
  firmName: string;
  labels: { clientPortal: string; toPortal: string };
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="relative bg-brand-800 text-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          onClick={close}
          className="text-base font-bold tracking-tight sm:text-lg"
        >
          {firmName}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 text-sm md:flex">
          <LocaleSwitcher locale={locale} tone="dark" />
          <PortalLink labels={labels} />
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={locale === "de" ? "Menü" : "Menu"}
          className="-mr-2 inline-flex items-center justify-center p-2 text-white md:hidden"
        >
          {open ? (
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div
          id="mobile-menu"
          className="border-t border-brand-600 md:hidden"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-6 py-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-brand-300">
                {locale === "de" ? "Sprache" : "Language"}
              </span>
              <LocaleSwitcher locale={locale} tone="dark" />
            </div>
            <PortalLink labels={labels} full onNavigate={close} />
          </div>
        </div>
      )}
    </header>
  );
}

function PortalLink({
  labels,
  full = false,
  onNavigate,
}: {
  labels: { clientPortal: string; toPortal: string };
  full?: boolean;
  onNavigate?: () => void;
}) {
  const cls = `bg-white px-4 py-2 font-medium text-brand-800 transition hover:bg-brand-50 ${
    full ? "block w-full text-center py-3" : ""
  }`;
  return (
    <>
      <SignedOut>
        <Link href="/sign-in" onClick={onNavigate} className={cls}>
          {labels.clientPortal}
        </Link>
      </SignedOut>
      <SignedIn>
        <Link href="/portal" onClick={onNavigate} className={cls}>
          {labels.toPortal}
        </Link>
      </SignedIn>
    </>
  );
}
