import { auth, currentUser } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type Profile = {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  role: "client" | "admin";
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Returns the Supabase profile for the currently signed-in Clerk user,
 * creating it on first sign-in. Users whose email is listed in ADMIN_EMAILS
 * are provisioned as approved admins; everyone else starts as a pending client.
 * Returns null when there is no signed-in user.
 */
export async function getOrCreateProfile(): Promise<Profile | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) return existing as Profile;

  // First sign-in: build the profile from the Clerk user record.
  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    null;
  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() || null;

  const isSeededAdmin =
    !!email && adminEmails().includes(email.toLowerCase());

  const { data: created, error } = await supabase
    .from("profiles")
    .insert({
      user_id: userId,
      email,
      full_name: fullName,
      role: isSeededAdmin ? "admin" : "client",
      status: isSeededAdmin ? "approved" : "pending",
    })
    .select("*")
    .single();

  if (error) {
    // Handle the race where two requests insert at once.
    const { data: retry } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (retry) return retry as Profile;
    throw error;
  }

  return created as Profile;
}

export function isAdmin(profile: Profile | null): boolean {
  return profile?.role === "admin";
}

export function isApproved(profile: Profile | null): boolean {
  return profile?.status === "approved";
}
