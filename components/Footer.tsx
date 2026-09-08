"use client";

import { BookOpen, Mail, Phone, MapPin, GitBranch, Globe, Link as LinkIcon } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function Footer() {
  const { navigateTo } = useApp();

  const links = [
    { label: "Home", href: "/" },
    { label: "Study Materials", href: "/materials" },
    { label: "Categories", href: "/categories" },
    { label: "Upload Material", href: "/upload" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const categories = ["Programming", "Database Management", "Web Development", "Automata Theory", "Computer Networks", "Operating Systems", "Mathematics", "Cyber Security"];

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <BookOpen size={18} className="text-white" />
              </div>
              <div className="leading-none">
                <div className="font-extrabold text-white text-lg heading-font">StudyShare</div>
                <div className="text-[10px] text-blue-400 tracking-widest uppercase">Learn. Share. Grow.</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">A student-focused platform to discover, share and collaborate on educational resources. Making knowledge accessible to every student.</p>
            <div className="flex gap-3">
              {[Globe, Globe, GitBranch, LinkIcon].map((Icon, i) => (
                <button key={i} className="w-9 h-9 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all">
                  <Icon size={16} className="text-slate-400 hover:text-white" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 heading-font">Quick Links</h4>
            <ul className="space-y-2.5">
              {links.map((l) => (
                <li key={l.href}><button onClick={() => navigateTo(l.href)} className="text-sm text-slate-400 hover:text-blue-400 transition-colors">{l.label}</button></li>
              ))}
              <li><button className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Privacy Policy</button></li>
              <li><button className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Terms & Conditions</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 heading-font">Categories</h4>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat}><button onClick={() => navigateTo("/materials")} className="text-sm text-slate-400 hover:text-blue-400 transition-colors">{cat}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 heading-font">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3"><Mail size={16} className="text-blue-400 mt-0.5 shrink-0" /><span className="text-sm text-slate-400">studyshare@college.edu</span></li>
              <li className="flex items-start gap-3"><Phone size={16} className="text-blue-400 mt-0.5 shrink-0" /><span className="text-sm text-slate-400">+91 98765 43210</span></li>
              <li className="flex items-start gap-3"><MapPin size={16} className="text-blue-400 mt-0.5 shrink-0" /><span className="text-sm text-slate-400">BCA Department, College Campus, New Delhi - 110001</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-slate-500">© 2025 StudyShare. All rights reserved. A BCA Final Year Project.</p>
          <div className="flex gap-4">
            <button className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Privacy Policy</button>
            <button className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Terms & Conditions</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
