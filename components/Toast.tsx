"use client";

import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function ToastContainer() {
  const { toasts } = useApp();
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div key={toast.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl animate-scale-in min-w-[280px] max-w-sm ${toast.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : toast.type === "error" ? "bg-red-50 border border-red-200 text-red-800" : "bg-blue-50 border border-blue-200 text-blue-800"}`}>
          {toast.type === "success" ? <CheckCircle size={18} className="text-emerald-500 shrink-0" /> : toast.type === "error" ? <XCircle size={18} className="text-red-500 shrink-0" /> : <Info size={18} className="text-blue-500 shrink-0" />}
          <span className="text-sm font-medium flex-1">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
