import { redirect } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { getOrCreateProfile, isAdmin, isApproved } from "@/lib/profile";
import { FIRM_NAME } from "@/lib/constants";
import { getDict, fill } from "@/lib/i18n";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

export default async function PendingPage() {
  const profile = await getOrCreateProfile();
  if (!profile) redirect("/sign-in");
  if (isAdmin(profile)) redirect("/admin");
  if (isApproved(profile)) redirect("/portal");

  const { locale, t } = await getDict();
  const rejected = profile.status === "rejected";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-800 px-6 text-center">
      <div className="max-w-md bg-white p-8 ">
        <div className="mb-4 flex justify-end">
          <LocaleSwitcher locale={locale} tone="light" />
        </div>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-brand-100 text-brand-700">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-brand-800">
          {rejected ? t.pending.rejectedTitle : t.pending.reviewTitle}
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          {rejected
            ? t.pending.rejectedBody
            : fill(t.pending.reviewBody, { firm: FIRM_NAME })}
        </p>
        <p className="mt-4 text-xs text-slate-400">
          {t.pending.signedInAs} {profile.email}
        </p>
        <div className="mt-6">
          <SignOutButton>
            <button className="border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              {t.pending.signOut}
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}
