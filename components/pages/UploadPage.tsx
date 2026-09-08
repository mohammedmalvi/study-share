"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, CloudUpload, X, CheckCircle, FileText, AlertCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { fetchSubjects } from "@/lib/supabase/subjects";
import { fetchCategories } from "@/lib/supabase/categories";
import { uploadPdf, getFileUrl } from "@/lib/supabase/storage";
import { createMaterial } from "@/lib/supabase/materials";
import type { Subject, Category } from "@/types/database";

const COURSES = ["BCA", "MCA", "BSc CS", "BTech"];
const SEMESTERS = ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester"];
const ALLOWED_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "text/plain"];

export default function UploadPage() {
  const { navigateTo, user, showToast } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ title: "", description: "", course: "", semester: "", subject_id: "", category_id: "", tags: "" });

  useEffect(() => {
    async function loadData() {
      const [subs, cats] = await Promise.all([fetchSubjects(), fetchCategories()]);
      setSubjects(subs);
      setCategories(cats);
    }
    loadData();
  }, []);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { setForm((f) => ({ ...f, [field]: e.target.value })); setErrors((e2) => ({ ...e2, [field]: "" })); };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.course) errs.course = "Please select a course";
    if (!form.semester) errs.semester = "Please select a semester";
    if (!form.subject_id) errs.subject_id = "Please select a subject";
    if (!form.category_id) errs.category_id = "Please select material category";
    if (!file) errs.file = "Please upload a file";
    return errs;
  };

  const handleFile = (f: File) => {
    if (!ALLOWED_TYPES.includes(f.type) && !f.name.match(/\.(pdf|doc|docx|ppt|pptx|txt)$/i)) { showToast("Invalid file type. Allowed: PDF, DOC, DOCX, PPT, PPTX, TXT", "error"); return; }
    if (f.size > 20 * 1024 * 1024) { showToast("File too large. Maximum size is 20MB", "error"); return; }
    setFile(f); setErrors((e) => ({ ...e, file: "" }));
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { showToast("Please login to upload materials", "error"); navigateTo("/login"); return; }
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setUploading(true);
    setProgress(10);
    
    // 1. Upload to storage
    const { path, error: uploadError } = await uploadPdf(file as File);
    if (uploadError || !path) {
      showToast(uploadError || "Error uploading file", "error");
      setUploading(false);
      return;
    }
    
    setProgress(50);
    
    // 2. Get Public URL
    const file_url = getFileUrl(path) || path;
    
    setProgress(75);
    
    // 3. Save to database
    const { error: dbError } = await createMaterial({
      title: form.title,
      description: form.description,
      file_url,
      file_type: file!.name.split('.').pop() || "unknown",
      file_size: file!.size,
      subject_id: form.subject_id,
      category_id: form.category_id,
      user_id: user.id,
      status: "approved",
      is_public: true,
      course: form.course,
      semester: form.semester,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
    });
    
    if (dbError) {
      showToast(dbError, "error");
      setUploading(false);
      return;
    }
    
    setProgress(100);
    setUploading(false); 
    setSuccess(true);
    showToast("Material uploaded successfully!");
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center animate-scale-in">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={40} className="text-emerald-500" /></div>
        <h2 className="text-2xl font-extrabold text-slate-900 heading-font mb-3">Material Uploaded Successfully!</h2>
        <p className="text-slate-500 mb-6">Your material is now public and can be viewed by thousands of students.</p>
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-8 text-left">
          <h4 className="font-semibold text-emerald-800 mb-2">{form.title}</h4>
          <p className="text-sm text-emerald-700">{subjects.find(s => s.id === form.subject_id)?.name} · {form.course} · {form.semester}</p>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setSuccess(false); setFile(null); setProgress(0); setForm({ title: "", description: "", course: "", semester: "", subject_id: "", category_id: "", tags: "" }); }} className="px-6 py-3 border-2 border-blue-200 text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-all">Upload Another</button>
          <button onClick={() => navigateTo("/materials")} className="btn-primary px-6 py-3 rounded-xl font-semibold shadow-lg">Browse Materials</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="mb-8"><h1 className="text-3xl font-extrabold text-slate-900 heading-font mb-2">Upload Study Material</h1><p className="text-slate-500">Share your knowledge with thousands of students</p></div>
      {!user && (<div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center gap-3"><AlertCircle size={20} className="text-amber-500 shrink-0" /><div><p className="text-sm font-semibold text-amber-800">Login required to upload</p><button onClick={() => navigateTo("/login")} className="text-xs text-amber-700 underline mt-0.5">Login or create an account</button></div></div>)}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div><label className="block text-sm font-semibold text-slate-700 mb-2">Upload File *</label>
          <div onClick={() => fileRef.current?.click()} onDrop={handleDrop} onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${dragOver ? "border-blue-500 bg-blue-50" : errors.file ? "border-red-300 bg-red-50" : file ? "border-emerald-400 bg-emerald-50" : "border-blue-200 hover:border-blue-400 bg-blue-50/50 hover:bg-blue-50"}`}>
            {file ? (<div className="flex items-center justify-center gap-3"><FileText size={28} className="text-emerald-600" /><div className="text-left"><p className="font-semibold text-emerald-800 text-sm">{file.name}</p><p className="text-xs text-emerald-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p></div><button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="ml-2 p-1 rounded-full hover:bg-emerald-100 text-emerald-700 transition-all"><X size={16} /></button></div>
            ) : (<><CloudUpload size={40} className="text-blue-400 mx-auto mb-3" /><p className="text-slate-700 font-semibold mb-1">Drag & drop your file here</p><p className="text-slate-500 text-sm mb-3">or click to browse</p><span className="text-xs bg-white border border-slate-200 text-slate-500 px-3 py-1.5 rounded-full">PDF, DOC, DOCX, PPT, PPTX, TXT · Max 20MB</span></>)}
          </div>
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          {errors.file && <p className="text-xs text-red-500 mt-1.5">{errors.file}</p>}
        </div>
        {uploading && (<div className="bg-blue-50 rounded-2xl p-4 border border-blue-100"><div className="flex justify-between text-sm mb-2"><span className="font-medium text-blue-700">Uploading...</span><span className="text-blue-600 font-bold">{progress}%</span></div><div className="h-2 bg-blue-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-200" style={{ width: `${progress}%` }} /></div></div>)}
        <div className="bg-white rounded-2xl border border-blue-50 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-slate-800 heading-font">Material Information</h3>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Material Title *</label><input type="text" placeholder='e.g., Python Programming Complete Notes — Unit 1-5' value={form.title} onChange={set("title")} className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all text-slate-700 ${errors.title ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-400"}`} />{errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}</div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Description *</label><textarea placeholder="Describe what topics are covered, which units, exam usefulness, etc." value={form.description} onChange={set("description")} rows={4} className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all resize-none text-slate-700 ${errors.description ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-400"}`} />{errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Course *</label><select value={form.course} onChange={set("course")} className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all text-slate-700 ${errors.course ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-400"}`}><option value="">Select Course</option>{COURSES.map((o) => <option key={o}>{o}</option>)}</select>{errors.course && <p className="text-xs text-red-500 mt-1">{errors.course}</p>}</div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Semester *</label><select value={form.semester} onChange={set("semester")} className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all text-slate-700 ${errors.semester ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-400"}`}><option value="">Select Semester</option>{SEMESTERS.map((o) => <option key={o}>{o}</option>)}</select>{errors.semester && <p className="text-xs text-red-500 mt-1">{errors.semester}</p>}</div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Category *</label><select value={form.category_id} onChange={set("category_id")} className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all text-slate-700 ${errors.category_id ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-400"}`}><option value="">Select Type</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>{errors.category_id && <p className="text-xs text-red-500 mt-1">{errors.category_id}</p>}</div>
          </div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject *</label><select value={form.subject_id} onChange={set("subject_id")} className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all text-slate-700 ${errors.subject_id ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-400"}`}><option value="">Select Subject</option>{subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>{errors.subject_id && <p className="text-xs text-red-500 mt-1">{errors.subject_id}</p>}</div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Tags <span className="font-normal text-slate-400">(comma separated)</span></label><input type="text" placeholder="e.g., python, oop, bca, notes" value={form.tags} onChange={set("tags")} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all text-slate-700" /></div>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => navigateTo("/materials")} className="px-6 py-3.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all">Cancel</button>
          <button type="submit" disabled={uploading} className="flex-1 btn-primary flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"><Upload size={18} />{uploading ? `Uploading... ${progress}%` : "Upload Material"}</button>
        </div>
      </form>
    </div>
  );
}
