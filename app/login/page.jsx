"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await login(email, password);
      Cookies.set("token", res.token);
      Cookies.set("role", res.user.role);

      if (res.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/user");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form 
        onSubmit={handleLogin} 
        className="bg-white p-8 rounded-2xl shadow-lg space-y-6 w-96"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800">Connexion</h1>

        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <div className="flex items-center border rounded-md overflow-hidden">
            <span className="p-2 bg-gray-100">
              <Mail className="w-5 h-5 text-gray-500" />
            </span>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-none flex-1 focus:ring-0"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Mot de passe</Label>
          <div className="flex items-center border rounded-md overflow-hidden">
            <span className="p-2 bg-gray-100">
              <Lock className="w-5 h-5 text-gray-500" />
            </span>
            <Input
              id="password"
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-none flex-1 focus:ring-0"
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
          Se connecter
        </Button>
      </form>
    </div>
  );
}
