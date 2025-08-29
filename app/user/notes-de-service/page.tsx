"use client";

import { useEffect, useMemo, useState } from "react";
import { listNoteService } from "@/lib/apiNoteservice";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  User,
  FileText,
  ArrowLeft,
  RefreshCcw,
  AlertCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type NoteService = {
  id: string | number;
  titre?: string;
  contenu?: string | null;
  date_publication?: string | Date;
  auteur?: string | null;
  fichier?: string | null;
};

const API_URL = "http://127.0.0.1:8000";

function formatDate(d: string | Date | undefined): string {
  if (!d) return "–";
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(d));
  } catch {
    return typeof d === "string" ? d : "–";
  }
}

export default function UserNotesServicePage() {
  const [items, setItems] = useState<NoteService[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const router = useRouter();

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await listNoteService();
      setItems(data);
    } catch (e) {
      setErr("Erreur lors du chargement des notes de service");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return items;
    const s = q.toLowerCase();
    return items.filter(
      (n) =>
        n.titre?.toLowerCase().includes(s) ||
        n.contenu?.toLowerCase().includes(s) ||
        n.auteur?.toLowerCase().includes(s)
    );
  }, [q, items]);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Notes de Service
          </h1>
          <p className="text-muted-foreground text-sm">
            Retrouvez toutes vos notes de service publiées.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/user/dashboard")}
            className="cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <Button
            variant="outline"
            onClick={load}
            disabled={loading}
            className="cursor-pointer"
          >
            <RefreshCcw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Recherche */}
      <div className="flex items-center gap-3">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher par titre, auteur, contenu..."
          className="max-w-md"
        />
      </div>

      {/* États */}
      {err && (
        <Card className="border-rose-200">
          <CardContent className="py-6 flex items-center gap-3 text-rose-700">
            <AlertCircle className="h-5 w-5" />
            <span>{err}</span>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="rounded-2xl p-5">
              <Skeleton className="h-6 w-2/3 mb-4 rounded" />
              <Skeleton className="h-4 w-5/6 mb-2 rounded" />
              <Skeleton className="h-4 w-4/6 mb-2 rounded" />
              <Skeleton className="h-4 w-3/6 rounded" />
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Aucune note de service trouvée.
          </CardContent>
        </Card>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {filtered.map((n) => (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="rounded-2xl shadow-sm hover:shadow-md transition bg-white/80 backdrop-blur h-full flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">
                    {n.titre}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CalendarDays className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Date de publication</div>
                        <div className="text-muted-foreground">
                          {formatDate(n.date_publication)}
                        </div>
                      </div>
                    </div>

                    {n.auteur && (
                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Auteur</div>
                          <div className="text-muted-foreground">{n.auteur}</div>
                        </div>
                      </div>
                    )}

                    {n.contenu && (
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Contenu</div>
                          <div className="text-muted-foreground line-clamp-3">
                            {n.contenu}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {n.fichier && (
                    <div className="mt-4 flex items-center gap-2 p-2 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition">
                      <FileText className="h-5 w-5 text-red-600" />
                      <a
                        href={`${API_URL}/storage/${n.fichier}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 underline"
                      >
                        Télécharger le PDF
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
