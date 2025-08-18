import axios from "axios";

export async function login(email: string, password: string) {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      email,
      password
    }, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });

    return res.data; // Axios met déjà la réponse dans res.data
  } catch (error) {
    // Axios a un objet error.response si le serveur répond avec un code d'erreur
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      (error as any).response &&
      (error as any).response.status === 401
    ) {
      throw new Error("Identifiants invalides");
    } else {
      throw new Error("Erreur lors de la connexion");
    }
  }
}

export async function getProfile(token: string) {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      }
    });

    return res.data;
  } catch (error) {
    throw new Error("Erreur de récupération du profil");
  }
}

