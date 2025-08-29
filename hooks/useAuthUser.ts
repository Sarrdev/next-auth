"use client";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/apiUser";

export function useAuthUser() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (error) {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  return user;
}
