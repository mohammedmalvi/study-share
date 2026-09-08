"use client";

import { useState, useEffect } from "react";
import { Search, ArrowLeft, ChevronRight, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import MaterialCard from "@/components/MaterialCard";
import { fetchCategories } from "@/lib/supabase/categories";
import { fetchMaterials } from "@/lib/supabase/materials";
import type { Category, Material } from "@/types/database";

export default function CategoriesPage() {
  const { navigateTo } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [search, setSearch] = useState("");
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryMaterials, setCategoryMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMaterials, setLoadingMaterials] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchCategories();
      // Temporary mock icons for categories since they aren't in the DB schema
      const mapped = data.map((c, i) => ({
        ...c,
        icon: ["💻", "📊", "🌐", "📱", "🔐", "🧩"][i % 6] || "📚",
        color: ["bg-blue-50 text-blue-700 border-blue-100", "bg-emerald-50 text-emerald-700 border-emerald-100", "bg-violet-50 text-violet-700 border-violet-100", "bg-amber-50 text-amber-700 border-amber-100", "bg-rose-50 text-rose-700 border-rose-100", "bg-cyan-50 text-cyan-700 border-cyan-100"][i % 6] || "bg-slate-50 text-slate-700 border-slate-100"
      }));
      setCategories(mapped);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    async function loadMaterials() {
      if (!selectedCategory) return;
      setLoadingMaterials(true);
      const data = await fetchMaterials({ category_id: selectedCategory.id });
      setCategoryMaterials(data);
      setLoadingMaterials(false);
    }
    loadMaterials();
  }, [selectedCategory]);

  const filteredCategories = search ? categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase())) : categories;

  if (selectedCategory) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
        <button onClick={() => setSelectedCategory(null)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-700 mb-6 font-medium"><ArrowLeft size={16} /> Back to Categories</button>
        <div className="mb-8"><h1 className="text-3xl font-extrabold text-slate-900 heading-font mb-2">{selectedCategory.name}</h1><p className="text-slate-500">{categoryMaterials.length} study materials available</p></div>
        {loadingMaterials ? (
          <div className="text-center py-20">Loading materials...</div>
        ) : categoryMaterials.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{categoryMaterials.map(m => <MaterialCard key={m.id} material={m} />)}</div>
        ) : (
          <div className="text-center py-20"><div className="text-6xl mb-4">📚</div><h3 className="text-xl font-bold text-slate-700 heading-font mb-2">No materials yet</h3><p className="text-slate-500 mb-6">Be the first to upload materials in this category</p><button onClick={() => navigateTo("/upload")} className="btn-primary px-6 py-3 rounded-xl font-semibold">Upload Material</button></div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="mb-8"><h1 className="text-3xl font-extrabold text-slate-900 heading-font mb-2">Categories</h1><p className="text-slate-500">Browse study materials by subject category</p></div>
      <div className="relative max-w-md mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type="text" placeholder="Search categories..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl border border-blue-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm text-slate-700" />
        {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={16} /></button>}
      </div>
      {loading ? (
        <div className="text-center py-20">Loading categories...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredCategories.map((cat) => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat)} className={`flex items-center gap-4 p-5 rounded-2xl border card-hover text-left group ${cat.color}`}>
                <span className="text-3xl">{cat.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-sm heading-font">{cat.name}</div>
                </div>
                <ChevronRight size={16} className="opacity-40 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
          {filteredCategories.length === 0 && (
            <div className="text-center py-12"><p className="text-slate-500">No categories match your search</p></div>
          )}
        </>
      )}
    </div>
  );
}
