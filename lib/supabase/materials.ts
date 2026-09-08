import { supabase, isSupabaseConfigured } from "./client";
import type { Material, MaterialStatus } from "@/types/database";

export async function fetchMaterials(options?: {
  status?: MaterialStatus;
  subject_id?: string;
  category_id?: string;
  course?: string;
  semester?: string;
  search?: string;
  limit?: number;
}): Promise<Material[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return [];
  }

  // We join subjects, categories, and profiles to get the names
  let query = supabase.from("materials").select(`
    *,
    subjects(name),
    categories(name),
    profiles(name)
  `);

  if (options?.status) {
    query = query.eq("status", options.status);
  }
  if (options?.subject_id) {
    query = query.eq("subject_id", options.subject_id);
  }
  if (options?.category_id) {
    query = query.eq("category_id", options.category_id);
  }
  if (options?.course) {
    query = query.eq("course", options.course);
  }
  if (options?.semester) {
    query = query.eq("semester", options.semester);
  }
  if (options?.search) {
    query = query.ilike("title", `%${options.search}%`);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching materials:", error);
    return [];
  }

  return (data as any) as Material[];
}

export async function fetchMaterialById(
  id: string
): Promise<Material | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("materials")
    .select(`
      *,
      subjects(name),
      categories(name),
      profiles(name)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching material:", error);
    return null;
  }

  return (data as any) as Material;
}

export async function createMaterial(
  material: Omit<Material, "id" | "created_at" | "updated_at" | "downloads" | "rating" | "subjects" | "categories" | "profiles">
): Promise<{ data: Material | null; error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: null, error: "Supabase is not configured. Please set up environment variables." };
  }

  const { data, error } = await supabase
    .from("materials")
    .insert(material)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as Material, error: null };
}

export async function updateMaterial(
  id: string,
  updates: Partial<Material>
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { error: "Supabase is not configured." };
  }

  // Remove relation fields if they exist in updates
  const { subjects, categories, profiles, ...cleanUpdates } = updates as any;

  const { error } = await supabase
    .from("materials")
    .update({ ...cleanUpdates, updated_at: new Date().toISOString() })
    .eq("id", id);

  return { error: error?.message ?? null };
}

export async function deleteMaterial(
  id: string
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { error: "Supabase is not configured." };
  }

  const { error } = await supabase.from("materials").delete().eq("id", id);

  return { error: error?.message ?? null };
}

export async function incrementDownloadCount(
  id: string
): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) return;

  await supabase.rpc("increment_download_count", { material_id: id });
}
