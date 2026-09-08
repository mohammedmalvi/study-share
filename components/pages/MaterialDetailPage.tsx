"use client";

import { useState, useEffect } from "react";
import { Star, Download, Heart, Flag, User, Calendar, FileType, HardDrive, BookOpen, ArrowLeft, Share2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import MaterialCard from "@/components/MaterialCard";
import { fetchMaterials } from "@/lib/supabase/materials";
import type { Material } from "@/types/database";

export default function MaterialDetailPage({ materialId }: { materialId: string }) {
  const { navigateTo, favorites, toggleFavorite, user, showToast } = useApp();
  
  const [material, setMaterial] = useState<Material | null>(null);
  const [related, setRelated] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      // Fetch this material
      const allMaterials = await fetchMaterials();
      const current = allMaterials.find(m => m.id === materialId);
      
      if (current) {
        setMaterial(current);
        // Find related
        const relatedMaterials = allMaterials
          .filter(m => m.id !== current.id && (m.course === current.course || m.subject_id === current.subject_id))
          .slice(0, 3);
        setRelated(relatedMaterials);
      }
      setLoading(false);
    }
    loadData();
  }, [materialId]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">Loading material...</div>;
  }

  if (!material) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Material Not Found</h1>
        <button onClick={() => navigateTo("/materials")} className="btn-primary px-6 py-3 rounded-xl">Back to Materials</button>
      </div>
    );
  }

  const isFav = favorites.includes(material.id);
  const typeName = material.categories?.name ?? "PDF";
  const authorName = material.profiles?.name ?? "Unknown";
  const subjectName = material.subjects?.name ?? "Unknown Subject";
  
  const formattedSize = typeof material.file_size === "number" 
    ? `${(material.file_size / 1024 / 1024).toFixed(2)} MB` 
    : material.file_size;

  const uploadDate = new Date(material.created_at).toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const handleDownload = () => {
    if (!user) { showToast("Please login to download materials", "error"); return; }
    // Ideally we would trigger a real download using Supabase storage here
    window.open(material.file_url, '_blank');
    showToast(`Downloading "${material.title}"...`);
  };

  const handleFav = () => {
    if (!user) { showToast("Please login to save favorites", "error"); return; }
    toggleFavorite(material.id);
    showToast(isFav ? "Removed from favorites" : "Saved to favorites!");
  };

  const handleReport = () => {
    if (!user) { showToast("Please login to report material", "error"); return; }
    showToast("Report submitted. We'll review this material.", "info");
  };

  const typeColor: Record<string, string> = {
    Notes: "bg-blue-100 text-blue-700",
    PDF: "bg-violet-100 text-violet-700",
    "Question Paper": "bg-amber-100 text-amber-700",
    Assignment: "bg-rose-100 text-rose-700",
    "Practical File": "bg-emerald-100 text-emerald-700",
    "Study Guide": "bg-cyan-100 text-cyan-700",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <button onClick={() => navigateTo("/materials")} className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-700 mb-6 transition-colors font-medium">
        <ArrowLeft size={16} /> Back to Materials
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 mb-6 h-64 flex items-center justify-center shadow-sm">
            {material.thumbnail ? (
              <img src={material.thumbnail} alt="Material thumbnail" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <img src="https://images.unsplash.com/photo-1769794371055-54436b54577e?w=800&h=400&fit=crop&auto=format" alt="Study material preview" className="absolute inset-0 w-full h-full object-cover opacity-20" />
            )}
            {!material.thumbnail && (
              <div className="relative text-center">
                <div className="w-20 h-20 bg-white/80 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md"><BookOpen size={36} className="text-blue-600" /></div>
                <div className={`inline-block text-sm font-semibold px-3 py-1 rounded-full ${typeColor[typeName] ?? "bg-slate-100 text-slate-600"}`}>{typeName}</div>
              </div>
            )}
          </div>
          <div className="bg-white rounded-2xl border border-blue-50 shadow-sm p-6 mb-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-2xl font-extrabold text-slate-900 heading-font leading-tight">{material.title}</h1>
              <button onClick={handleFav} className={`p-2.5 rounded-xl border transition-all shrink-0 ${isFav ? "bg-rose-50 border-rose-200 text-rose-500" : "border-slate-200 text-slate-400 hover:border-rose-200 hover:text-rose-400"}`}>
                <Heart size={20} fill={isFav ? "currentColor" : "none"} />
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap mb-5">
              <div className="flex items-center gap-1">{[1,2,3,4,5].map((i) => (<Star key={i} size={14} className={i <= Math.round(material.rating) ? "text-amber-400" : "text-slate-200"} fill="currentColor" />))}<span className="text-sm font-semibold text-slate-700 ml-1">{material.rating}</span></div>
              <span className="text-slate-300">•</span>
              <span className="text-sm text-slate-500">{material.downloads.toLocaleString()} downloads</span>
              <span className="text-slate-300">•</span>
              <span className="text-sm text-slate-500">{uploadDate}</span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-5">{material.description}</p>
            {material.tags && material.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">{material.tags.map((tag) => (<span key={tag} className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100 font-medium">#{tag}</span>))}</div>
            )}
          </div>
          <div className="flex gap-3 mb-8">
            <button onClick={handleDownload} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold shadow-lg"><Download size={18} /> Download Material</button>
            <button onClick={() => showToast("Link copied to clipboard!", "info")} className="px-4 py-3.5 rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50 transition-all" title="Share"><Share2 size={18} /></button>
            <button onClick={handleReport} className="px-4 py-3.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all" title="Report"><Flag size={18} /></button>
          </div>
          {related.length > 0 && (
            <div><h2 className="text-xl font-extrabold text-slate-900 heading-font mb-5">Related Materials</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{related.map((m) => (<MaterialCard key={m.id} material={m} compact />))}</div>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-blue-50 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 heading-font mb-4">Material Details</h3>
            <ul className="space-y-3.5">
              {[{ icon: BookOpen, label: "Subject", value: subjectName }, { icon: User, label: "Course", value: material.course }, { icon: BookOpen, label: "Semester", value: material.semester }, { icon: User, label: "Uploaded By", value: authorName }, { icon: Calendar, label: "Upload Date", value: uploadDate }, { icon: FileType, label: "Material Type", value: typeName }, { icon: HardDrive, label: "File Size", value: formattedSize }, { icon: Download, label: "Downloads", value: material.downloads.toLocaleString() }].map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex items-start gap-3"><div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5"><Icon size={13} className="text-blue-600" /></div><div><div className="text-xs text-slate-500 font-medium">{label}</div><div className="text-sm text-slate-800 font-semibold">{value}</div></div></li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white">
            <h3 className="font-bold heading-font mb-2">Found this helpful?</h3>
            <p className="text-blue-200 text-sm mb-4">Share your own notes and help fellow students succeed.</p>
            <button onClick={() => navigateTo("/upload")} className="w-full bg-white text-blue-700 rounded-xl py-2.5 font-semibold text-sm hover:bg-blue-50 transition-all">Upload Your Notes</button>
          </div>
          <div className="bg-white rounded-2xl border border-blue-50 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 heading-font mb-3">Rate this Material</h3>
            <div className="flex gap-2 mb-3">{[1,2,3,4,5].map((i) => (<button key={i} className="text-2xl hover:scale-110 transition-transform">{i <= Math.round(material.rating) ? "⭐" : "☆"}</button>))}</div>
            <textarea placeholder="Write a short review..." rows={3} className="w-full text-sm border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none text-slate-700" />
            <button onClick={() => showToast("Review submitted! Thank you.")} className="mt-2 w-full btn-primary py-2.5 rounded-xl font-semibold text-sm">Submit Review</button>
          </div>
        </div>
      </div>
    </div>
  );
}
