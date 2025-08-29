"use client";

import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord Admin</h1>
      <p className="mb-6">Bienvenue sur le tableau de bord administrateur.</p>

      {/* Carte Boîte à Idées */}
      <Link href="/admin/boite-idees">
        <div className="cursor-pointer group">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
            <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
              📦 Boîte à Idées
            </h2>
            <p className="text-gray-600">
              Consultez et gérez les idées envoyées par les utilisateurs.
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
