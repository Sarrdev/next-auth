"use client";

import UserGuard from "@/lib/UserGuard";
import Topbar from "../components/user/Topbar";
import { User, LogOut, MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { createBoiteIdee } from "@/lib/apiBoiteIdee"; // 📌 Ton API frontend
import { toast } from "sonner"; // pour feedback utilisateur

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [openIdeaBox, setOpenIdeaBox] = useState(false);
  const [idea, setIdea] = useState("");
  const [nomComplet, setNomComplet] = useState(""); // optionnel
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    router.replace("/login");
  };

  const handleProfile = () => {
    router.push("/user/profile");
  };

  const handleSubmitIdea = async () => {
    if (!idea.trim()) {
      toast.error("Veuillez entrer une idée avant d’envoyer.");
      return;
    }

    try {
      setLoading(true);

      await createBoiteIdee({
        idee: idea,
        nom_complet: nomComplet || null, // si vide => null
        statut: "soumis", // par défaut
      });

      toast.success("Votre suggestion a été envoyée avec succès 🎉");
      setIdea("");
      setNomComplet("");
      setOpenIdeaBox(false);
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue lors de l’envoi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserGuard>
      <Topbar />
      <main className="pt-20 px-6 bg-white min-h-screen">{children}</main>

      {/* Floating User Menu en bas à gauche */}
      <div className="fixed bottom-6 left-6 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              className="w-12 h-12 rounded-full shadow-lg bg-green-600 text-white hover:bg-gray-700 cursor-pointer"
            >
              <User className="w-6 h-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="start"
            className="w-52 rounded-xl shadow-lg"
          >
            <DropdownMenuItem
              onClick={handleProfile}
              className="cursor-pointer"
            >
              <User className="mr-2 h-4 w-4 text-green-600" /> Profil
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setOpenIdeaBox(true)}
              className="cursor-pointer"
            >
              <MessageSquare className="mr-2 h-4 w-4 text-green-600" /> Boîte à
              idées
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4 text-green-600" /> Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Popup Modal pour la Boîte à idées */}
      <Dialog open={openIdeaBox} onOpenChange={setOpenIdeaBox}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Boîte à idées 💡</DialogTitle>
          </DialogHeader>

          {/* Champ nom complet (optionnel) */}
          <Input
            type="text"
            placeholder="Votre nom complet (optionnel)"
            value={nomComplet}
            onChange={(e) => setNomComplet(e.target.value)}
            className="mb-3"
          />

          {/* Zone de texte */}
          <Textarea
            placeholder="Exprimez vos inquiétudes ou vos recommandations..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            className="min-h-[120px]"
          />

          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setOpenIdeaBox(false)}
              className="cursor-pointer"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmitIdea}
              disabled={loading}
              className="cursor-pointer"
            >
              {loading ? "Envoi..." : "Envoyer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </UserGuard>
  );
}
