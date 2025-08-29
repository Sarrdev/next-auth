"use client";

import { useEffect, useState } from "react";
import {
  listMesIdees,
  BoiteIdee,
  editBoiteIdee,
  deleteBoiteIdee,
} from "@/lib/apiBoiteIdee";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2, Lightbulb, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function MesIdeesPage() {
  const [idees, setIdees] = useState<BoiteIdee[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [updating, setUpdating] = useState<number | null>(null);

  const router = useRouter();

  const fetchMesIdees = async () => {
    try {
      setLoading(true);
      const data = await listMesIdees();
      setIdees(data);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors du chargement de vos idées");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id: number) => {
    try {
      setUpdating(id);
      await editBoiteIdee(id, { idee: editValue });
      toast.success("Idée modifiée avec succès !");
      setEditingId(null);
      fetchMesIdees();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la modification");
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette idée ?")) return;
    try {
      setUpdating(id);
      await deleteBoiteIdee(id);
      toast.success("Idée supprimée avec succès !");
      setIdees((prev) => prev.filter((idee) => idee.id !== id));
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    fetchMesIdees();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="w-8 h-8 text-yellow-500" />
          <h1 className="text-2xl font-bold">Mes Idées</h1>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="w-8 h-8 text-yellow-500" />
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Mes Idées</h1>
          <p className="text-sm text-gray-500">
            Suivez l’évolution de vos suggestions et modifiez-les si besoin
          </p>
        </div>
      </div>

      {/* Bouton retour */}
      <Button
        variant="outline"
        className="mb-6 flex items-center gap-2 cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Button>

      {idees.length === 0 ? (
        <p className="text-gray-500">
          Vous n’avez soumis aucune idée pour l’instant.
        </p>
      ) : (
        <div className="space-y-4">
          {idees.map((idee) => (
            <div
              key={idee.id}
              className="border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-3"
            >
              {editingId === idee.id ? (
                <>
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleEdit(idee.id)}
                      disabled={updating === idee.id}
                      className="cursor-pointer text-white bg-green-600 hover:bg-green-700"
                    >
                      {updating === idee.id ? (
                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                      ) : (
                        "Enregistrer"
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(null)}
                      className="cursor-pointer"
                    >
                      Annuler
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-800 break-words">{idee.idee}</p>
                  <div className="flex justify-between items-center">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs ${
                        idee.statut === "soumis"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    >
                      {idee.statut}
                    </span>

                    {/* Boutons seulement si statut = soumis */}
                    {idee.statut === "soumis" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(idee.id);
                            setEditValue(idee.idee);
                          }}
                          className="cursor-pointer"
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(idee.id)}
                          disabled={updating === idee.id}
                          className="cursor-pointer"
                        >
                          {updating === idee.id ? (
                            <Loader2 className="animate-spin w-4 h-4 mr-2" />
                          ) : (
                            <Trash2 className="w-4 h-4 mr-1" />
                          )}
                          Supprimer
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
