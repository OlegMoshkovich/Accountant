import { NextRequest, NextResponse } from "next/server";
import { getOrCreateProfile, isAdmin } from "@/lib/profile";
import { createAdminClient, DOCUMENTS_BUCKET } from "@/lib/supabase/admin";

/**
 * Streams a short-lived signed URL for a document the caller is allowed to see.
 * Clients may only download their own documents; admins may download any.
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
    .select("id, owner_id, storage_path, file_name")
    .eq("id", id)
    .maybeSingle();

  if (error || !doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Authorization: owner or admin only.
  if (doc.owner_id !== profile.id && !isAdmin(profile)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: signed, error: signErr } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .createSignedUrl(doc.storage_path, 60, {
      download: doc.file_name ?? true,
    });

  if (signErr || !signed) {
    return NextResponse.json(
      { error: "Could not create download link" },
      { status: 500 },
    );
  }

  return NextResponse.redirect(signed.signedUrl);
}
