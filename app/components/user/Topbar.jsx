"use client";

import { Bell } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function Topbar() {
  const [notifications, setNotifications] = useState(3); // Exemple : 3 nouvelles infos

  return (
    <header className="fixed top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 z-50">
      <div
        className="flex items-center justify-between 
        px-4 sm:px-8 md:px-12 py-2 sm:py-3
        bg-white/30 backdrop-blur-md
        shadow-lg
        rounded-xl sm:rounded-2xl border border-white/20"
      >
        {/* Logo SGF */}
        <div className="flex items-center">
          <Image
            src="/img.jpg" // Ton logo dans public/
            alt="Logo SGF"
            width={32}
            height={32}
            className="object-contain sm:w-10 sm:h-10 rounded-full"
          />
        </div>

        {/* Icône Notifications */}
        <div className="relative">
          <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 cursor-pointer" />
          {notifications > 0 && (
            <span
              className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 
              bg-red-600 text-white text-[10px] sm:text-xs font-bold 
              px-1.5 sm:px-2 py-0.5 rounded-full shadow"
            >
              {notifications}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
