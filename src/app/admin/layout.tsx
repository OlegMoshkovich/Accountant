import { redirect } from "next/navigation";
import { getOrCreateProfile, isAdmin } from "@/lib/profile";
import { PortalNav } from "@/components/PortalNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getOrCreateProfile();
  if (!profile) redirect("/sign-in");
  if (!isAdmin(profile)) redirect("/portal");

  return (
    <div className="min-h-screen bg-slate-50">
      <PortalNav isAdmin active="admin" />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
