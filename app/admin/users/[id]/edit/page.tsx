"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { editUser, getUser } from "@/lib/apiUser";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Loader2,
  Shield,
  User,
  Mail,
  Phone,
  BadgeCheck,
  Briefcase,
  KeyRound,
} from "lucide-react";

type FormState = {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  matricule: string;
  fonction: string;
  role: string;
  password?: string;
};

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const userId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    matricule: "",
    fonction: "",
    role: "user",
    password: "",
  });

  // Charger l'utilisateur existant
useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await getUser(userId);
      
      // Vérifie si la réponse contient l'utilisateur
      const u = response?.data ?? response; // adapte selon la structure de ton API
      if (!u) {
        throw new Error("Utilisateur introuvable.");
      }

      // Met à jour le formulaire avec sécurité
      setForm({
        nom: u.nom ?? "",
        prenom: u.prenom ?? "",
        email: u.email ?? "",
        telephone: u.telephone ?? "",
        matricule: u.matricule ?? "",
        fonction: u.fonction ?? "",
        role: u.role ?? "user",
        password: "",
      });
    } catch (e: any) {
      console.error("Erreur fetchUser:", e);
      toast.error(e?.message || "Impossible de charger l’utilisateur.");
      router.push("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  if (!isNaN(userId)) {
    fetchUser();
  } else {
    toast.error("ID utilisateur invalide.");
    router.push("/admin/users");
    setLoading(false);
  }
}, [userId, router]);


  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((f) => ({ ...f, [id]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Partial<FormState> = {
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        telephone: form.telephone,
        matricule: form.matricule,
        fonction: form.fonction,
        role: form.role,
      };
      if (form.password && form.password.trim()) {
        payload.password = form.password.trim();
      }

      await editUser(userId, payload);
      toast.success("✅ Utilisateur modifié avec succès !");
      router.push("/admin/users");
    } catch (err: any) {
      toast.error(err?.message || "❌ Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="h-10 w-48 bg-muted rounded-md animate-pulse mb-4" />
        <Card className="shadow-sm">
          <CardHeader>
            <div className="h-6 w-64 bg-muted rounded-md animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded-md animate-pulse" />
                  <div className="h-10 w-full bg-muted rounded-md animate-pulse" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header + Back */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/users"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour à la liste
        </Link>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Modifier l’utilisateur
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Mettez à jour les informations puis enregistrez.
          </p>
        </CardHeader>
        <Separator />
        <CardContent>
          <form onSubmit={onSubmit} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Nom */}
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="nom" value={form.nom} onChange={onChange} className="pl-9" required />
                </div>
              </div>

              {/* Prénom */}
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="prenom" value={form.prenom} onChange={onChange} className="pl-9" required />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" value={form.email} onChange={onChange} className="pl-9" required />
                </div>
              </div>

              {/* Téléphone */}
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="telephone" value={form.telephone} onChange={onChange} className="pl-9" />
                </div>
              </div>

              {/* Matricule */}
              <div className="space-y-2">
                <Label htmlFor="matricule">Matricule</Label>
                <div className="relative">
                  <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="matricule" value={form.matricule} onChange={onChange} className="pl-9" />
                </div>
              </div>

              {/* Fonction */}
              <div className="space-y-2">
                <Label htmlFor="fonction">Fonction</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="fonction" value={form.fonction} onChange={onChange} className="pl-9" />
                </div>
              </div>

              {/* Rôle */}
              <div className="space-y-2">
                <Label>Rôle</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Select
                    value={form.role}
                    onValueChange={(v) => setForm((f) => ({ ...f, role: v }))}
                  >
                    <SelectTrigger className="pl-9">
                      <SelectValue placeholder="Choisir un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Utilisateur</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="password">Nouveau mot de passe (optionnel)</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={onChange}
                    className="pl-9"
                    placeholder="Laissez vide pour ne pas changer"
                  />
                </div>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" className="cursor-pointer" onClick={() => router.back()}>
                Annuler
              </Button>
              <Button type="submit" disabled={saving} className="bg-green-600 hover:bg-green-700 text-white cursor-pointer">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement...
                  </>
                ) : (
                  "Enregistrer les modifications"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
