import { getOrCreateProfile } from "@/lib/profile";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDict, fill } from "@/lib/i18n";
import { DocumentsTable } from "@/components/DocumentsTable";

type DocRow = {
  id: string;
  title: string;
  category: string;
  year: number | null;
  file_name: string | null;
  size_bytes: number | null;
  created_at: string;
};

export default async function PortalPage() {
  const profile = await getOrCreateProfile();
  const { locale, t } = await getDict();
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("documents")
    .select("id, title, category, year, file_name, size_bytes, created_at")
    .eq("owner_id", profile!.id)
    .order("created_at", { ascending: false });

  const docs = (data ?? []) as DocRow[];

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-bold text-brand-800 sm:text-2xl">{t.portal.title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {fill(t.portal.welcome, {
            name: profile?.full_name ? `, ${profile.full_name}` : "",
          })}
        </p>
      </div>

      {docs.length === 0 ? (
        <div className="border border-dashed border-slate-300 bg-white p-8 text-center sm:p-12">
          <p className="text-slate-600">{t.portal.emptyTitle}</p>
          <p className="mt-1 text-sm text-slate-400">{t.portal.emptyBody}</p>
        </div>
      ) : (
        <DocumentsTable
          docs={docs}
          categories={t.categories}
          labels={t.portal}
          locale={locale}
        />
      )}
    </div>
  );
}
