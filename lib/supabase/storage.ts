import { supabase, isSupabaseConfigured } from "./client";

export const BUCKET_NAME = "study-materials";

export async function uploadFile(
  file: File,
  path: string
): Promise<{ path: string; error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { path: "", error: "Supabase is not configured. Please set up environment variables." };
  }

  try {
    const filePath = `${path}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      if (error.message?.includes('Bucket not found') || error.message?.includes('NoSuchBucket') || error.name === 'NoSuchBucket') {
        return { path: "", error: `Storage bucket '${BUCKET_NAME}' not found. Please create it in your Supabase dashboard and ensure it is public.` };
      }
      return { path: "", error: error.message };
    }

    return { path: filePath, error: null };
  } catch (err: any) {
    return { path: "", error: err?.message || "An unexpected error occurred during file upload." };
  }
}

export async function uploadPdf(
  file: File
): Promise<{ path: string; error: string | null }> {
  return uploadFile(file, "pdfs");
}

export async function uploadThumbnail(
  file: File
): Promise<{ path: string; error: string | null }> {
  return uploadFile(file, "images");
}

export function getFileUrl(filePath: string): string | null {
  if (!isSupabaseConfigured() || !supabase || !filePath) {
    return null;
  }

  try {
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return data?.publicUrl || null;
  } catch (err) {
    console.error("Error generating public URL:", err);
    return null;
  }
}

export async function deleteFile(
  filePath: string
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { error: "Supabase is not configured." };
  }

  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      if (error.message?.includes('Bucket not found') || error.message?.includes('NoSuchBucket')) {
        return { error: `Storage bucket '${BUCKET_NAME}' not found.` };
      }
      return { error: error.message };
    }

    return { error: null };
  } catch (err: any) {
    return { error: err?.message || "An unexpected error occurred during file deletion." };
  }
}
