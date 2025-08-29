import axios, { AxiosResponse } from "axios";
import { getToken } from "./auth";


const BASE_URL = process.env.NEXT_PUBLIC_API_URL + '/auth';

interface LoginResponse {
  token: string;
  nom: string;
  prenom: string;
  fonction: string;
  matricule: string;
  role: string;
  email: string;
}

interface ProfileResponse {
  data: {
  nom: string;
  prenom: string;
  fonction: string;
  matricule: string;
  role: string;
  email: string;
  }
}


const token = getToken();

export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const res: AxiosResponse<LoginResponse> = await axios.post(
     `${BASE_URL}/login` ,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    if (!res.data) throw new Error("Identifiants invalides");
 //   console.log('response', res.data)
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Identifiants incorrects"
    );
  }
}

export async function getProfile(token: string): Promise<ProfileResponse> {
  try {
    const res: AxiosResponse<ProfileResponse> = await axios.get(
      `${BASE_URL}/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    console.log('response', res.data)
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erreur de récupération du profil"
    );
  }
}