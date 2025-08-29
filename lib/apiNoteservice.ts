import axios from "axios";
import { getToken } from "./auth";
 const token = getToken();

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type NoteService = {
  id: number;
  titre: string;
  contenu?: string | null;
  date_publication: string; // ISO date
  auteur?: string | null;
  fichier?: string | null;
  created_at?: string;
  updated_at?: string;
};

// 📌 Liste des notes de services
export async function listNoteService(): Promise<NoteService[]> {
  const token = getToken();
  if (!token) throw new Error("Token non trouvé, veuillez vous connecter.");

  const res = await axios.get(`${BASE_URL}/auth/note-services`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    withCredentials: true,
  });

  return res.data.data;
}

// 📌 Créer un note de service
export async function createNoteService(
  payload: FormData
): Promise<NoteService> {
  const token = getToken();
  if (!token) throw new Error("Token non trouvé, veuillez vous connecter.");

  const res = await axios.post(`${BASE_URL}/auth/note-service`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      // ❌ Ne PAS mettre Content-Type ici pour FormData
    },
    withCredentials: true, // si tu utilises Sanctum
  });

  return res.data.data;
}

// 📌 Récupérer un note de service par ID
export async function getNoteService(id: number): Promise<NoteService> {
  const token = getToken();
  if (!token) throw new Error("Token non trouvé, veuillez vous connecter.");

  const res = await axios.get(`${BASE_URL}/auth/note-service/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    withCredentials: true,
  });

  return res.data.data;
}

// 📌 Modifier un note de service
export async function editNoteService(
  id: number,
  payload: FormData
): Promise<NoteService> {
  const token = getToken();
  if (!token) throw new Error("Token non trouvé, veuillez vous connecter.");

  // Ajoute _method=PUT dans le FormData
  payload.append("_method", "PUT");

  const res = await axios.post(`${BASE_URL}/auth/note-service/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "multipart/form-data", // axios le gère
    },
    withCredentials: true,
  });

  return res.data.data;
}



// 📌 Supprimer un note de service
export async function deleteNoteService(id: number): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("Token non trouvé, veuillez vous connecter.");

  await axios.delete(`${BASE_URL}/auth/note-service/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    withCredentials: true,
  });
}
