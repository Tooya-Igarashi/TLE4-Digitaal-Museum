import {useState, useEffect, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import asyncStorage from "@react-native-async-storage/async-storage";
import * as api from '../api';

export function useData() {
    const [pieces, setPieces] = useState([]);
    const [filteredPieces, setFilteredPieces] = useState([]);
    const [graffitiStyles, setGraffitiStyles] = useState([]);
    const [favoriteIds, setFavoriteIds] = useState(new Set());
    const [currentUserId, setCurrentUserId] = useState(null);
    const [locations, setLocations] = useState([]);
    const [walls, setWalls] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadCurrentUserAndFavorites = async () => {
        try {
            const userId = await asyncStorage.getItem('userId');
            setCurrentUserId(userId);
            if (!userId) return;

            const token = await asyncStorage.getItem('accessToken');
            const data = await api.getFavorites(userId, token);
            setFavoriteIds(new Set(Array.isArray(data) ? data.map((p) => p._id) : []));
        } catch (err) {
            console.error('Failed to load favorites:', err);
        }
    };

    const fetchPieces = async () => {
        try {
            const data = await api.getPieces();
            const cleanData = Array.isArray(data) ? data : [];
            setPieces(cleanData);
            return cleanData;
        } catch (err) {
            console.error("Fout bij ophalen van kunstwerken:", err);
            setPieces([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchLocations = async () => {
        try {
            const data = await api.getLocations();
            setLocations(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fout bij ophalen locaties:", err);
            setLocations([]);
        }
    };

    const fetchWalls = async () => {
        try {
            const data = await api.getWalls();
            setWalls(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fout bij ophalen muren:", err);
            setWalls([]);
        }
    };

    const fetchStyles = async () => {
        try {
            const data = await api.getStyles();
            setGraffitiStyles(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fout bij ophalen stijlen:", err);
            setGraffitiStyles([]);
        }
    };

    const toggleFavorite = async (pieceId) => {
        if (!currentUserId) {
            alert('Log in om favorieten op te slaan');
            return;
        }

        const alreadyFavorite = favoriteIds.has(pieceId);
        try {
            const token = await asyncStorage.getItem('accessToken');

            if (alreadyFavorite) {
                await api.removeFavorite(currentUserId, pieceId, token);
            } else {
                await api.addFavorite(currentUserId, pieceId, token);
            }

            setFavoriteIds((prev) => {
                const next = new Set(prev);
                alreadyFavorite ? next.delete(pieceId) : next.add(pieceId);
                return next;
            });

            alert(alreadyFavorite ? 'Verwijderd uit favorieten' : 'Kunstwerk gezet als Favoriet!');
        } catch (err) {
            console.error('Failed to toggle favorite:', err);
            alert('Er ging iets mis, probeer het opnieuw.');
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchPieces().then((data) => {
                if (data) setFilteredPieces(data);
            });
            fetchStyles();
            fetchWalls();
            loadCurrentUserAndFavorites();
        }, [])
    );

    return {
        pieces,
        filteredPieces,
        setFilteredPieces,
        graffitiStyles,
        favoriteIds,
        currentUserId,
        locations,
        walls,
        loading,
        toggleFavorite,
        refreshPieces: fetchPieces
    };
}