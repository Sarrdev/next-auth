"use client";
import Sidebar from "@/app/components/admin/Sidebar";
import Topbar from "@/app/components/admin/Topbar";
import AdminGuard from "@/lib/AdminGuard";

export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      {/* Barre verticale */}
      <Sidebar />

      {/* Zone principale */}
      <div className="flex-1 lg:ml-64">
        {/* Barre horizontale */}
        <Topbar />

        {/* Contenu */}
        <main className="p-6 bg-gray-50 min-h-screen"><AdminGuard>{children}</AdminGuard></main>
      </div>
    </div>
  );
}