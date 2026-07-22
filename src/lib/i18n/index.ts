import { cookies } from "next/headers";
import {
  dictionaries,
  defaultLocale,
  isLocale,
  type Dictionary,
  type Locale,
} from "./dictionaries";

export const LOCALE_COOKIE = "locale";

export { defaultLocale, type Dictionary, type Locale };

/** Reads the visitor's chosen locale from the `locale` cookie (default: de). */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
}

/** Returns the active locale and its dictionary for use in server components. */
export async function getDict(): Promise<{ locale: Locale; t: Dictionary }> {
  const locale = await getLocale();
  return { locale, t: dictionaries[locale] };
}

/** Locale-aware date formatting for document/registration dates. */
export function formatDate(value: string | Date, locale: Locale): string {
  return new Date(value).toLocaleDateString(locale === "de" ? "de-DE" : "en-GB");
}

/** Replaces {token} placeholders in a dictionary string. */
export function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    key in values ? String(values[key]) : `{${key}}`,
  );
}
