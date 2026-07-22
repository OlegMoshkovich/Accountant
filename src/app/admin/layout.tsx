import { redirect } from "next/navigation";
import { getOrCreateProfile, isAdmin } from "@/lib/profile";
import { getDict } from "@/lib/i18n";
import { PortalNav } from "@/components/PortalNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getOrCreateProfile();
  if (!profile) redirect("/sign-in");
  if (!isAdmin(profile)) redirect("/portal");

  const { locale, t } = await getDict();

  return (
    <div className="min-h-screen bg-slate-50">
      <PortalNav isAdmin active="admin" locale={locale} labels={t.nav} />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
