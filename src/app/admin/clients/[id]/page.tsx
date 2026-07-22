import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { UploadForm } from "@/components/UploadForm";
import { DeleteDocButton } from "@/components/DeleteDocButton";

type DocRow = {
  id: string;
  title: string;
  category: string;
  year: number | null;
  file_name: string | null;
  created_at: string;
};

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: client } = await supabase
    .from("profiles")
    .select("id, email, full_name, status")
    .eq("id", id)
    .maybeSingle();

  if (!client) notFound();

  const { data: docs } = await supabase
    .from("documents")
    .select("id, title, category, year, file_name, created_at")
    .eq("owner_id", id)
    .order("created_at", { ascending: false });

  const documents = (docs ?? []) as DocRow[];

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin"
          className="text-sm text-brand-600 hover:underline"
        >
          ← Zurück zur Verwaltung
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-brand-800">
          {client.full_name ?? client.email}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{client.email}</p>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-800">
          Neues Dokument bereitstellen
        </h2>
        <UploadForm ownerId={client.id} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-800">
          Bereitgestellte Dokumente ({documents.length})
        </h2>
        {documents.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            Für diesen Mandanten wurden noch keine Dokumente hochgeladen.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Dokument</th>
                  <th className="px-5 py-3 font-medium">Kategorie</th>
                  <th className="px-5 py-3 font-medium">Jahr</th>
                  <th className="px-5 py-3 font-medium">Datum</th>
                  <th className="px-5 py-3 text-right font-medium">Aktion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((d) => (
                  <tr key={d.id}>
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-800">{d.title}</div>
                      {d.file_name && (
                        <div className="text-xs text-slate-400">{d.file_name}</div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                        {d.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{d.year ?? "—"}</td>
                    <td className="px-5 py-4 text-slate-600">
                      {new Date(d.created_at).toLocaleDateString("de-DE")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <a
                          href={`/api/documents/${d.id}/download`}
                          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                        >
                          Ansehen
                        </a>
                        <DeleteDocButton documentId={d.id} />
                      </div>
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
