import axios from "axios";
import { getToken } from "./auth"; // ta fonction pour récupérer le token depuis Cookies

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
 const token = getToken();

export async function listUser() {
  try {
    // récupère le token côté frontend
    console.log("Token récupéré:", token);
    if (!token) {
      throw new Error("Token non trouvé, veuillez vous connecter.");
    }
    const response = await axios.get(`${BASE_URL}/auth/users`, {
      // withCredentials: true, // pour Sanctum, envoie le cookie de session
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = response.data.data;

    if (data.error) {
      throw new Error(data.message);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Erreur serveur");
  }
}

export async function createUser(payload: {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  matricule: string;
  fonction: string;
  role: string;
  password: string;
}) {
  try {
    console.log("Token récupéré:", token);
    if (!token) throw new Error("Token non trouvé, veuillez vous connecter.");

    const response = await axios.post(`${BASE_URL}/auth/register`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Erreur serveur");
  }
}


// ✅ Récupérer un utilisateur spécifique
export async function getUser(userId: number) {
  const token = getToken();
  try {
    if (!token) throw new Error("Token non trouvé, veuillez vous connecter.");

    const response = await axios.get(`${BASE_URL}/auth/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.data; // selon la structure de ta réponse API
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Erreur serveur");
  }
}
// ✅ Récupérer l’utilisateur connecté (via /auth/me ou /api/user selon ton backend)
export async function getCurrentUser() {
  const token = getToken();
  try {
    if (!token) throw new Error("Token non trouvé, veuillez vous connecter.");

    const response = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data; // ex: { id, name, email, role, ... }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Erreur serveur");
  }
}




// ✅ Mise à jour d’un utilisateur
export async function editUser(
  userId: number,
  payload: {
    nom?: string;
    prenom?: string;
    email?: string;
    telephone?: string;
    matricule?: string;
    fonction?: string;
    role?: string;
    password?: string;
  }
) {
  const token = getToken();
  try {
    if (!token) throw new Error("Token non trouvé, veuillez vous connecter.");

    const response = await axios.put(`${BASE_URL}/auth/users/${userId}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Erreur serveur");
  }
}