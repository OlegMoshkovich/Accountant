"use client";

import { useState } from "react";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { FIRM_NAME } from "@/lib/constants";
import type { Locale } from "@/lib/i18n/dictionaries";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

/**
 * Landing-page header. On desktop the language switcher and portal button sit
 * inline; on mobile they collapse into a hamburger menu so the header stays
 * uncluttered next to the (long) firm name.
 */
export function HomeHeader({
  locale,
  labels,
}: {
  locale: Locale;
  labels: { clientPortal: string; toPortal: string };
}) {
  const [open, setOpen] = useState(false);

  const portalButtonClass =
    "bg-white px-4 py-2 font-medium text-brand-800 transition hover:bg-brand-50";

  return (
    <header className="bg-brand-800 text-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="min-w-0 text-base font-bold leading-tight tracking-tight sm:text-lg"
        >
          {FIRM_NAME}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden shrink-0 items-center gap-4 text-sm md:flex">
          <LocaleSwitcher locale={locale} tone="dark" />
          <SignedOut>
            <Link href="/sign-in" className={portalButtonClass}>
              {labels.clientPortal}
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/portal" className={portalButtonClass}>
              {labels.toPortal}
            </Link>
          </SignedIn>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center border border-brand-500 text-white md:hidden"
          aria-expanded={open}
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M4.3 4.3a1 1 0 011.4 0L10 8.6l4.3-4.3a1 1 0 111.4 1.4L11.4 10l4.3 4.3a1 1 0 11-1.4 1.4L10 11.4l-4.3 4.3a1 1 0 11-1.4-1.4L8.6 10 4.3 5.7a1 1 0 010-1.4z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M3 5h14a1 1 0 100-2H3a1 1 0 000 2zm14 4H3a1 1 0 000 2h14a1 1 0 100-2zm0 6H3a1 1 0 000 2h14a1 1 0 100-2z" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <nav className="border-t border-brand-700 md:hidden">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6">
            <LocaleSwitcher locale={locale} tone="dark" />
            <SignedOut>
              <Link
                href="/sign-in"
                className={`${portalButtonClass} text-center`}
                onClick={() => setOpen(false)}
              >
                {labels.clientPortal}
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/portal"
                className={`${portalButtonClass} text-center`}
                onClick={() => setOpen(false)}
              >
                {labels.toPortal}
              </Link>
            </SignedIn>
          </div>
        </nav>
      )}
    </header>
  );
}
