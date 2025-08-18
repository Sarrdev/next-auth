"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import Cookies from "js-cookie";

export default function Topbar() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    router.replace("/login");
  };

  return (
    <header className="h-14 bg-white shadow flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="font-semibold text-gray-700">👋 Bienvenue Admin</div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
      >
        <LogOut className="w-4 h-4" /> Déconnexion
      </button>
    </header>
  );
}
