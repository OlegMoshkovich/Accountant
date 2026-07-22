import { redirect } from "next/navigation";
import { getOrCreateProfile, isAdmin, isApproved } from "@/lib/profile";
import { PortalNav } from "@/components/PortalNav";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getOrCreateProfile();
  if (!profile) redirect("/sign-in");

  // Admins are always approved; clients must be approved to view the portal.
  if (!isApproved(profile) && !isAdmin(profile)) redirect("/pending");

  return (
    <div className="min-h-screen bg-slate-50">
      <PortalNav isAdmin={isAdmin(profile)} active="portal" />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
