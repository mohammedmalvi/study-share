"use client";

import { useState } from "react";
import { BookOpen, Menu, X, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/lib/supabase/auth";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Study Materials", href: "/materials" },
  { label: "Categories", href: "/categories" },
  { label: "Upload Material", href: "/upload" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const { navigateTo, user, showToast } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      showToast(error.message, "error");
      return;
    }
    showToast("Logged out successfully", "info");
    navigateTo("/");
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => navigateTo("/")} className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-blue-200 transition-shadow">
              <BookOpen size={18} className="text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-blue-700 text-lg heading-font tracking-tight">StudyShare</span>
              <span className="text-[10px] text-blue-400 font-medium tracking-widest uppercase">Learn. Share. Grow.</span>
            </div>
          </button>
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button key={link.href} onClick={() => navigateTo(link.href)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${pathname === link.href ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:text-blue-700 hover:bg-blue-50"}`}>
                {link.label}
              </button>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                {user.role === "admin" && (
                  <button onClick={() => navigateTo("/admin")} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-violet-700 hover:bg-violet-50 transition-all">
                    <Shield size={14} /> Admin
                  </button>
                )}
                <button onClick={() => navigateTo("/dashboard")} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-50 transition-all">
                  <LayoutDashboard size={14} /> Dashboard
                </button>
                <div className="flex items-center gap-2 ml-1">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.name && user.name.length > 0 ? user.name[0].toUpperCase() : "U"}
                  </div>
                  <button onClick={handleLogout} className="p-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all" title="Logout">
                    <LogOut size={16} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <button onClick={() => navigateTo("/login")} className="px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 rounded-lg transition-all">Login</button>
                <button onClick={() => navigateTo("/signup")} className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-blue-200 hover:shadow-md">Sign Up</button>
              </>
            )}
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-blue-50 transition-all">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-blue-100 bg-white animate-slide-down">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <button key={link.href} onClick={() => { navigateTo(link.href); setMobileOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${pathname === link.href ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`}>
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t border-blue-50 flex gap-2">
              {user ? (
                <>
                  <button onClick={() => { navigateTo("/dashboard"); setMobileOpen(false); }} className="flex-1 px-4 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 rounded-lg">Dashboard</button>
                  <button onClick={handleLogout} className="px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 rounded-lg">Logout</button>
                </>
              ) : (
                <>
                  <button onClick={() => { navigateTo("/login"); setMobileOpen(false); }} className="flex-1 px-4 py-2.5 text-sm font-semibold text-blue-700 border border-blue-200 rounded-lg">Login</button>
                  <button onClick={() => { navigateTo("/signup"); setMobileOpen(false); }} className="flex-1 px-4 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-lg">Sign Up</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

