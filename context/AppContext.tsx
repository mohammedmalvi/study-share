"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { AppUser, Toast } from "@/types/database";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { getUserFavorites, addFavorite, removeFavorite } from "@/lib/supabase/favorites";

interface AppContextType {
  navigateTo: (path: string) => void;
  user: AppUser | null;
  setUser: (u: AppUser | null) => void;
  toasts: Toast[];
  showToast: (message: string, type?: Toast["type"]) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigateTo = useCallback(
    (path: string) => {
      router.push(path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [router]
  );

  const showToast = useCallback(
    (message: string, type: Toast["type"] = "success") => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
    },
    []
  );

  const toggleFavorite = useCallback(async (id: string) => {
    if (!user) return;
    const isFav = favorites.includes(id);
    setFavorites((prev) =>
      isFav ? prev.filter((f) => f !== id) : [...prev, id]
    );
    
    if (isFav) {
      await removeFavorite(user.id, id);
    } else {
      await addFavorite(user.id, id);
    }
  }, [favorites, user]);

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      setIsLoading(false);
      return;
    }

    const loadProfile = async (userId: string) => {
      try {
        const { data: profile } = await supabase!.from("profiles").select("*").eq("id", userId).single();
        if (profile) {
          setUser(profile as AppUser);
        }
        const favs = await getUserFavorites(userId);
        setFavorites(favs);
      } catch (err) {
        console.error("Error loading profile", err);
      }
      setIsLoading(false);
    };

    supabase!.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase!.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setUser(null);
        setFavorites([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AppContext.Provider
      value={{ navigateTo, user, setUser, toasts, showToast, favorites, toggleFavorite }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
