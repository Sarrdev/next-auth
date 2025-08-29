"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    const role = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role="))
      ?.split("=")[1];

    if (!token) {
      router.replace("/login"); // pas connecté → login
    } else if (role !== "user") {
      router.replace("/login"); // connecté mais pas user → redirection page d’accueil
    } else {
      setAuthorized(true); // user valide
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (!authorized) {
    return null; // évite de montrer le contenu avant redirection
  }

  return <>{children}</>;
}
