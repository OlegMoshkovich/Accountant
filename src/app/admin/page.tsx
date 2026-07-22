import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOrCreateProfile } from "@/lib/profile";
import { getDict, formatDate } from "@/lib/i18n";
import { setUserStatus } from "./actions";

type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  status: string;
  created_at: string;
};

export default async function AdminPage() {
  const { locale, t } = await getDict();
  const me = await getOrCreateProfile();
  const supabase = createAdminClient();

  const [{ data: pending }, { data: clients }, { data: docCounts }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, email, full_name, status, created_at")
        .eq("role", "client")
        .eq("status", "pending")
        .order("created_at", { ascending: true }),
      // Approved profiles that can receive documents — clients plus admins,
      // so an admin can also provide documents to (and view them as) themselves.
      supabase
        .from("profiles")
        .select("id, email, full_name, status, created_at")
        .in("role", ["client", "admin"])
        .eq("status", "approved")
        .order("created_at", { ascending: false }),
      supabase.from("documents").select("owner_id"),
    ]);

  const pendingList = (pending ?? []) as ProfileRow[];
  const clientList = (clients ?? []) as ProfileRow[];
  const counts = new Map<string, number>();
  for (const row of (docCounts ?? []) as { owner_id: string }[]) {
    counts.set(row.owner_id, (counts.get(row.owner_id) ?? 0) + 1);
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold text-brand-800">{t.admin.title}</h1>
        <p className="mt-1 text-sm text-slate-500">{t.admin.subtitle}</p>
      </div>

      {/* Pending approvals */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-lg font-semibold text-slate-800">
            {t.admin.pendingApprovals}
          </h2>
          {pendingList.length > 0 && (
            <span className="bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
              {pendingList.length}
            </span>
          )}
        </div>

        {pendingList.length === 0 ? (
          <div className="border border-slate-200 bg-white p-6 text-sm text-slate-500">
            {t.admin.noPending}
          </div>
        ) : (
          <div className="overflow-hidden border border-slate-200 bg-white ">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">{t.admin.colName}</th>
                  <th className="px-5 py-3 font-medium">{t.admin.colEmail}</th>
                  <th className="px-5 py-3 font-medium">
                    {t.admin.colRegistered}
                  </th>
                  <th className="px-5 py-3 text-right font-medium">
                    {t.admin.colAction}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingList.map((p) => (
                  <tr key={p.id}>
                    <td className="px-5 py-4 font-medium text-slate-800">
                      {p.full_name ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{p.email}</td>
                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(p.created_at, locale)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <form action={setUserStatus.bind(null, p.id, "approved")}>
                          <button className="bg-brand-700 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-800">
                            {t.admin.approve}
                          </button>
                        </form>
                        <form action={setUserStatus.bind(null, p.id, "rejected")}>
                          <button className="border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50">
                            {t.admin.reject}
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Clients */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-800">
          {t.admin.clients}
        </h2>
        {clientList.length === 0 ? (
          <div className="border border-slate-200 bg-white p-6 text-sm text-slate-500">
            {t.admin.noClients}
          </div>
        ) : (
          <div className="overflow-hidden border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">{t.admin.colName}</th>
                  <th className="px-5 py-3 font-medium">{t.admin.colEmail}</th>
                  <th className="px-5 py-3 font-medium">
                    {t.admin.colDocuments}
                  </th>
                  <th className="px-5 py-3 font-medium">
                    {t.admin.colRegistered}
                  </th>
                  <th className="px-5 py-3 text-right font-medium">
                    {t.admin.colAction}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clientList.map((c) => (
                  <tr key={c.id} className="group hover:bg-slate-50">
                    <td className="px-5 py-4 font-medium text-slate-800">
                      <Link
                        href={`/admin/clients/${c.id}`}
                        className="hover:text-brand-700 hover:underline"
                      >
                        {c.full_name ?? c.email}
                      </Link>
                      {me?.id === c.id && (
                        <span className="ml-2 text-xs font-normal text-slate-400">
                          {t.admin.youMarker}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{c.email}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                        {counts.get(c.id) ?? 0} {t.admin.docsShort}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(c.created_at, locale)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/clients/${c.id}`}
                        className="text-xs font-medium text-brand-600 group-hover:underline"
                      >
                        {t.admin.manageDocuments}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
