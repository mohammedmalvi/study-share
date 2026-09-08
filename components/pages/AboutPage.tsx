"use client";

import { BookOpen, Target, Eye, Users, Zap, Shield, Heart, Star } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function AboutPage() {
  const { navigateTo } = useApp();
  const features = [
    { icon: BookOpen, title: "Rich Material Library", desc: "Access 1,200+ study materials across 60+ subjects, all organized and searchable." },
    { icon: Users, title: "Student Community", desc: "Join a growing community of students sharing knowledge and supporting each other." },
    { icon: Zap, title: "Instant Access", desc: "Download materials instantly with no wait times, no subscriptions, completely free." },
    { icon: Shield, title: "Verified Content", desc: "Every material is reviewed before publishing to ensure quality and accuracy." },
    { icon: Heart, title: "Made with Love", desc: "Built by BCA students, for BCA students. We understand your needs." },
    { icon: Star, title: "Student Ratings", desc: "Community ratings help you find the best and most helpful materials quickly." },
  ];

  return (
    <div className="animate-fade-in">
      <section className="relative hero-gradient py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/80 border border-blue-100 rounded-full px-4 py-1.5 text-xs font-semibold text-blue-700 mb-5 shadow-sm"><BookOpen size={12} /><span>About StudyShare</span></div>
              <h1 className="text-4xl font-extrabold text-slate-900 heading-font mb-4 leading-tight">Making Education <span className="text-blue-600">Accessible</span> for Every Student</h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">StudyShare is a student-focused platform designed to make sharing and accessing educational resources easier, faster, and more collaborative than ever before.</p>
              <p className="text-slate-600 leading-relaxed">Born from a BCA final-year project, StudyShare grew into a community-driven platform where knowledge flows freely between students. We believe education should be collaborative, not competitive.</p>
              <div className="flex gap-4 mt-8">
                <button onClick={() => navigateTo("/signup")} className="btn-primary px-6 py-3 rounded-xl font-semibold shadow-lg">Join Free</button>
                <button onClick={() => navigateTo("/materials")} className="px-6 py-3 rounded-xl font-semibold border border-blue-200 text-blue-700 hover:bg-white/60 transition-all">Browse Materials</button>
              </div>
            </div>
            <div className="hidden lg:block rounded-3xl overflow-hidden shadow-2xl bg-blue-100">
              <img src="https://images.unsplash.com/photo-1771325650489-a41d05192c18?w=700&h=500&fit=crop&auto=format" alt="Students studying together in a library" className="w-full h-[420px] object-cover" />
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white"><div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-5"><Target size={24} className="text-white" /></div><h2 className="text-2xl font-extrabold heading-font mb-4">Our Mission</h2><p className="text-blue-100 leading-relaxed">To build the most comprehensive, student-maintained repository of academic study materials that empowers every student — regardless of background — to access quality educational resources for free.</p></div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-white"><div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-5"><Eye size={24} className="text-white" /></div><h2 className="text-2xl font-extrabold heading-font mb-4">Our Vision</h2><p className="text-slate-300 leading-relaxed">To become India{"'"}s largest student-driven knowledge-sharing platform — where every student finds the resources they need, contributes what they know, and grows together as a community of learners.</p></div>
        </div>
      </section>
      <section className="bg-slate-50/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12"><h2 className="text-3xl font-extrabold text-slate-900 heading-font mb-2">What Makes StudyShare Special</h2><p className="text-slate-500">Features designed with students in mind</p></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-blue-50 shadow-sm p-6 card-hover"><div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4"><Icon size={22} className="text-blue-600" /></div><h3 className="font-bold text-slate-800 heading-font mb-2">{title}</h3><p className="text-sm text-slate-500 leading-relaxed">{desc}</p></div>
            ))}
          </div>
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12"><h2 className="text-3xl font-extrabold text-slate-900 heading-font mb-2">Built for BCA Students</h2><p className="text-slate-500">Every feature designed to help you ace your exams</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["Find semester-specific notes and question papers in seconds","Download complete study guides for all BCA subjects","Upload your own notes and build your academic reputation","Save and organize materials for quick exam-time access","Rate and review materials to help your batch-mates","Discover trending materials that other students found helpful"].map((b, i) => (
            <div key={i} className="flex items-start gap-3 bg-blue-50/50 rounded-xl p-4 border border-blue-100"><div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shrink-0 mt-0.5"><span className="text-white text-xs font-bold">{i+1}</span></div><p className="text-sm text-slate-700 font-medium">{b}</p></div>
          ))}
        </div>
      </section>
      <section className="hero-gradient py-16">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-2xl font-extrabold text-slate-900 heading-font mb-4">A BCA Final Year Project</h2>
          <p className="text-slate-600 leading-relaxed mb-6">StudyShare was developed as a BCA Final Year Project with the goal of solving a real problem faced by college students — the difficulty of finding and sharing quality study materials. It demonstrates full-stack web development skills including React, responsive UI design, database architecture, and user authentication.</p>
          <button onClick={() => navigateTo("/contact")} className="btn-primary px-8 py-3.5 rounded-xl font-semibold shadow-lg">Get in Touch</button>
        </div>
      </section>
    </div>
  );
}
