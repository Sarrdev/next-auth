"use client";
import Sidebar from "@/app/components/admin/Sidebar";
import Topbar from "@/app/components/admin/Topbar";
import AdminGuard from "@/lib/AdminGuard";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Barre verticale */}
      <Sidebar />

      {/* Zone principale */}
      <div className="flex flex-col flex-1">
        {/* Barre horizontale */}
        <Topbar />

        {/* Contenu */}
        <main className="flex-1 p-6 overflow-y-auto"><AdminGuard>{children}</AdminGuard></main>
      </div>
    </div>
  );
}
