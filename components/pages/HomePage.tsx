"use client";

import { useState, useEffect } from "react";
import { Search, ArrowRight, Star, TrendingUp, Users, BookOpen, Download } from "lucide-react";
import { useApp } from "@/context/AppContext";
import MaterialCard from "@/components/MaterialCard";
import { TESTIMONIALS, STATS, HOW_IT_WORKS, WHY_CHOOSE } from "@/data/mockData";
import { fetchMaterials } from "@/lib/supabase/materials";
import { fetchCategories } from "@/lib/supabase/categories";
import { supabase } from "@/lib/supabase/client";
import type { Material, Category } from "@/types/database";

export default function HomePage() {
  const { navigateTo } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [featured, setFeatured] = useState<Material[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const [mats, cats] = await Promise.all([
        fetchMaterials({ limit: 6 }),
        fetchCategories()
      ]);
      if (isMounted) {
        setFeatured(mats);
        setCategories(cats);
        setLoading(false);
      }
    }
    loadData();

    let channel: any;
    if (supabase) {
      channel = supabase.channel('homepage_materials')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'materials' }, () => {
          loadData(); // Re-fetch on any change
        })
        .subscribe();
    }

    return () => {
      isMounted = false;
      if (supabase && channel) supabase.removeChannel(channel);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => { 
    e.preventDefault(); 
    // We can pass search via query params if we had next/router or just navigate.
    // For now, we'll navigate to materials page. 
    navigateTo("/materials"); 
  };

  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, rgba(37,99,235,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(99,179,237,0.15) 0%, transparent 50%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/80 border border-blue-100 rounded-full px-4 py-1.5 text-xs font-semibold text-blue-700 mb-6 shadow-sm">
                <TrendingUp size={12} /><span>1,200+ Study Materials Available</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6 heading-font">
                Share Knowledge.<br /><span className="text-blue-600">Study Smarter.</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
                StudyShare is a simple and powerful platform where students can upload, discover and share study materials with their classmates.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => navigateTo("/materials")} className="btn-primary flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base shadow-lg">
                  Explore Study Materials <ArrowRight size={18} />
                </button>
                <button onClick={() => navigateTo("/upload")} className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base bg-white text-blue-700 border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all shadow-sm">
                  <BookOpen size={18} /> Upload Material
                </button>
              </div>
              <div className="flex items-center gap-6 mt-8">
                {STATS.slice(0, 3).map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-xl font-extrabold text-blue-700 heading-font">{stat.value}</div>
                    <div className="text-xs text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-blue-100">
                <img src="https://images.unsplash.com/photo-1758270705290-62b6294dd044?w=700&h=500&fit=crop&auto=format" alt="Diverse group of students gathered around laptop studying together" className="w-full h-[420px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
              </div>
              <div className="absolute -left-6 top-8 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2.5 animate-fade-in">
                <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center"><Download size={16} className="text-emerald-600" /></div>
                <div><div className="text-xs font-bold text-slate-800">15,000+</div><div className="text-[10px] text-slate-500">Downloads</div></div>
              </div>
              <div className="absolute -right-4 bottom-12 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2.5">
                <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center"><Star size={16} className="text-amber-500" fill="currentColor" /></div>
                <div><div className="text-xs font-bold text-slate-800">4.8 / 5.0</div><div className="text-[10px] text-slate-500">Avg Rating</div></div>
              </div>
              <div className="absolute left-6 -bottom-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2.5">
                <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center"><Users size={16} className="text-blue-600" /></div>
                <div><div className="text-xs font-bold text-slate-800">850+ Students</div><div className="text-[10px] text-slate-500">Active this month</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH BAR */}
      <section className="max-w-3xl mx-auto px-4 -mt-6 relative z-10 mb-16">
        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
            <div className="pl-5 text-slate-400"><Search size={22} /></div>
            <input type="text" placeholder="Search notes, subjects, courses, authors..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 px-4 py-4 text-slate-700 placeholder:text-slate-400 outline-none text-base bg-transparent" />
            <button type="submit" className="btn-primary px-7 py-4 text-sm font-semibold">Search</button>
          </div>
        </form>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-font">Popular Categories</h2>
            <p className="text-slate-500 mt-1">Find materials organized by your subjects</p>
          </div>
          <button onClick={() => navigateTo("/categories")} className="hidden sm:flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
            View All <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => navigateTo("/categories")} className="flex flex-col items-center gap-3 p-5 rounded-2xl border card-hover text-center group bg-white border-slate-200">
              <span className="text-3xl">📚</span>
              <div><div className="font-semibold text-sm heading-font">{cat.name}</div><div className="text-xs opacity-70 mt-0.5">Explore</div></div>
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED MATERIALS */}
      <section className="bg-slate-50/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-font">Featured Study Materials</h2>
              <p className="text-slate-500 mt-1">Top-rated materials by your fellow students</p>
            </div>
            <button onClick={() => navigateTo("/materials")} className="hidden sm:flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
              Browse All <ArrowRight size={14} />
            </button>
          </div>
          {loading ? (
            <div className="text-center py-10">Loading materials...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((m) => (<MaterialCard key={m.id} material={m} />))}
            </div>
          )}
          <div className="text-center mt-8">
            <button onClick={() => navigateTo("/materials")} className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold shadow-lg">
              View All Materials <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-font mb-2">How It Works</h2>
          <p className="text-slate-500">Get started in 4 simple steps</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.step} className="relative text-center">
              {i < HOW_IT_WORKS.length - 1 && (<div className="hidden lg:block absolute top-8 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-px border-t-2 border-dashed border-blue-200" />)}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">{step.icon}</div>
              <div className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full mb-3">{step.step}</div>
              <h3 className="font-bold text-slate-800 mb-2 heading-font">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="hero-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-font mb-2">Why Choose StudyShare?</h2>
            <p className="text-slate-600">Built for students, by students</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_CHOOSE.map((item) => (
              <div key={item.title} className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-blue-100 shadow-sm card-hover">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-slate-800 mb-1.5 heading-font">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stat-gradient py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-extrabold text-white heading-font mb-1">{stat.value}</div>
                <div className="text-blue-200 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-font mb-2">What Students Say</h2>
          <p className="text-slate-500">Real reviews from real students</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl border border-blue-50 shadow-sm p-6">
              <div className="flex items-center gap-1 mb-3">
                {[1,2,3,4,5].map((i) => (<Star key={i} size={14} className={i <= t.rating ? "text-amber-400" : "text-slate-200"} fill="currentColor" />))}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">\"{t.review}\"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-sm font-bold">{t.avatar}</div>
                <div><div className="text-sm font-semibold text-slate-800">{t.name}</div><div className="text-xs text-slate-500">{t.course} • {t.college}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-extrabold text-white heading-font mb-4">Start Learning Smarter Today</h2>
          <p className="text-blue-200 mb-8 text-lg">Join 850+ students who are already using StudyShare to excel in their exams.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigateTo("/signup")} className="px-8 py-3.5 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg">Create Free Account</button>
            <button onClick={() => navigateTo("/materials")} className="px-8 py-3.5 bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-900 border border-blue-500 transition-all">Browse Materials</button>
          </div>
        </div>
      </section>
    </div>
  );
}
