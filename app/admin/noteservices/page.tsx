"use client";

import { useEffect, useMemo, useState } from "react";
import {
  listNoteService,
  createNoteService,
  editNoteService,
  deleteNoteService,
} from "@/lib/apiNoteservice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  User,
  FileText,
  AlertCircle,
  RefreshCcw,
  PlusCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

type NoteService = {
  id: string | number;
  titre?: string;
  contenu?: string | null;
  date_publication?: string | Date;
  auteur?: string | null;
  fichier?: string | null; // chemin relatif ex: "proces_verbaux/xxx.pdf"
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

export default function AdminNoteService() {
  const [items, setItems] = useState<NoteService[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<NoteService | null>(null);

  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [date, setDate] = useState("");
  const [auteur, setAuteur] = useState("");
  const [fichier, setFichier] = useState<File | null>(null);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await listNoteService();
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

  const resetForm = () => {
    setTitre("");
    setContenu("");
    setDate("");
    setAuteur("");
    setFichier(null);
  };

  const handleCreate = async () => {
    if (!titre || !contenu || !date) {
      alert("Veuillez remplir tous les champs obligatoires !");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("titre", titre);
      formData.append("contenu", contenu);
      formData.append("date_publication", date);
      if (auteur) formData.append("auteur", auteur);
      if (fichier) formData.append("fichier", fichier);

      await createNoteService(formData);
      setOpen(false);
      resetForm();
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur de création");
    }
  };

  const handleEdit = (item: NoteService) => {
    setEditItem(item);
    setTitre(item.titre ?? "");
    setContenu(item.contenu ?? "");
    setDate(
      item.date_publication
        ? new Date(item.date_publication).toISOString().slice(0, 16)
        : ""
    );
    setAuteur(item.auteur ?? "");
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editItem) return;
    try {
      const formData = new FormData();
      formData.append("titre", titre);
      formData.append("contenu", contenu);
      formData.append("date_publication", date);
      if (auteur) formData.append("auteur", auteur);
      if (fichier) formData.append("fichier", fichier);

      await editNoteService(Number(editItem.id), formData);
      setEditOpen(false);
      resetForm();
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur de mise à jour");
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm("Supprimer ce note de service ?")) return;
    try {
      await deleteNoteService(Number(id));
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur lors de la suppression");
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Notes de services
          </h1>
          <p className="text-muted-foreground text-sm">
            Liste des notes de services publiées
          </p>
        </div>
        <div className="flex gap-2">
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

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 cursor-pointer">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nouvelle note de service
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
                    ✨ Publier une note de service
                  </DialogTitle>
                </DialogHeader>
                <FormNoteService
                  titre={titre}
                  setTitre={setTitre}
                  date={date}
                  setDate={setDate}
                  contenu={contenu}
                  setContenu={setContenu}
                  auteur={auteur}
                  setAuteur={setAuteur}
                  fichier={fichier}
                  setFichier={setFichier}
                />
                <div className="flex justify-end gap-2 pt-6">
                  <Button
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="cursor-pointer"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleCreate}
                    className="bg-green-600 cursor-pointer"
                  >
                    Créer
                  </Button>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
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
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border bg-white p-5 shadow-sm animate-pulse"
            >
              <div className="h-6 w-2/3 bg-slate-200 rounded mb-4" />
              <div className="space-y-2">
                <div className="h-4 w-5/6 bg-slate-200 rounded" />
                <div className="h-4 w-4/6 bg-slate-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Aucune note de service trouvé.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <Card
              key={p.id}
              className="rounded-2xl shadow-sm hover:shadow-md transition"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{p.titre}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CalendarDays className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Date de publication</div>
                    <div className="text-muted-foreground">
                      {formatDate(p.date_publication)}
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
                      <div className="font-medium">Contenue</div>
                      <div className="text-muted-foreground">{p.contenu}</div>
                    </div>
                  </div>
                )}

                {p.fichier && (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition">
                    <FileText className="h-5 w-5 text-red-600" />
                    <a
                      href={`${API_URL}/storage/${p.fichier}`} // ✅ enlève "api/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 underline"
                    >
                    Télécharger la note de service (PDF)
                    </a>
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleEdit(p)}
                    className="cursor-pointer"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDelete(p.id)}
                    className="cursor-pointer"
                  >
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
                ✏️ Modifier la note de service
              </DialogTitle>
            </DialogHeader>
            <FormNoteService
              titre={titre}
              setTitre={setTitre}
              date={date}
              setDate={setDate}
              contenu={contenu}
              setContenu={setContenu}
              auteur={auteur}
              setAuteur={setAuteur}
              fichier={fichier}
              setFichier={setFichier}
            />
            <div className="flex justify-end gap-2 pt-6">
              <Button
                variant="outline"
                onClick={() => setEditOpen(false)}
                className="cursor-pointer"
              >
                Annuler
              </Button>
              <Button
                onClick={handleUpdate}
                className="bg-green-600 cursor-pointer"
              >
                Enregistrer
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* Formulaire réutilisable */
function FormNoteService({
  titre,
  setTitre,
  date,
  setDate,
  contenu,
  setContenu,
  auteur,
  setAuteur,
  fichier,
  setFichier,
}: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Titre</Label>
        <Input
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          placeholder="Ex: Note de service sur les congés annuels"
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
        <Label>Auteur</Label>
        <Input
          value={auteur}
          onChange={(e) => setAuteur(e.target.value)}
          placeholder="Ex: Secrétaire général"
        />
      </div>
      <div className="sm:col-span-2 space-y-2">
        <Label>Contenu</Label>
        <Textarea
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          placeholder="Ex: Cette note de service a pour but de..."
        />
      </div>
      <div className="sm:col-span-2 space-y-2">
        <Label>Fichier PDF (optionnel)</Label>
        <Input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFichier(e.target.files?.[0] ?? null)}
        />
      </div>
    </div>
  );
}
