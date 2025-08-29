"use client";

import Link from "next/link";
import Image from "next/image"; // ✅ pour afficher ton logo optimisé
import {
  LayoutDashboard,
  Users,
  Settings,
  CalendarDays,
  FileText,
  ScrollText,
  User,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuthUser } from "@/hooks/useAuthUser";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const user = useAuthUser();

  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/convocations", label: "Convocations", icon: CalendarDays },
    { href: "/admin/proces-verbaux", label: "Procès-verbaux", icon: FileText },
    { href: "/admin/noteservices", label: "Notes de service", icon: ScrollText },
    { href: "/admin/users", label: "Utilisateurs", icon: Users },
    { href: "/admin/settings", label: "Paramètres", icon: Settings },
  ];

  return (
    <>
      {/* Bouton mobile */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-green-600 text-white rounded-md shadow-md"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay mobile */}
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
          {/* ✅ Logo + Texte */}
          <div className="flex items-center gap-2">
            <Image
              src="/img.jpg"
              alt="Logo SGF"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-xl font-bold">SGF Admin</span>
          </div>
          <button
            className="lg:hidden p-2 hover:bg-white/20 rounded-md"
            onClick={() => setOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-white/20 transition"
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer : User connecté */}
        {user && (
          <div className="absolute bottom-4 left-0 w-full px-4">
            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
              <User className="w-6 h-6 text-white" />
              <div>
                <p className="text-sm font-medium">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-xs text-white/70">{user?.role}</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
