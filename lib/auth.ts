import Cookies from "js-cookie";

export function setToken(token: string) {
  Cookies.set("token", token, { expires: 7 });
}

export function getToken() {
  return Cookies.get("token");
}

export function clearToken() {
  Cookies.remove("token");
}
