import axios from "axios";
import { getToken } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type BoiteIdee = {
  id: number;
  nom_complet?: string | null;
  idee: string;
  statut?: "soumis" | "recu";
  created_at?: string;
  updated_at?: string;
};

// 📌 Helper headers
function authHeaders() {
  const token = getToken();
  if (!token) throw new Error("Token non trouvé, veuillez vous connecter.");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

/* ========================
   ADMIN + USER ENDPOINTS
======================== */

// 📌 Lister toutes les idées (admin)
export async function listBoiteIdees(): Promise<BoiteIdee[]> {
  const res = await axios.get(`${BASE_URL}/auth/boite-idees`, {
    headers: authHeaders(),
    withCredentials: true,
  });
  return res.data.data;
}

// 📌 Lister MES idées (utilisateur connecté)
export async function listMesIdees(): Promise<BoiteIdee[]> {
  const res = await axios.get(`${BASE_URL}/auth/boite-idees/mes-idees`, {
    headers: authHeaders(),
    withCredentials: true,
  });
  return res.data.data;
}

// 📌 Créer une nouvelle idée
export async function createBoiteIdee(
  payload: Omit<BoiteIdee, "id" | "created_at" | "updated_at">
): Promise<BoiteIdee> {
  const res = await axios.post(`${BASE_URL}/auth/boite-idees`, payload, {
    headers: authHeaders(),
    withCredentials: true,
  });
  return res.data.data;
}

// 📌 Récupérer une idée par ID
export async function getBoiteIdee(id: number): Promise<BoiteIdee> {
  const res = await axios.get(`${BASE_URL}/auth/boite-idees/${id}`, {
    headers: authHeaders(),
    withCredentials: true,
  });
  return res.data.data;
}

// 📌 Modifier une idée
export async function editBoiteIdee(
  id: number,
  payload: Partial<Omit<BoiteIdee, "id" | "created_at" | "updated_at">>
): Promise<BoiteIdee> {
  const res = await axios.put(`${BASE_URL}/auth/boite-idees/${id}`, payload, {
    headers: authHeaders(),
    withCredentials: true,
  });
  return res.data.data;
}

// 📌 Supprimer une idée
export async function deleteBoiteIdee(id: number) {
  const res = await axios.delete(`${BASE_URL}/auth/boite-idees/${id}`, {
    headers: authHeaders(),
    withCredentials: true,
  });
  return res.data;
}

// 📌 Mettre à jour le statut (soumis → recu) [ADMIN]
export async function updateStatutBoiteIdee(
  id: number,
  statut: "soumis" | "recu"
): Promise<BoiteIdee> {
  const res = await axios.patch(
    `${BASE_URL}/auth/boite-idees/${id}/statut`,
    { statut },
    { headers: authHeaders(), withCredentials: true }
  );
  return res.data.data;
}
