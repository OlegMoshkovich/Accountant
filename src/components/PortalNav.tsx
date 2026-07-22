import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { FIRM_NAME } from "@/lib/constants";

export function PortalNav({
  isAdmin = false,
  active,
}: {
  isAdmin?: boolean;
  active?: "portal" | "admin";
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
            Meine Dokumente
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className={active === "admin" ? "font-semibold text-white" : "text-brand-100 hover:text-white"}
            >
              Verwaltung
            </Link>
          )}
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
}
