"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LOCALES, type Locale } from "@/lib/i18n/dictionaries";

const LABELS: Record<Locale, string> = { de: "DE", en: "EN" };

/**
 * DE / EN language toggle. Stores the choice in the `locale` cookie and refreshes
 * the route so server components re-render in the new language.
 *
 * `tone` matches the surrounding background: "dark" for brand headers,
 * "light" for white cards.
 */
export function LocaleSwitcher({
  locale,
  tone = "dark",
}: {
  locale: Locale;
  tone?: "dark" | "light";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function select(next: Locale) {
    if (next === locale) return;
    document.cookie = `locale=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  }

  const active = tone === "dark" ? "text-white" : "text-brand-800";
  const inactive =
    tone === "dark"
      ? "text-brand-200 hover:text-white"
      : "text-slate-400 hover:text-slate-700";
  const divider = tone === "dark" ? "text-brand-500" : "text-slate-300";

  return (
    <div
      className={`flex items-center gap-1 text-xs font-semibold ${
        pending ? "opacity-60" : ""
      }`}
      aria-label="Language"
    >
      {LOCALES.map((code, i) => (
        <span key={code} className="flex items-center gap-1">
          {i > 0 && <span className={divider}>/</span>}
          <button
            type="button"
            onClick={() => select(code)}
            aria-pressed={code === locale}
            className={`transition ${code === locale ? active : inactive}`}
          >
            {LABELS[code]}
          </button>
        </span>
      ))}
    </div>
  );
}
