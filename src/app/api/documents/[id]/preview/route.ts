import { NextRequest, NextResponse } from "next/server";
import { getOrCreateProfile, isAdmin } from "@/lib/profile";
import { createAdminClient, DOCUMENTS_BUCKET } from "@/lib/supabase/admin";

function previewKind(fileName: string | null): "pdf" | "image" | "office" | "other" {
  const ext = (fileName ?? "").split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "image";
  if (["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(ext)) return "office";
  return "other";
}

/**
 * Returns a short-lived signed URL for in-browser preview.
 * Clients may only preview their own documents; admins may preview any.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const profile = await getOrCreateProfile();
  if (!profile) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data: doc, error } = await supabase
    .from("documents")
    .select("id, owner_id, storage_path, file_name, title")
    .eq("id", id)
    .maybeSingle();

  if (error || !doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (doc.owner_id !== profile.id && !isAdmin(profile)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Inline preview — do not force a download disposition.
  const { data: signed, error: signErr } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .createSignedUrl(doc.storage_path, 120);

  if (signErr || !signed) {
    return NextResponse.json(
      { error: "Could not create preview link" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    url: signed.signedUrl,
    fileName: doc.file_name,
    title: doc.title,
    kind: previewKind(doc.file_name),
  });
}
