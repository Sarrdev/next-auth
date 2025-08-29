"use client";

import { useEffect, useMemo, useState } from "react";
import { listConvocations, createConvocation, editConvocation } from "@/lib/apiConvocation";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CalendarDays,
  MapPin,
  Clock,
  AlertCircle,
  RefreshCcw,
  PlusCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function AdminConvocationsPage() {
  const [items, setItems] = useState<Convocation[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // popup création
  const [open, setOpen] = useState(false);

  // popup édition
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<Convocation | null>(null);

  // champs du formulaire
  const [titre, setTitre] = useState("");
  const [lieu, setLieu] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [statut, setStatut] = useState<"planifiée" | "reportée" | "annulée">(
    "planifiée"
  );

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await listConvocations();
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
      (c) =>
        c.titre?.toLowerCase().includes(s) ||
        c.lieu?.toLowerCase().includes(s) ||
        c.description?.toLowerCase().includes(s) ||
        c.statut?.toLowerCase().includes(s)
    );
  }, [q, items]);

  const resetForm = () => {
    setTitre("");
    setLieu("");
    setDate("");
    setDescription("");
    setStatut("planifiée");
  };

  const handleCreate = async () => {
    try {
      await createConvocation({
        titre,
        lieu,
        date_reunion: date,
        description,
        statut,
      });
      setOpen(false);
      resetForm();
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur de création");
    }
  };

  const handleEdit = (item: Convocation) => {
    setEditItem(item);
    setTitre(item.titre ?? "");
    setLieu(item.lieu ?? "");
    setDate(
      item.date_reunion
        ? new Date(item.date_reunion).toISOString().slice(0, 16)
        : ""
    );
    setDescription(item.description ?? "");
    setStatut((item.statut as "planifiée" | "reportée" | "annulée") ?? "planifiée");
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editItem) return;
    try {
      await editConvocation(Number(editItem.id), {
        titre,
        lieu,
        date_reunion: date,
        description,
        statut,
      });
      setEditOpen(false);
      resetForm();
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur de mise à jour");
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Convocations</h1>
          <p className="text-muted-foreground text-sm">
            Liste des réunions planifiées, reportées ou annulées.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} disabled={loading} className="cursor-pointer">
            <RefreshCcw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Actualiser
          </Button>

          {/* Popup nouvelle convocation */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 cursor-pointer">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nouvelle convocation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl w-[95vw] rounded-2xl p-0 overflow-hidden">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="p-6 bg-white"
              >
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold mb-4">
                    ✨ Créer une convocation
                  </DialogTitle>
                </DialogHeader>
                <FormConvocation
                  titre={titre}
                  setTitre={setTitre}
                  date={date}
                  setDate={setDate}
                  lieu={lieu}
                  setLieu={setLieu}
                  statut={statut}
                  setStatut={setStatut}
                  description={description}
                  setDescription={setDescription}
                />
                <div className="flex justify-end gap-2 pt-6">
                  <Button variant="outline" onClick={() => setOpen(false)} className="cursor-pointer">
                    Annuler
                  </Button>
                  <Button onClick={handleCreate} className="bg-green-600 cursor-pointer">
                    Créer
                  </Button>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="flex items-center gap-3">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher par titre, lieu, statut..."
          className="max-w-md"
        />
      </div>

      {/* États : erreur / chargement / vide */}
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
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border bg-white p-5 shadow-sm animate-pulse"
            >
              <div className="h-6 w-2/3 bg-slate-200 rounded mb-4" />
              <div className="space-y-2">
                <div className="h-4 w-5/6 bg-slate-200 rounded" />
                <div className="h-4 w-4/6 bg-slate-200 rounded" />
                <div className="h-4 w-3/6 bg-slate-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Aucune convocation trouvée.
          </CardContent>
        </Card>
      ) : (
        // Grille responsive
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <Card
              key={c.id}
              className="rounded-2xl shadow-sm hover:shadow-md transition"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-lg">{c.titre}</CardTitle>
                  <Badge
                    className={statutBadge(c.statut ?? "")}
                    variant="secondary"
                  >
                    {c.statut ?? "–"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CalendarDays className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div className="leading-5">
                    <div className="font-medium">Date & heure</div>
                    <div className="text-muted-foreground">
                      {formatDate(c.date_reunion)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div className="leading-5">
                    <div className="font-medium">Lieu</div>
                    <div className="text-muted-foreground">{c.lieu}</div>
                  </div>
                </div>

                {c.description ? (
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div className="leading-5">
                      <div className="font-medium">Description</div>
                      <div className="text-muted-foreground">
                        {c.description}
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="pt-2 flex justify-end gap-2">
                  <Button size="icon" variant="outline" onClick={() => handleEdit(c)} className="cursor-pointer">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" className="cursor-pointer">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Popup édition */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-2xl w-[95vw] rounded-2xl p-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="p-6 bg-white"
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold mb-4">
                ✏️ Modifier la convocation
              </DialogTitle>
            </DialogHeader>
            <FormConvocation
              titre={titre}
              setTitre={setTitre}
              date={date}
              setDate={setDate}
              lieu={lieu}
              setLieu={setLieu}
              statut={statut}
              setStatut={setStatut}
              description={description}
              setDescription={setDescription}
            />
            <div className="flex justify-end gap-2 pt-6">
              <Button variant="outline" onClick={() => setEditOpen(false)} className="cursor-pointer">
                Annuler
              </Button>
              <Button onClick={handleUpdate} className="bg-green-600 cursor-pointer">
                Enregistrer
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ✅ Petit composant réutilisable pour formulaire convocation */
function FormConvocation({
  titre,
  setTitre,
  date,
  setDate,
  lieu,
  setLieu,
  statut,
  setStatut,
  description,
  setDescription,
}: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Titre</Label>
        <Input
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          placeholder="Ex: Réunion annuelle"
        />
      </div>
      <div className="space-y-2">
        <Label>Date & heure</Label>
        <Input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Lieu</Label>
        <Input
          value={lieu}
          onChange={(e) => setLieu(e.target.value)}
          placeholder="Ex: Salle de conférence A"
        />
      </div>
      <div className="space-y-2">
        <Label>Statut</Label>
        <Select
          value={statut}
          onValueChange={(v) =>
            setStatut(v as "planifiée" | "reportée" | "annulée")
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Choisir un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="planifiée">Planifiée</SelectItem>
            <SelectItem value="reportée">Reportée</SelectItem>
            <SelectItem value="annulée">Annulée</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="sm:col-span-2 space-y-2">
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Ordre du jour, points à discuter..."
        />
      </div>
    </div>
  );
}
