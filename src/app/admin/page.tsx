import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { setUserStatus } from "./actions";

type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  status: string;
  created_at: string;
};

export default async function AdminPage() {
  const supabase = createAdminClient();

  const [{ data: pending }, { data: clients }, { data: docCounts }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, email, full_name, status, created_at")
        .eq("role", "client")
        .eq("status", "pending")
        .order("created_at", { ascending: true }),
      supabase
        .from("profiles")
        .select("id, email, full_name, status, created_at")
        .eq("role", "client")
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
        <h1 className="text-2xl font-bold text-brand-800">Verwaltung</h1>
        <p className="mt-1 text-sm text-slate-500">
          Neue Zugänge freigeben und Dokumente für Mandanten bereitstellen.
        </p>
      </div>

      {/* Pending approvals */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-lg font-semibold text-slate-800">
            Offene Freigaben
          </h2>
          {pendingList.length > 0 && (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
              {pendingList.length}
            </span>
          )}
        </div>

        {pendingList.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            Keine offenen Freigaben.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">E-Mail</th>
                  <th className="px-5 py-3 font-medium">Registriert</th>
                  <th className="px-5 py-3 text-right font-medium">Aktion</th>
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
                      {new Date(p.created_at).toLocaleDateString("de-DE")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <form action={setUserStatus.bind(null, p.id, "approved")}>
                          <button className="rounded-md bg-brand-700 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-800">
                            Freigeben
                          </button>
                        </form>
                        <form action={setUserStatus.bind(null, p.id, "rejected")}>
                          <button className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50">
                            Ablehnen
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
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Mandanten</h2>
        {clientList.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            Noch keine freigegebenen Mandanten.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clientList.map((c) => (
              <Link
                key={c.id}
                href={`/admin/clients/${c.id}`}
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-800">
                    {c.full_name ?? c.email}
                  </div>
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                    {counts.get(c.id) ?? 0} Dok.
                  </span>
                </div>
                <div className="mt-1 truncate text-sm text-slate-500">
                  {c.email}
                </div>
                <div className="mt-4 text-xs font-medium text-brand-600 group-hover:underline">
                  Dokumente verwalten →
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
