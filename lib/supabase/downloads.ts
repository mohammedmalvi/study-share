import { supabase, isSupabaseConfigured } from "./client";

export async function recordDownload(
  userId: string,
  materialId: string
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { error: "Supabase is not configured." };
  }

  const { error } = await supabase.from("downloads").insert({
    user_id: userId,
    material_id: materialId,
  });

  if (!error) {
    // We can call the increment_download_count RPC
    await supabase.rpc("increment_download_count", { material_id: materialId });
  }

  return { error: error?.message ?? null };
}

export async function getUserDownloads(
  userId: string
): Promise<string[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("downloads")
    .select("material_id")
    .eq("user_id", userId)
    .order("downloaded_at", { ascending: false });

  if (error) {
    console.error("Error fetching downloads:", error);
    return [];
  }

  return data.map((d: { material_id: string }) => d.material_id);
}
