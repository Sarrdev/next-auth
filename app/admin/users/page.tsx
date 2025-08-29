"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash, Edit, Plus } from "lucide-react";
import { listUser } from "@/lib/apiUser";

interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  fonction: string;
  telephone: string;
  matricule: string;
  role: string;
}

export default function UsersPage() {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(utilisateurs.length / itemsPerPage);
  const paginatedUsers = utilisateurs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Récupère la liste des utilisateurs
  const fetchUsers = async () => {
    setLoading(true);
    setErrors(null);
    try {
      const data = await listUser();
      console.log("Utilisateurs récupérés:", data);
      setUtilisateurs(data);
    } catch (err: any) {
      setErrors(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Supprimer un utilisateur
  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
        { withCredentials: true } // pour Sanctum
      );
      setUtilisateurs((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          err.message ||
          "Erreur lors de la suppression"
      );
    }
  };

  return (
    <div className="p-6">
      {/* Header + bouton Ajouter */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Liste des utilisateurs</h1>
        <Link href="/admin/users/create">
          <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 cursor-pointer">
            <Plus className="w-4 h-4" /> Ajouter un utilisateur
          </Button>
        </Link>
      </div>

      {errors && <div className="mb-4 text-red-500">{errors}</div>}
      {loading ? (
        <div className="w-full">
          <div className="rounded-2xl border bg-white p-5 shadow-sm animate-pulse w-full">
            <div className="h-6 w-1/3 bg-slate-200 rounded mb-4" />
            <div className="space-y-2">
              <div className="h-4 w-5/6 bg-slate-200 rounded" />
              <div className="h-4 w-2/3 bg-slate-200 rounded" />
              <div className="h-4 w-1/2 bg-slate-200 rounded" />
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md border">
          <Table className="min-w-full">
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="font-semibold">Nom</TableHead>
                <TableHead className="font-semibold">Prénom</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Téléphone</TableHead>
                <TableHead className="font-semibold">Matricule</TableHead>
                <TableHead className="font-semibold">Fonction</TableHead>
                <TableHead className="font-semibold">Rôle</TableHead>
                <TableHead className="font-semibold text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell>{user.nom}</TableCell>
                  <TableCell>{user.prenom}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.telephone}</TableCell>
                  <TableCell>{user.matricule}</TableCell>
                  <TableCell>{user.fonction}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="flex gap-2 justify-center">
                    <Link href={`/admin/users/${user.id}/edit`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                      </Button>
                    </Link>

                    <Button
                      variant="destructive"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash className="w-4 h-4 mr-1" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            ← Précédent
          </Button>
          <span className="px-3">
            Page {page} sur {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            Suivant →
          </Button>
        </div>
      )}
    </div>
  );
}
