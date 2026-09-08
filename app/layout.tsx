import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastContainer from "@/components/Toast";

export const metadata: Metadata = {
  title: "StudyShare - Educational Resource Platform",
  description:
    "A platform for sharing and accessing educational study materials. Browse notes, papers, and guides for free.",
  keywords: ["study materials", "notes", "education", "BCA", "student resources"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <div className="min-h-screen flex flex-col bg-[#f8faff]">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <ToastContainer />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
