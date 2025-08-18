"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    router.replace("/login");
  };

  return (
    <header className="bg-white shadow-md h-14 flex items-center justify-between px-4">
      <div className="font-semibold">Bienvenue Admin</div>
      <button
        onClick={handleLogout}
        className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Déconnexion
      </button>
    </header>
  );
}
