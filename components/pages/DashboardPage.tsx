"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import MaterialCard from "@/components/MaterialCard";
import { fetchMaterials } from "@/lib/supabase/materials";
import { getUserDownloads } from "@/lib/supabase/downloads";
import type { Material } from "@/types/database";
import {
  BookOpen, Download, Heart, Upload, TrendingUp,
  Star, BarChart3, CheckCircle, Clock, XCircle, FileText, Shield
} from "lucide-react";

export default function DashboardPage() {
  const { navigateTo, user, showToast, favorites, isAuthLoading } = useApp();
  const [activeTab, setActiveTab] = useState<"overview" | "uploads" | "favorites" | "downloads">("overview");

  const [userUploads, setUserUploads] = useState<Material[]>([]);
  const [favMaterials, setFavMaterials] = useState<Material[]>([]);
  const [recentDownloads, setRecentDownloads] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      if (!user) return;
      setLoading(true);
      
      // 1. Fetch user's uploads
      const uploads = await fetchMaterials({ limit: 100 });
      const myUploads = uploads.filter(m => m.user_id === user.id);
      
      // 2. Fetch favorites
      const favs = uploads.filter(m => favorites.includes(m.id));
      
      // 3. Fetch downloads
      const downloadedIds = await getUserDownloads(user.id);
      const downloads = uploads.filter(m => downloadedIds.includes(m.id));
      
      setUserUploads(myUploads);
      setFavMaterials(favs);
      setRecentDownloads(downloads);
      setLoading(false);
    }
    loadDashboard();
  }, [user, favorites]);

  // Show loading spinner while auth state is being resolved (e.g. after signup)
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faff] animate-fade-in">
        <div className="text-center p-8">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faff] animate-fade-in">
        <div className="text-center p-8">
          <BookOpen size={48} className="text-blue-300 mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold heading-font text-slate-900 mb-2">Login Required</h2>
          <p className="text-slate-500 mb-6">Please login to access your dashboard</p>
          <button onClick={() => navigateTo("/login")} className="btn-primary px-8 py-3 rounded-xl font-semibold">Go to Login</button>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: Upload, label: "Uploads", value: String(userUploads.length), color: "text-blue-600 bg-blue-50", trend: "+3 this month" },
    { icon: Download, label: "Downloads", value: String(recentDownloads.length), color: "text-green-600 bg-green-50", trend: "+28 this week" },
    { icon: Heart, label: "Favorites", value: String(favMaterials.length), color: "text-rose-600 bg-rose-50", trend: "Updated" },
    { icon: Star, label: "Avg Rating", value: "4.7", color: "text-amber-600 bg-amber-50", trend: "Top 10%" },
  ];

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: BarChart3 },
    { id: "uploads" as const, label: "My Uploads", icon: Upload },
    { id: "favorites" as const, label: "Favorites", icon: Heart },
    { id: "downloads" as const, label: "Downloads", icon: Download },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold heading-font text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, {user.name}!</p>
        </div>
        <button onClick={() => navigateTo("/upload")} className="btn-primary px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2">
          <Upload size={16} /> Upload Material
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon size={18} />
              </div>
              <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">{stat.trend}</span>
            </div>
            <p className="text-2xl font-bold heading-font text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-blue-50 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="text-center py-20">Loading...</div>
      ) : activeTab === "overview" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-blue-50 shadow-sm">
            <h3 className="text-lg font-bold heading-font text-slate-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { icon: Upload, text: 'You uploaded "Python Complete Notes"', time: "2 hours ago", color: "text-blue-600 bg-blue-50" },
                { icon: Download, text: 'Someone downloaded your "DBMS Notes"', time: "5 hours ago", color: "text-green-600 bg-green-50" },
                { icon: Heart, text: "Your material was favorited", time: "1 day ago", color: "text-rose-600 bg-rose-50" },
                { icon: CheckCircle, text: '"OS Study Material" was approved', time: "2 days ago", color: "text-emerald-600 bg-emerald-50" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className={`w-9 h-9 rounded-lg ${activity.color} flex items-center justify-center shrink-0`}>
                    <activity.icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">{activity.text}</p>
                    <p className="text-xs text-slate-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!loading && activeTab === "uploads" && (
        <div>
          {userUploads.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {userUploads.map((m) => (<MaterialCard key={m.id} material={m} />))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Upload size={48} className="text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No uploads yet</h3>
              <p className="text-slate-500 mb-4">Start sharing your study materials</p>
              <button onClick={() => navigateTo("/upload")} className="btn-primary px-6 py-2.5 rounded-xl font-semibold">Upload Material</button>
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === "favorites" && (
        <div>
          {favMaterials.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {favMaterials.map((m) => (<MaterialCard key={m.id} material={m} />))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart size={48} className="text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No favorites yet</h3>
              <p className="text-slate-500 mb-4">Browse materials and save your favorites</p>
              <button onClick={() => navigateTo("/materials")} className="btn-primary px-6 py-2.5 rounded-xl font-semibold">Browse Materials</button>
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === "downloads" && (
        <div>
          {recentDownloads.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recentDownloads.map((m) => (<MaterialCard key={m.id} material={m} compact />))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Download size={48} className="text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No downloads yet</h3>
              <p className="text-slate-500 mb-4">You haven't downloaded any materials</p>
              <button onClick={() => navigateTo("/materials")} className="btn-primary px-6 py-2.5 rounded-xl font-semibold">Browse Materials</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
