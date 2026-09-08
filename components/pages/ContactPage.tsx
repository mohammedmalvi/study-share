"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, Globe, Link, GitBranch, Link2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function ContactPage() {
  const { showToast } = useApp();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { setForm((f) => ({ ...f, [field]: e.target.value })); setErrors((e2) => ({ ...e2, [field]: "" })); };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.subject.trim()) errs.subject = "Subject is required";
    if (!form.message.trim()) errs.message = "Message is required";
    else if (form.message.trim().length < 20) errs.message = "Message too short (min 20 characters)";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false); setSent(true);
    showToast("Message sent! We'll reply within 24 hours.");
  };

  const contactInfo = [
    { icon: Mail, label: "Email", value: "studyshare@college.edu", link: "mailto:studyshare@college.edu" },
    { icon: Phone, label: "Phone", value: "+91 98765 43210", link: "tel:+919876543210" },
    { icon: MapPin, label: "Address", value: "BCA Department, College Campus, New Delhi - 110001", link: null },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-12"><h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 heading-font mb-3">Contact Us</h1><p className="text-slate-500 text-lg max-w-2xl mx-auto">Have a question, feedback, or want to report an issue? We{"'"}d love to hear from you. Our team responds within 24 hours.</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-5">
          {contactInfo.map(({ icon: Icon, label, value, link }) => (
            <div key={label} className="bg-white rounded-2xl border border-blue-50 shadow-sm p-5 flex items-start gap-4">
              <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center shrink-0"><Icon size={20} className="text-blue-600" /></div>
              <div><div className="text-xs font-semibold text-slate-500 mb-0.5">{label}</div>{link ? (<a href={link} className="text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors">{value}</a>) : (<p className="text-sm font-medium text-slate-700">{value}</p>)}</div>
            </div>
          ))}
          <div className="bg-white rounded-2xl border border-blue-50 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 heading-font mb-4">Follow Us</h3>
            <div className="grid grid-cols-2 gap-2">
              {[{ Icon: Globe, label: "Twitter", handle: "@studyshare" }, { Icon: Link2, label: "LinkedIn", handle: "StudyShare" }, { Icon: GitBranch, label: "GitHub", handle: "studyshare" }, { Icon: Link, label: "Instagram", handle: "@studyshare_in" }].map(({ Icon, label, handle }) => (
                <button key={label} className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all text-left"><Icon size={16} className="text-slate-500" /><div><div className="text-xs font-semibold text-slate-700">{label}</div><div className="text-[10px] text-slate-400">{handle}</div></div></button>
              ))}
            </div>
          </div>
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
            <h3 className="font-bold text-blue-800 heading-font mb-3">Common Questions</h3>
            <div className="space-y-2.5">{["How do I upload a material?","Is StudyShare free to use?","Can I delete my uploaded material?"].map((q) => (<div key={q} className="flex items-start gap-2"><span className="text-blue-500 text-sm mt-0.5">→</span><p className="text-sm text-blue-700 font-medium">{q}</p></div>))}</div>
          </div>
        </div>
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-blue-50 shadow-sm p-7">
            {sent ? (
              <div className="text-center py-10"><div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5"><CheckCircle size={32} className="text-emerald-500" /></div><h3 className="text-xl font-extrabold text-slate-900 heading-font mb-2">Message Sent!</h3><p className="text-slate-500 mb-6">Thank you for reaching out. We{"'"}ll get back to you within 24 hours at <strong className="text-slate-700">{form.email}</strong></p><button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }} className="btn-primary px-6 py-3 rounded-xl font-semibold shadow-md">Send Another Message</button></div>
            ) : (<>
              <h2 className="text-xl font-extrabold text-slate-900 heading-font mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[{ label: "Your Name *", field: "name", placeholder: "Priya Sharma", type: "text" }, { label: "Email Address *", field: "email", placeholder: "priya@email.com", type: "email" }].map(({ label, field, placeholder, type }) => (
                    <div key={field}><label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label><input type={type} placeholder={placeholder} value={form[field as keyof typeof form]} onChange={set(field)} className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all text-slate-700 ${errors[field] ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-400"}`} />{errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}</div>
                  ))}
                </div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Subject *</label><input type="text" placeholder="What is this about?" value={form.subject} onChange={set("subject")} className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all text-slate-700 ${errors.subject ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-400"}`} />{errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}</div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Message *</label><textarea placeholder="Tell us what you need help with, or share your feedback..." value={form.message} onChange={set("message")} rows={5} className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all resize-none text-slate-700 ${errors.message ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-400"}`} />{errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}</div>
                <button type="submit" disabled={loading} className="btn-primary px-8 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-60"><Send size={16} />{loading ? "Sending..." : "Send Message"}</button>
              </form>
            </>)}
          </div>
        </div>
      </div>
    </div>
  );
}
