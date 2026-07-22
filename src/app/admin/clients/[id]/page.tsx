import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDict, fill, formatDate } from "@/lib/i18n";
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
  const { locale, t } = await getDict();
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
          {t.clientDetail.back}
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-brand-800">
          {client.full_name ?? client.email}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{client.email}</p>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-800">
          {t.clientDetail.provideNew}
        </h2>
        <UploadForm ownerId={client.id} labels={t.upload} categories={t.categories} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-800">
          {fill(t.clientDetail.provided, { n: documents.length })}
        </h2>
        {documents.length === 0 ? (
          <div className="border border-slate-200 bg-white p-6 text-sm text-slate-500">
            {t.clientDetail.noneUploaded}
          </div>
        ) : (
          <div className="overflow-hidden border border-slate-200 bg-white ">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">{t.portal.colDocument}</th>
                  <th className="px-5 py-3 font-medium">{t.portal.colCategory}</th>
                  <th className="px-5 py-3 font-medium">{t.portal.colYear}</th>
                  <th className="px-5 py-3 font-medium">{t.portal.colDate}</th>
                  <th className="px-5 py-3 text-right font-medium">
                    {t.portal.colAction}
                  </th>
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
                      <span className="inline-flex bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                        {t.categories[d.category] ?? d.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{d.year ?? "—"}</td>
                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(d.created_at, locale)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <a
                          href={`/api/documents/${d.id}/download`}
                          className="border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                        >
                          {t.clientDetail.view}
                        </a>
                        <DeleteDocButton documentId={d.id} labels={t.doc} />
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
