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
