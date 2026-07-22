import { getOrCreateProfile } from "@/lib/profile";
import { createAdminClient } from "@/lib/supabase/admin";

type DocRow = {
  id: string;
  title: string;
  category: string;
  year: number | null;
  file_name: string | null;
  size_bytes: number | null;
  created_at: string;
};

function formatBytes(bytes: number | null): string {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value.toFixed(value < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

export default async function PortalPage() {
  const profile = await getOrCreateProfile();
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("documents")
    .select("id, title, category, year, file_name, size_bytes, created_at")
    .eq("owner_id", profile!.id)
    .order("created_at", { ascending: false });

  const docs = (data ?? []) as DocRow[];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-800">Meine Dokumente</h1>
        <p className="mt-1 text-sm text-slate-500">
          Willkommen{profile?.full_name ? `, ${profile.full_name}` : ""}. Hier
          finden Sie alle von uns für Sie erstellten Unterlagen.
        </p>
      </div>

      {docs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-slate-600">
            Es liegen noch keine Dokumente für Sie bereit.
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Sobald unsere Kanzlei Unterlagen für Sie hochlädt, erscheinen sie
            hier.
          </p>
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
              {docs.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="font-medium text-slate-800">{d.title}</div>
                    {d.file_name && (
                      <div className="text-xs text-slate-400">
                        {d.file_name}
                        {d.size_bytes ? ` · ${formatBytes(d.size_bytes)}` : ""}
                      </div>
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
                  <td className="px-5 py-4 text-right">
                    <a
                      href={`/api/documents/${d.id}/download`}
                      className="inline-flex items-center gap-1.5 rounded-md bg-brand-700 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-800"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                        <path d="M10 2a1 1 0 011 1v7.6l2.3-2.3a1 1 0 111.4 1.4l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4L9 10.6V3a1 1 0 011-1z" />
                        <path d="M4 15a1 1 0 011 1v1h10v-1a1 1 0 112 0v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1a1 1 0 011-1z" />
                      </svg>
                      Herunterladen
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
