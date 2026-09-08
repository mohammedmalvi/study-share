"use client";

import { useState } from "react";
import { Shield, CheckCircle, XCircle, Clock, Eye, Download, Trash2, Search, Filter, FileText, Users, TrendingUp, BarChart3, AlertTriangle, ChevronDown, Star, BookOpen } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { MATERIALS } from "@/data/mockData";
import type { Material } from "@/data/mockData";

export default function AdminPage() {
  const { navigateTo, user, showToast } = useApp();
  const [materials, setMaterials] = useState<Material[]>([...MATERIALS]);
  const [filterStatus, setFilterStatus] = useState<"all" | "approved" | "pending" | "rejected">("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faff] animate-fade-in">
        <div className="text-center p-8">
          <Shield size={48} className="text-red-300 mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold heading-font text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-500 mb-6">You need admin privileges to access this page</p>
          <button onClick={() => navigateTo("/")} className="btn-primary px-8 py-3 rounded-xl font-semibold">Go Home</button>
        </div>
      </div>
    );
  }

  const filtered = materials.filter(m => {
    const matchStatus = filterStatus === "all" || (m.status as string) === filterStatus;
    const matchSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.subject.toLowerCase().includes(searchQuery.toLowerCase()) || m.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleApprove = (id: string) => { setMaterials(prev => prev.map(m => m.id === id ? { ...m, status: "approved" as const } : m)); showToast("Material approved!"); };
  const handleReject = (id: string) => { setMaterials(prev => prev.map(m => m.id === id ? { ...m, status: "rejected" as const } : m)); showToast("Material rejected", "info"); };
  const handleDelete = (id: string) => { setMaterials(prev => prev.filter(m => m.id !== id)); showToast("Material deleted", "info"); };

  const stats = [
    { label: "Total", value: materials.length, icon: FileText, color: "text-blue-600 bg-blue-50" },
    { label: "Pending", value: materials.filter(m => (m.status as string) === "pending").length, icon: Clock, color: "text-amber-600 bg-amber-50" },
    { label: "Approved", value: materials.filter(m => (m.status as string) === "approved").length, icon: CheckCircle, color: "text-green-600 bg-green-50" },
    { label: "Rejected", value: materials.filter(m => (m.status as string) === "rejected").length, icon: XCircle, color: "text-red-600 bg-red-50" },
  ];

  const statusColors: Record<string, string> = { pending: "bg-amber-100 text-amber-700", approved: "bg-emerald-100 text-emerald-700", rejected: "bg-red-100 text-red-700" };
  const statusIcons: Record<string, typeof Clock> = { pending: Clock, approved: CheckCircle, rejected: XCircle };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center"><Shield size={20} className="text-white" /></div>
        <div><h1 className="text-3xl font-extrabold heading-font text-slate-900">Admin Panel</h1><p className="text-slate-500 text-sm">Manage and review study materials</p></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}><s.icon size={18} /></div>
            <p className="text-2xl font-bold heading-font text-slate-900">{s.value}</p>
            <p className="text-sm text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search materials..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-blue-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700" />
        </div>
        <div className="flex gap-2">
          {(["all", "pending", "approved", "rejected"] as const).map(status => (
            <button key={status} onClick={() => setFilterStatus(status)} className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${filterStatus === status ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-blue-100 hover:bg-blue-50"}`}>{status}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-blue-50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Material</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Author</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Downloads</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(m => {
                const StatusIcon = statusIcons[(m.status as string) || "pending"] ?? Clock;
                return (
                  <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0"><FileText size={18} className="text-blue-600" /></div><div className="min-w-0"><p className="font-semibold text-slate-800 text-sm truncate max-w-[200px]">{m.title}</p><p className="text-xs text-slate-500">{m.subject} · {m.fileSize}</p></div></div></td>
                    <td className="px-6 py-4 hidden md:table-cell"><span className="text-sm text-slate-600">{m.author}</span></td>
                    <td className="px-6 py-4"><span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[(m.status as string)] || statusColors.pending}`}><StatusIcon size={12} />{(m.status as string) || "pending"}</span></td>
                    <td className="px-6 py-4 hidden md:table-cell"><span className="text-sm text-slate-600">{m.downloads.toLocaleString()}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => navigateTo(`/materials/${m.id}`)} className="p-2 rounded-lg hover:bg-blue-50 text-slate-500 hover:text-blue-600" title="View"><Eye size={16} /></button>
                        {(m.status as string) === "pending" && (<>
                          <button onClick={() => handleApprove(m.id)} className="p-2 rounded-lg hover:bg-green-50 text-slate-500 hover:text-green-600" title="Approve"><CheckCircle size={16} /></button>
                          <button onClick={() => handleReject(m.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600" title="Reject"><XCircle size={16} /></button>
                        </>)}
                        <button onClick={() => handleDelete(m.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600" title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (<div className="text-center py-12"><Search size={32} className="text-slate-300 mx-auto mb-3" /><p className="text-slate-500">No materials found</p></div>)}
      </div>
    </div>
  );
}
