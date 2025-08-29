"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import Cookies from "js-cookie";
import { useAuthUser } from "@/hooks/useAuthUser";

export default function Topbar() {
  const router = useRouter();
  const user = useAuthUser();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    router.replace("/login");
  };

  return (
    <header className="h-14 bg-white shadow flex items-center justify-between px-6 sticky top-0 z-30">
      
      {/* Nom centré en mode mobile */}
      <div className="flex-1 flex justify-center md:justify-start">
        <span className="font-medium text-gray-700 truncate">
          {user?.prenom} {user?.nom}
        </span>
      </div>

      {/* Bouton Déconnexion */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Déconnexion
        </button>
      </div>
    </header>
  );
}
