"use client";

import { useEffect, useMemo, useState } from "react";
import { listProcesVerbaux } from "@/lib/apiProcesVerbal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CalendarDays, FileText, User, ArrowLeft, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type ProcesVerbal = {
  id: string | number;
  titre?: string;
  contenu?: string | null;
  date_reunion?: string | Date;
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
    }).format(new Date(d));
  } catch {
    return typeof d === "string" ? d : "–";
  }
}

export default function UserProcesVerbauxPage() {
  const [items, setItems] = useState<ProcesVerbal[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const router = useRouter();

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await listProcesVerbaux();
      setItems(data);
    } catch (e) {
      setErr(
        e instanceof Error
          ? e.message
          : typeof e === "string"
          ? e
          : "Erreur lors du chargement"
      );
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
      (p) =>
        p.titre?.toLowerCase().includes(s) ||
        p.contenu?.toLowerCase().includes(s) ||
        p.auteur?.toLowerCase().includes(s)
    );
  }, [q, items]);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Procès-verbaux</h1>
          <p className="text-muted-foreground text-sm">
            Consultez et téléchargez les procès-verbaux des réunions.
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
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border bg-white p-5 shadow-sm animate-pulse"
            >
              <div className="h-6 w-1/3 bg-slate-200 rounded mb-3" />
              <div className="h-4 w-2/3 bg-slate-200 rounded mb-2" />
              <div className="h-4 w-1/2 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Aucun procès-verbal trouvé.
          </CardContent>
        </Card>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {filtered.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{p.titre}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CalendarDays className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Réunion du</div>
                      <div className="text-muted-foreground">
                        {formatDate(p.date_reunion)}
                      </div>
                    </div>
                  </div>

                  {p.auteur && (
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Auteur</div>
                        <div className="text-muted-foreground">{p.auteur}</div>
                      </div>
                    </div>
                  )}

                  {p.contenu && (
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Compte rendu</div>
                        <div className="text-muted-foreground line-clamp-3">
                          {p.contenu}
                        </div>
                      </div>
                    </div>
                  )}

                  {p.fichier && (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition">
                      <FileText className="h-5 w-5 text-red-600" />
                      <a
                        href={`${API_URL}/storage/${p.fichier}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 underline"
                      >
                        Télécharger le procès-verbal (PDF)
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
