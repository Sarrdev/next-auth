"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, editUser } from "@/lib/apiUser";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, BadgeCheck, Briefcase, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface UserType {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  matricule: string;
  fonction: string;
  role: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    matricule: "",
    fonction: "",
    role: "",
    password: "",
  });

  const router = useRouter();

  // ✅ Charger l'utilisateur connecté
  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getCurrentUser();
        setUser(data);
        setForm({
          nom: data.nom || "",
          prenom: data.prenom || "",
          email: data.email || "",
          telephone: data.telephone || "",
          matricule: data.matricule || "",
          fonction: data.fonction || "",
          role: data.role || "",
          password: "",
        });
      } catch (error: any) {
        toast.error("Impossible de récupérer vos informations.");
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await editUser(user.id, {
        ...form,
        password: form.password || undefined,
      });
      toast.success("Profil mis à jour avec succès ✅");
      setForm({ ...form, password: "" });
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-full max-w-2xl space-y-6">
          <Skeleton className="h-10 w-40 mx-auto rounded-lg" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-10 w-32 mx-auto rounded-lg" />
        </div>
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-xl rounded-2xl border border-gray-100 bg-white/80 backdrop-blur">
          <CardHeader className="flex flex-col items-center gap-2">
            {/* ✅ Bouton retour aligné à gauche */}
            <div className="w-full flex">
              <Button
                onClick={() => router.back()}
                variant="ghost"
                className="flex items-center gap-2 text-green-600 hover:text-green-500 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 text-green-600" />
                Retour
              </Button>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              Mon Profil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Infos personnelles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    className="pl-10"
                    name="nom"
                    value={form.nom}
                    onChange={handleChange}
                    placeholder="Nom"
                    required
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    className="pl-10"
                    name="prenom"
                    value={form.prenom}
                    onChange={handleChange}
                    placeholder="Prénom"
                    required
                  />
                </div>
                <div className="relative sm:col-span-2">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    className="pl-10"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    className="pl-10"
                    name="telephone"
                    value={form.telephone}
                    onChange={handleChange}
                    placeholder="Téléphone"
                  />
                </div>
                <div className="relative">
                  <BadgeCheck className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    className="pl-10"
                    name="matricule"
                    value={form.matricule}
                    onChange={handleChange}
                    placeholder="Matricule"
                  />
                </div>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    className="pl-10"
                    name="fonction"
                    value={form.fonction}
                    onChange={handleChange}
                    placeholder="Fonction"
                  />
                </div>
                <div>
                  <Input
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    placeholder="Rôle"
                    disabled
                  />
                </div>
              </div>

              {/* Sécurité */}
              <div className="pt-4 border-t">
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  Sécurité
                </p>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    className="pl-10"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Nouveau mot de passe (optionnel)"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl shadow-md cursor-pointer"
                >
                  Mettre à jour
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
