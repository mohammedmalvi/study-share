import { supabase, isSupabaseConfigured } from "./client";
import { Subject } from "@/types/database";

export async function fetchSubjects(): Promise<Subject[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return [];
  }
  
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .order("name");
    
  if (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
  
  return data as Subject[];
}
