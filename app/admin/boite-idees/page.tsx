"use client";

import { useEffect, useState } from "react";
import {
  listBoiteIdees,
  BoiteIdee,
  updateStatutBoiteIdee,
} from "@/lib/apiBoiteIdee";
import { Button } from "@/components/ui/button";
import { Loader2, Check, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminBoiteIdeesPage() {
  const [idees, setIdees] = useState<BoiteIdee[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const fetchIdees = async () => {
    try {
      setLoading(true);
      const data = await listBoiteIdees();
      setIdees(data);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors du chargement des idées");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatut = async (id: number, statut: "soumis" | "recu") => {
    try {
      setUpdatingId(id);
      const updated = await updateStatutBoiteIdee(id, statut);
      setIdees((prev) => prev.map((idee) => (idee.id === id ? updated : idee)));
      toast.success(`Statut mis à jour en "${statut}"`);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour du statut");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleFlip = (id: number) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id); // Si déjà retournée → on la remet normale
      } else {
        newSet.add(id); // Sinon → on la retourne
      }
      return newSet;
    });
  };

  useEffect(() => {
    fetchIdees();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="w-8 h-8 text-yellow-500" />
          <div>
            <h1 className="text-2xl font-bold">
              Boîte à Idées - Administration
            </h1>
            <p className="text-sm text-gray-500">
              Gestion des suggestions et suivi des statuts
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="perspective cursor-pointer">
              <div className="relative w-full h-48 animate-pulse">
                <div className="absolute w-full h-full bg-white border rounded-lg shadow-lg flex items-center justify-center">
                  <Skeleton className="h-6 w-32 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="w-8 h-8 text-yellow-500" />
        <div>
          <h1 className="text-2xl font-bold">Boîte à Idées - Administration</h1>
          <p className="text-sm text-gray-500">
            Consultez, validez et suivez les suggestions des employés
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {idees.map((idee) => (
          <div
            key={idee.id}
            className="perspective cursor-pointer"
            onClick={() => toggleFlip(idee.id)}
          >
            <div className="relative w-full h-60">
              <div
                className={`absolute inset-0 transition-transform duration-700 [transform-style:preserve-3d] ${
                  flippedCards.has(idee.id) ? "[transform:rotateY(180deg)]" : ""
                }`}
              >
                {/* Face avant */}
                <div className="absolute inset-0 bg-white border rounded-lg shadow-lg flex items-center justify-center p-4 [backface-visibility:hidden]">
                  <h2 className="text-xl font-bold text-center break-words">
                    {idee.nom_complet || "Anonyme"}
                  </h2>
                </div>

                {/* Face arrière */}
                <div className="absolute inset-0 bg-gray-100 border rounded-lg shadow-lg p-4 flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <p className="mb-4 break-words">{idee.idee}</p>
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
                    {idee.statut === "soumis" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation(); // évite que le clic retourne aussi la carte
                          handleUpdateStatut(idee.id, "recu");
                        }}
                        disabled={updatingId === idee.id}
                        className="cursor-pointer"
                      >
                        {updatingId === idee.id ? (
                          <Loader2 className="animate-spin w-4 h-4 mr-2" />
                        ) : (
                          <Check className="w-4 h-4 mr-2" />
                        )}
                        Reçu
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
