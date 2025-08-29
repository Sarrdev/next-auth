"use client";

import { useEffect, useMemo, useState } from "react";
import { listConvocations } from "@/lib/apiConvocation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CalendarDays,
  MapPin,
  Clock,
  ArrowLeft,
  RefreshCcw,
  AlertCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type Convocation = {
  id: string | number;
  titre?: string;
  lieu?: string;
  description?: string | null;
  statut?: string;
  date_reunion?: string | Date;
};

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

function statutBadge(statut: string) {
  switch (statut) {
    case "planifiée":
      return "bg-emerald-100 text-emerald-700";
    case "reportée":
      return "bg-amber-100 text-amber-700";
    case "annulée":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function UserConvocationsPage() {
  const [items, setItems] = useState<Convocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const router = useRouter();

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await listConvocations();
      setItems(data);
    } catch (e) {
      setErr("Erreur lors du chargement des convocations");
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
      (c) =>
        c.titre?.toLowerCase().includes(s) ||
        c.lieu?.toLowerCase().includes(s) ||
        c.description?.toLowerCase().includes(s) ||
        c.statut?.toLowerCase().includes(s)
    );
  }, [q, items]);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mes Convocations</h1>
          <p className="text-muted-foreground text-sm">
            Retrouvez toutes vos convocations planifiées.
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
          placeholder="Rechercher par titre, lieu, statut..."
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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="rounded-2xl p-5 h-full flex flex-col">
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
            Aucune convocation trouvée.
          </CardContent>
        </Card>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch"
        >
          {filtered.map((c) => (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Card className="h-full flex flex-col rounded-2xl shadow-sm hover:shadow-md transition bg-white/80 backdrop-blur">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg font-semibold">{c.titre}</CardTitle>
                    <Badge className={statutBadge(c.statut ?? "")}>
                      {c.statut ?? "–"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm flex-1">
                  <div className="flex items-start gap-2">
                    <CalendarDays className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Date & heure</div>
                      <div className="text-muted-foreground">
                        {formatDate(c.date_reunion)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Lieu</div>
                      <div className="text-muted-foreground">{c.lieu}</div>
                    </div>
                  </div>

                  {c.description && (
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Description</div>
                        <div className="text-muted-foreground line-clamp-3">
                          {c.description}
                        </div>
                      </div>
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
