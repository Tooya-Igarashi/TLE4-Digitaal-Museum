const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

export const apiFetch = async (endpoint, options = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            ...options.headers,
        },
    });
    return response.json();
};
export const getPieces = () => apiFetch("/pieces");
export const getStyles = () => apiFetch("/graffiti-styles");


export const getUsers = () => apiFetch("/users");

export const toAbsolute = (path) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};
export const getWalls = () => apiFetch("/walls");
export const getPiecesByWall = (wallId) => apiFetch(`/pieces/wall/${wallId}`);

export const getLocations = () => apiFetch(`/locations`);

export const createPiece = async (formData, token) => {

    const response = await fetch(`${BASE_URL}/pieces`, {
        method: 'POST',

        headers: {
            'x-api-key': API_KEY,
            Authorization: `Bearer ${token}`,
        },

        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || 'Upload mislukt'
        );
    }

    return data;
};