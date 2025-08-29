"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ClipboardList, FileSignature, MessageSquare } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthUser } from "@/hooks/useAuthUser";

export default function UserDashboard() {
  const user = useAuthUser();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      const alreadyShown = localStorage.getItem("welcomeShown");

      if (!alreadyShown) {
        setShowWelcome(true);
        localStorage.setItem("welcomeShown", "true");
      }
    }
  }, [user]);

  const links = [
    {
      title: "Convocations",
      icon: <ClipboardList className="h-10 w-10 text-indigo-500" />,
      href: "/user/convocations",
      description: "Consultez vos convocations récentes.",
    },
    {
      title: "Procès Verbaux",
      icon: <FileSignature className="h-10 w-10 text-green-500" />,
      href: "/user/proces-verbaux",
      description: "Accédez aux procès-verbaux disponibles.",
    },
    {
      title: "Notes de Service",
      icon: <FileText className="h-10 w-10 text-orange-500" />,
      href: "/user/notes-de-service",
      description: "Lisez les notes de service publiées.",
    },
    {
      title: "Mes idées",
      icon: <MessageSquare className="h-10 w-10 text-orange-500" />,
      href: "/user/boite-idees",
      description: "Gestionnez vos idées ou inquietudes soumise.",
    },
  ];

  return (
    <div className="p-6">
      {showWelcome && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-xl shadow">
          Bienvenue {user?.nom} 🎉
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {links.map((item, index) => (
          <Link key={index} href={item.href}>
            <Card className="group cursor-pointer transition-all hover:shadow-lg hover:scale-105">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <CardTitle className="text-lg font-semibold">
                    {item.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 group-hover:text-gray-800">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
