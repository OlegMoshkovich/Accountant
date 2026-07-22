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
  return (
    <header className="bg-brand-800 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-base font-bold tracking-tight">
          {FIRM_NAME}
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link
            href="/portal"
            className={active === "portal" ? "font-semibold text-white" : "text-brand-100 hover:text-white"}
          >
            {labels.myDocuments}
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className={active === "admin" ? "font-semibold text-white" : "text-brand-100 hover:text-white"}
            >
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
      </div>
    </header>
  );
}
