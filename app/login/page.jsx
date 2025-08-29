"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await login(email, password);
      Cookies.set("token", res.access_token);
      Cookies.set("role", res.user.role);

      if (res.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-emerald-500 to-teal-400 px-4">
      <div className="bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Logo + Titre */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/img.jpg"
            alt="Logo SGF"
            width={70}
            height={70}
            className="rounded-full shadow-md"
          />
          <h1 className="text-2xl font-bold text-gray-800 mt-4">SGF - Connexion</h1>
          <p className="text-gray-500 text-sm mt-1">Accédez à votre espace</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <div className="flex items-center border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-green-500">
              <span className="p-2 bg-gray-100">
                <Mail className="w-5 h-5 text-gray-500" />
              </span>
              <Input
                id="email"
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-none flex-1 focus:ring-0"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="flex items-center border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-green-500">
              <span className="p-2 bg-gray-100">
                <Lock className="w-5 h-5 text-gray-500" />
              </span>
              <Input
                id="password"
                type="password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-none flex-1 focus:ring-0"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 cursor-pointer rounded-md transition"
          >
            Se connecter
          </Button>
        </form>

        {/* Footer */}
        <p className="text-xs text-center text-gray-500 mt-6">
          © {new Date().getFullYear()} SGF - Tous droits réservés
        </p>
      </div>
    </div>
  );
}
