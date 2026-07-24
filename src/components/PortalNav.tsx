"use client";

import { useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { FIRM_NAME } from "@/lib/constants";
import type { Locale } from "@/lib/i18n/dictionaries";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

export function PortalNav({
  isAdmin = false,
  active,
  locale,
  labels,
}: {
  isAdmin?: boolean;
  active?: "portal" | "admin";
  locale: Locale;
  labels: { myDocuments: string; administration: string };
}) {
  const [open, setOpen] = useState(false);

  const linkClass = (key: "portal" | "admin") =>
    active === key
      ? "font-semibold text-white"
      : "text-brand-100 hover:text-white";

  return (
    <header className="bg-brand-800 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="min-w-0 truncate text-sm font-bold tracking-tight sm:text-base"
        >
          {FIRM_NAME}
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-4 text-sm md:flex">
          <Link href="/portal" className={linkClass("portal")}>
            {labels.myDocuments}
          </Link>
          {isAdmin && (
            <Link href="/admin" className={linkClass("admin")}>
              {labels.administration}
            </Link>
          )}
          <LocaleSwitcher locale={locale} tone="dark" />
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonPopoverCard: "mt-3 rounded-none shadow-none",
                userButtonPopoverFooter: "hidden",
                userButtonPopoverActionButton: "rounded-none",
              },
            }}
          />
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="mr-[28px]">
            <LocaleSwitcher locale={locale} tone="dark" />
          </div>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonPopoverCard: "mt-3 rounded-none shadow-none",
                userButtonPopoverFooter: "hidden",
                userButtonPopoverActionButton: "rounded-none",
              },
            }}
          />
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center border border-brand-500 text-white"
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
      </div>

      {open && (
        <nav className="border-t border-brand-700 px-4 py-3 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 text-sm">
            <Link
              href="/portal"
              className={`px-2 py-2.5 ${linkClass("portal")}`}
              onClick={() => setOpen(false)}
            >
              {labels.myDocuments}
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className={`px-2 py-2.5 ${linkClass("admin")}`}
                onClick={() => setOpen(false)}
              >
                {labels.administration}
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
