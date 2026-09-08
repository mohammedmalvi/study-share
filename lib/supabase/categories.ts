import { supabase, isSupabaseConfigured } from "./client";
import { Category } from "@/types/database";

export async function fetchCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return [];
  }
  
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");
    
  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  
  return data as Category[];
}
