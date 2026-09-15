"use client";

import { useEffect, useState } from "react";
import { X, Download, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useApp } from "@/context/AppContext";
import type { Material } from "@/types/database";

interface PDFPreviewModalProps {
  material: Material | null;
  isOpen: boolean;
  onClose: () => void;
}

export const getPublicPdfUrl = (material: Material | null): string => {
  if (!material) return "";
  let url = material.file_url || "";

  const filePath = material.file_path || material.file_url;
  if (supabase && filePath) {
    let cleanPath = filePath;
    if (cleanPath.includes("storage/v1/object/public/study-materials/")) {
      cleanPath = cleanPath.split("storage/v1/object/public/study-materials/")[1];
    } else if (cleanPath.includes("/study-materials/")) {
      cleanPath = cleanPath.split("/study-materials/")[1];
    }

    // Call getPublicUrl on the Supabase storage bucket 'study-materials'
    if (!cleanPath.startsWith("http://") && !cleanPath.startsWith("https://")) {
      const { data } = supabase.storage.from("study-materials").getPublicUrl(cleanPath);
      if (data?.publicUrl) {
        url = data.publicUrl;
      }
    }
  }

  return url;
};

export default function PDFPreviewModal({ material, isOpen, onClose }: PDFPreviewModalProps) {
  const { user, navigateTo, showToast } = useApp();
  const [publicUrl, setPublicUrl] = useState<string>("");

  useEffect(() => {
    if (!material) {
      setPublicUrl("");
      return;
    }
    const resolvedUrl = getPublicPdfUrl(material);
    setPublicUrl(resolvedUrl);
  }, [material]);

  if (!isOpen || !material) return null;

  const handleDownload = () => {
    if (!user) {
      onClose();
      navigateTo("/login");
      return;
    }
    showToast(`Downloading "${material.title}"...`);
    const downloadUrl = publicUrl || material.file_url;
    window.open(downloadUrl, "_blank");
  };

  const previewSrc = publicUrl ? `${publicUrl}#toolbar=0` : `${material.file_url}#toolbar=0`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3 overflow-hidden mr-4">
            <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
              <FileText size={20} />
            </div>
            <div className="overflow-hidden">
              <h2 className="font-bold text-slate-800 text-base truncate heading-font">
                {material.title}
              </h2>
              <p className="text-xs text-slate-500 truncate">
                {material.course} • {material.semester} • PDF Document
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownload}
              className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm"
            >
              <Download size={14} /> Download PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-all"
              aria-label="Close PDF Preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Inline PDF Viewer */}
        <div className="flex-1 bg-slate-100 relative">
          <iframe
            src={previewSrc}
            className="w-full h-full border-0"
            title={`PDF Preview - ${material.title}`}
          />
        </div>
      </div>
    </div>
  );
}
