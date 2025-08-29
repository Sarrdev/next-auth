import axios from "axios";
import { getToken } from "./auth";
 const token = getToken();

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type ProcesVerbal = {
  id: number;
  titre: string;
  contenu?: string | null;
  date_reunion: string; // ISO date
  auteur?: string | null;
  fichier?: string | null;
  created_at?: string;
  updated_at?: string;
};

// 📌 Liste des procès-verbaux
export async function listProcesVerbaux(): Promise<ProcesVerbal[]> {
  const token = getToken();
  if (!token) throw new Error("Token non trouvé, veuillez vous connecter.");

  const res = await axios.get(`${BASE_URL}/auth/proces-verbaux`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    withCredentials: true,
  });

  return res.data.data;
}

// 📌 Créer un procès-verbal
export async function createProcesVerbal(
  payload: FormData
): Promise<ProcesVerbal> {
  const token = getToken();
  if (!token) throw new Error("Token non trouvé, veuillez vous connecter.");

  console.log("📤 Payload FormData envoyé :");
  for (const pair of payload.entries()) {
    console.log(pair[0], pair[1]);
  }

  try {
    const res = await axios.post(`${BASE_URL}/auth/proces-verbal`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        // ❌ Ne PAS mettre Content-Type ici pour FormData
      },
      withCredentials: true, // si tu utilises Sanctum
    });

    console.log("✅ Réponse API :", res.data);

    return res.data.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("❌ Erreur Axios :", error.response?.data || error.message);
    } else {
      console.error("❌ Erreur inattendue :", error);
    }
    throw error;
  }
}


// 📌 Récupérer un procès-verbal par ID
export async function getProcesVerbal(id: number): Promise<ProcesVerbal> {
  const token = getToken();
  if (!token) throw new Error("Token non trouvé, veuillez vous connecter.");

  const res = await axios.get(`${BASE_URL}/auth/proces-verbaux/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    withCredentials: true,
  });

  return res.data.data;
}

// 📌 Modifier un procès-verbal
export async function editProcesVerbal(
  id: number,
  payload: FormData
): Promise<ProcesVerbal> {
  const token = getToken();
  if (!token) throw new Error("Token non trouvé, veuillez vous connecter.");

  // Ajoute _method=PUT dans le FormData
  payload.append("_method", "PUT");

  const res = await axios.post(`${BASE_URL}/auth/proces-verbaux/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "multipart/form-data", // axios le gère
    },
    withCredentials: true,
  });

  return res.data.data;
}



// 📌 Supprimer un procès-verbal
export async function deleteProcesVerbal(id: number): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("Token non trouvé, veuillez vous connecter.");

  await axios.delete(`${BASE_URL}/auth/proces-verbaux/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    withCredentials: true,
  });
}
