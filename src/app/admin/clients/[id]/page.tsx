import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDict, fill } from "@/lib/i18n";
import { UploadForm } from "@/components/UploadForm";
import { DocumentsTable } from "@/components/DocumentsTable";

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
          <DocumentsTable
            docs={documents}
            categories={t.categories}
            labels={t.portal}
            locale={locale}
            deleteLabels={t.doc}
          />
        )}
      </section>
    </div>
  );
}
