"use client";

import Link from "next/link";
import { LayoutDashboard, Users, Settings, X } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Bouton mobile */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-green-600 text-white rounded-md shadow-md"
      >
        ☰
      </button>

      {/* Overlay noir semi-transparent (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-green-700 to-green-500 text-white shadow-xl transform transition-transform duration-300 z-50
          ${open ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <span className="text-2xl font-bold">Admin Panel</span>
          <button
            className="lg:hidden p-2 hover:bg-white/20 rounded-md"
            onClick={() => setOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 p-2 rounded-md hover:bg-white/20 transition"
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-3 p-2 rounded-md hover:bg-white/20 transition"
          >
            <Users className="w-5 h-5" /> Utilisateurs
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 p-2 rounded-md hover:bg-white/20 transition"
          >
            <Settings className="w-5 h-5" /> Paramètres
          </Link>
        </nav>
      </aside>
    </>
  );
}
