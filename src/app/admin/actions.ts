"use server";

import { revalidatePath } from "next/cache";
import { getOrCreateProfile, isAdmin } from "@/lib/profile";
import { createAdminClient, DOCUMENTS_BUCKET } from "@/lib/supabase/admin";

async function requireAdmin() {
  const profile = await getOrCreateProfile();
  if (!profile || !isAdmin(profile)) {
    throw new Error("Not authorized");
  }
  return profile;
}

/** Approve or reject a pending client account. */
export async function setUserStatus(
  profileId: string,
  status: "approved" | "rejected",
) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("profiles")
    .update({ status })
    .eq("id", profileId)
    .eq("role", "client"); // never change an admin's status here
  if (error) throw error;
  revalidatePath("/admin");
}

/** Upload a document and assign it to a client. */
export async function uploadDocument(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = createAdminClient();

  const ownerId = String(formData.get("ownerId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "Other");
  const yearRaw = String(formData.get("year") ?? "").trim();
  const file = formData.get("file") as File | null;

  if (!ownerId || !title || !file || file.size === 0) {
    throw new Error("Missing required fields: client, title and file.");
  }

  // Confirm the target profile exists and is a client.
  const { data: owner } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", ownerId)
    .maybeSingle();
  if (!owner) throw new Error("Target client not found.");

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${ownerId}/${Date.now()}_${safeName}`;

  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error: uploadErr } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .upload(storagePath, bytes, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
  if (uploadErr) throw uploadErr;

  const { error: insertErr } = await supabase.from("documents").insert({
    owner_id: ownerId,
    title,
    category,
    year: yearRaw ? Number(yearRaw) : null,
    file_name: file.name,
    storage_path: storagePath,
    size_bytes: file.size,
    uploaded_by: admin.user_id,
  });
  if (insertErr) {
    // Roll back the uploaded object so we don't leave orphans.
    await supabase.storage.from(DOCUMENTS_BUCKET).remove([storagePath]);
    throw insertErr;
  }

  revalidatePath(`/admin/clients/${ownerId}`);
  revalidatePath("/admin");
}

/** Delete a document (removes the storage object and the row). */
export async function deleteDocument(documentId: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: doc } = await supabase
    .from("documents")
    .select("id, owner_id, storage_path")
    .eq("id", documentId)
    .maybeSingle();
  if (!doc) return;

  await supabase.storage.from(DOCUMENTS_BUCKET).remove([doc.storage_path]);
  await supabase.from("documents").delete().eq("id", documentId);

  revalidatePath(`/admin/clients/${doc.owner_id}`);
  revalidatePath("/admin");
}
