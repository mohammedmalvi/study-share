"use client";

import { Star, Download, Eye, Heart, FileText, BookOpen, HelpCircle, ClipboardList } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { Material } from "@/types/database";

const typeColors: Record<string, string> = {
  Notes: "bg-blue-100 text-blue-700",
  PDF: "bg-violet-100 text-violet-700",
  "Question Paper": "bg-amber-100 text-amber-700",
  Assignment: "bg-rose-100 text-rose-700",
  "Practical File": "bg-emerald-100 text-emerald-700",
  "Study Guide": "bg-cyan-100 text-cyan-700",
};

const typeIcons: Record<string, typeof FileText> = {
  Notes: BookOpen,
  PDF: FileText,
  "Question Paper": HelpCircle,
  Assignment: ClipboardList,
  "Practical File": ClipboardList,
  "Study Guide": BookOpen,
};

type Props = {
  material: Material;
  compact?: boolean;
};

export default function MaterialCard({ material, compact }: Props) {
  const { navigateTo, favorites, toggleFavorite, user, showToast } = useApp();
  const isFav = favorites.includes(material.id);
  const typeName = material.categories?.name ?? "PDF";
  const Icon = typeIcons[typeName] ?? FileText;

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { showToast("Please login to download materials", "error"); return; }
    showToast(`Downloading "${material.title}"...`);
    window.open(material.file_url, '_blank');
  };

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { showToast("Please login to save favorites", "error"); return; }
    toggleFavorite(material.id);
    showToast(isFav ? "Removed from favorites" : "Added to favorites", isFav ? "info" : "success");
  };

  const formattedSize = typeof material.file_size === "number" 
    ? `${(material.file_size / 1024 / 1024).toFixed(2)} MB` 
    : material.file_size;

  return (
    <div onClick={() => navigateTo(`/materials/${material.id}`)} className="bg-white rounded-2xl border border-blue-50 shadow-sm card-hover cursor-pointer overflow-hidden group">
      {material.thumbnail && !compact ? (
        <div className="relative h-36 overflow-hidden bg-blue-100">
          <img src={material.thumbnail} alt={`Thumbnail for ${material.title}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <span className={`absolute bottom-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full ${typeColors[typeName] ?? "bg-slate-100 text-slate-600"}`}>{typeName}</span>
          <button onClick={handleFav} className={`absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center transition-all ${isFav ? "text-rose-500" : "text-slate-400 hover:text-rose-400"}`}>
            <Heart size={14} fill={isFav ? "currentColor" : "none"} />
          </button>
        </div>
      ) : (
        <div className={`h-1.5 w-full ${typeName === "Notes" ? "bg-gradient-to-r from-blue-400 to-blue-600" : typeName === "Question Paper" ? "bg-gradient-to-r from-amber-400 to-amber-600" : typeName === "Study Guide" ? "bg-gradient-to-r from-cyan-400 to-cyan-600" : typeName === "Practical File" ? "bg-gradient-to-r from-emerald-400 to-emerald-600" : "bg-gradient-to-r from-violet-400 to-violet-600"}`} />
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
            <Icon size={20} className="text-blue-600" />
          </div>
          {(!material.thumbnail || compact) && (
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColors[typeName] ?? "bg-slate-100 text-slate-600"}`}>{typeName}</span>
              <button onClick={handleFav} className={`p-1 rounded-lg transition-all ${isFav ? "text-rose-500" : "text-slate-300 hover:text-rose-400"}`}>
                <Heart size={16} fill={isFav ? "currentColor" : "none"} />
              </button>
            </div>
          )}
        </div>
        <h3 className="font-bold text-slate-800 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-blue-700 transition-colors heading-font">{material.title}</h3>
        {!compact && <p className="text-xs text-slate-500 mb-3 line-clamp-2">{material.description}</p>}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="text-xs bg-slate-50 text-slate-600 px-2 py-0.5 rounded-full border border-slate-100">{material.course}</span>
          <span className="text-xs bg-slate-50 text-slate-600 px-2 py-0.5 rounded-full border border-slate-100">{material.semester}</span>
          {material.subjects?.name && <span className="text-xs bg-slate-50 text-slate-600 px-2 py-0.5 rounded-full border border-slate-100">{material.subjects.name}</span>}
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1"><Star size={12} className="text-amber-400" fill="currentColor" /><span className="text-xs font-semibold text-slate-700">{material.rating}</span></div>
          <div className="flex items-center gap-1 text-slate-500"><Download size={12} /><span className="text-xs">{material.downloads.toLocaleString()}</span></div>
          <span className="text-xs text-slate-400">{formattedSize}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); navigateTo(`/materials/${material.id}`); }} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-blue-200 text-blue-700 text-xs font-semibold hover:bg-blue-50 transition-all">
            <Eye size={13} /> View
          </button>
          <button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all">
            <Download size={13} /> Download
          </button>
        </div>
      </div>
    </div>
  );
}

