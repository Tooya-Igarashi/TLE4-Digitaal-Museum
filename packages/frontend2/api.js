import Constants from "expo-constants";

const localhost = Constants.expoConfig?.hostUri?.split(":")[0];
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? `http://${localhost}:8000`;

const API_KEY = process.env.EXPO_PUBLIC_API_KEY ?? "";

export const apiFetch = async (endpoint, options = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      ...options.headers,
    },
  });
  return response.json();
};

export const getUsers = () => apiFetch("/users");

export const getPieces = () => apiFetch("/pieces");

export const toAbsolute = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};
export const getWalls = () => apiFetch("/walls");
export const getPiecesByWall = (wallId) => apiFetch(`/pieces/wall/${wallId}`);
