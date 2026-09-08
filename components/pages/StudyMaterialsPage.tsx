"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import MaterialCard from "@/components/MaterialCard";
import { fetchMaterials } from "@/lib/supabase/materials";
import { fetchSubjects } from "@/lib/supabase/subjects";
import { fetchCategories } from "@/lib/supabase/categories";
import type { Material, Subject, Category } from "@/types/database";

const COURSES = ["All Courses", "BCA", "MCA", "BSc CS", "BTech"];
const SEMESTERS = ["All Semesters", "1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester"];
const SORT_OPTIONS = ["Most Recent", "Most Downloaded", "Highest Rated", "Alphabetical"];

export default function StudyMaterialsPage() {
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("All Courses");
  const [semester, setSemester] = useState("All Semesters");
  const [subjectId, setSubjectId] = useState("All Subjects");
  const [categoryId, setCategoryId] = useState("All Types");
  const [sort, setSort] = useState("Most Recent");
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const [materials, setMaterials] = useState<Material[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const PER_PAGE = 9;

  useEffect(() => {
    async function loadFilters() {
      const [subs, cats] = await Promise.all([fetchSubjects(), fetchCategories()]);
      setSubjects(subs);
      setCategories(cats);
    }
    loadFilters();
  }, []);

  useEffect(() => {
    async function loadMaterials() {
      setLoading(true);
      const data = await fetchMaterials({
        search: search || undefined,
        course: course !== "All Courses" ? course : undefined,
        semester: semester !== "All Semesters" ? semester : undefined,
        subject_id: subjectId !== "All Subjects" ? subjectId : undefined,
        category_id: categoryId !== "All Types" ? categoryId : undefined,
        status: "approved"
      });
      
      let res = [...data];
      if (sort === "Most Downloaded") res = res.sort((a, b) => b.downloads - a.downloads);
      else if (sort === "Highest Rated") res = res.sort((a, b) => b.rating - a.rating);
      else if (sort === "Alphabetical") res = res.sort((a, b) => a.title.localeCompare(b.title));
      // By default fetchMaterials sorts by created_at DESC, which handles "Most Recent"
      
      setMaterials(res);
      setLoading(false);
    }
    
    // Debounce the search slightly
    const timer = setTimeout(() => {
      loadMaterials();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [search, course, semester, subjectId, categoryId, sort]);

  const paginated = materials.slice(0, page * PER_PAGE);
  const hasMore = paginated.length < materials.length;

  const clearFilters = () => { setSearch(""); setCourse("All Courses"); setSemester("All Semesters"); setSubjectId("All Subjects"); setCategoryId("All Types"); setSort("Most Recent"); setPage(1); };
  
  const activeFilters = [
    course !== "All Courses" ? course : null,
    semester !== "All Semesters" ? semester : null,
    subjectId !== "All Subjects" ? subjects.find(s => s.id === subjectId)?.name : null,
    categoryId !== "All Types" ? categories.find(c => c.id === categoryId)?.name : null
  ].filter(Boolean) as string[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 heading-font mb-2">Study Materials</h1>
        <p className="text-slate-500">Browse curated study materials from top students</p>
      </div>
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search by title, subject, author, or tag..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full pl-11 pr-4 py-3 rounded-xl border border-blue-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all text-sm text-slate-700" />
          {search && (<button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={16} /></button>)}
        </div>
        <button onClick={() => setFiltersOpen(!filtersOpen)} className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-medium text-sm transition-all ${filtersOpen || activeFilters.length > 0 ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white text-slate-700 border-blue-100 hover:border-blue-300 shadow-sm"}`}>
          <SlidersHorizontal size={16} /> Filters {activeFilters.length > 0 && (<span className="bg-white text-blue-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{activeFilters.length}</span>)}
        </button>
      </div>
      {filtersOpen && (
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 mb-5 animate-slide-down">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Course</label>
              <div className="relative"><select value={course} onChange={(e) => { setCourse(e.target.value); setPage(1); }} className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all cursor-pointer">{COURSES.map((o) => <option key={o}>{o}</option>)}</select><ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" /></div>
            </div>
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Semester</label>
              <div className="relative"><select value={semester} onChange={(e) => { setSemester(e.target.value); setPage(1); }} className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all cursor-pointer">{SEMESTERS.map((o) => <option key={o}>{o}</option>)}</select><ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" /></div>
            </div>
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Subject</label>
              <div className="relative"><select value={subjectId} onChange={(e) => { setSubjectId(e.target.value); setPage(1); }} className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all cursor-pointer"><option value="All Subjects">All Subjects</option>{subjects.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</select><ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" /></div>
            </div>
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Type</label>
              <div className="relative"><select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(1); }} className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all cursor-pointer"><option value="All Types">All Types</option>{categories.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</select><ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" /></div>
            </div>
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Sort By</label>
              <div className="relative"><select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all cursor-pointer">{SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}</select><ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" /></div>
            </div>
          </div>
          {activeFilters.length > 0 && (<button onClick={clearFilters} className="mt-3 text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1"><X size={12} /> Clear all filters</button>)}
        </div>
      )}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map((f) => (<span key={f} className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">{f}</span>))}
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-800">{paginated.length}</span> of <span className="font-semibold text-slate-800">{materials.length}</span> materials</p>
        <div className="flex items-center gap-2 text-sm text-slate-500"><span>Sort:</span><select value={sort} onChange={(e) => setSort(e.target.value)} className="border-0 bg-transparent text-blue-700 font-semibold focus:outline-none cursor-pointer text-sm">{SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}</select></div>
      </div>
      
      {loading ? (
        <div className="text-center py-20">Loading materials...</div>
      ) : materials.length === 0 ? (
        <div className="text-center py-20"><div className="text-6xl mb-4">📭</div><h3 className="text-xl font-bold text-slate-700 heading-font mb-2">No materials found</h3><p className="text-slate-500 mb-6">Try adjusting your filters or search query</p><button onClick={clearFilters} className="btn-primary px-6 py-3 rounded-xl font-semibold">Clear Filters</button></div>
      ) : (
        <><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{paginated.map((m) => (<MaterialCard key={m.id} material={m} />))}</div>{hasMore && (<div className="text-center mt-10"><button onClick={() => setPage((p) => p + 1)} className="px-8 py-3 rounded-xl border-2 border-blue-200 text-blue-700 font-semibold hover:bg-blue-50 hover:border-blue-400 transition-all">Load More Materials</button></div>)}</>
      )}
    </div>
  );
}
