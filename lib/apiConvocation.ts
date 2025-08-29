import axios from "axios";
import { getToken } from "./auth"; // ta fonction pour récupérer le token depuis Cookies

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
 const token = getToken();

export type Convocation = {
  id: number;
  titre: string;
  description?: string | null;
  date_reunion: string; // ISO
  lieu: string;
  statut?: "planifiée" | "reportée" | "annulée";
  created_at?: string;
  updated_at?: string;
};

export async function listConvocations(): Promise<Convocation[]> {
  const token = getToken();
  if (!token) throw new Error("Token non trouvé, veuillez vous connecter.");

  const res = await axios.get(`${BASE_URL}/auth/convocations`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    withCredentials: true,
  });

  // backend renvoie { data: [...] }
  return res.data.data;
}

// 📌 Créer une nouvelle convocation
export async function createConvocation(payload: Omit<Convocation, "id" | "created_at" | "updated_at">): Promise<Convocation> {
  const token = getToken();
  if (!token) throw new Error("Token non trouvé, veuillez vous connecter.");

  const res = await axios.post(`${BASE_URL}/auth/create`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  // backend renvoie { data: {...} }
  return res.data.data;
}

// 📌 Récupérer une convocation par ID
export async function getConvocation(id: number): Promise<Convocation> {
  const token = getToken();
  if (!token) throw new Error("Token non trouvé, veuillez vous connecter.");

  const res = await axios.get(`${BASE_URL}/auth/convocations/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    withCredentials: true,
  });

  return res.data.data;
}

// 📌 Modifier une convocation
export async function editConvocation(
  id: number,
  payload: Partial<Omit<Convocation, "id" | "created_at" | "updated_at">>
): Promise<Convocation> {
  const token = getToken();
  if (!token) throw new Error("Token non trouvé, veuillez vous connecter.");

  const res = await axios.put(`${BASE_URL}/auth/convocations/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  return res.data.data;
}

