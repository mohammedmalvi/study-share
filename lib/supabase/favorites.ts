import { supabase, isSupabaseConfigured } from "./client";

export async function addFavorite(
  userId: string,
  materialId: string
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { error: "Supabase is not configured." };
  }

  const { error } = await supabase
    .from("favorites")
    .upsert(
      { user_id: userId, material_id: materialId },
      { onConflict: "user_id,material_id" }
    );

  return { error: error?.message ?? null };
}

export async function removeFavorite(
  userId: string,
  materialId: string
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { error: "Supabase is not configured." };
  }

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("material_id", materialId);

  return { error: error?.message ?? null };
}

export async function getUserFavorites(
  userId: string
): Promise<string[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("favorites")
    .select("material_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }

  return data.map((f: { material_id: string }) => f.material_id);
}

export async function isFavorite(
  userId: string,
  materialId: string
): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) {
    return false;
  }

  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("material_id", materialId)
    .single();

  return data !== null;
}
