import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet, StatusBar, Platform} from 'react-native';
import {useFonts, Montserrat_400Regular, Montserrat_600SemiBold} from '@expo-google-fonts/montserrat';

import {useMuseumData} from '../components/UseMuseumData';
import SearchBar from '../components/SearchBar';
import PieceCard from '../components/MuseumPieceCard';
import FilterModal from '../components/FilterModal';
import ImageDetailModal from '../components/ImageDetailModal';

export default function DigitalMuseumPage({navigation}) {
    const [fontsLoaded] = useFonts({Montserrat_400Regular, Montserrat_600SemiBold});

    const [searchQuery, setSearchQuery] = useState('');
    const [searchHistory, setSearchHistory] = useState([]);
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [selectedPiece, setSelectedPiece] = useState(null);

    const [activeFilters, setActiveFilters] = useState({
        yearMin: null, yearMax: null, months: [], styles: [], artistSort: null
    });
    const {
        pieces,
        filteredPieces,
        setFilteredPieces,
        graffitiStyles,
        favoriteIds,
        loading,
        toggleFavorite
    } = useMuseumData();

    // Filter logica
    useEffect(() => {
        let results = [...pieces];
        const normalizedQuery = searchQuery.toLowerCase().trim();

        if (normalizedQuery) {
            results = results.filter((piece) => {
                const year = piece.date ? new Date(piece.date).getFullYear().toString() : '';
                const month = piece.date ? new Date(piece.date).toLocaleString('nl-NL', {month: 'long'}).toLowerCase() : '';
                const artist = piece.user?.username?.toLowerCase() || '';
                const style = (piece.graffitiStyle?.name ?? piece.graffitiStyle?.graffitiStyleName ?? '')?.toLowerCase();
                return year.includes(normalizedQuery) || month.includes(normalizedQuery) || artist.includes(normalizedQuery) || style.includes(normalizedQuery);
            });
        }

        if (activeFilters.yearMin !== null) {
            results = results.filter((piece) => {
                if (!piece.date) return false;
                const pieceYear = new Date(piece.date).getFullYear();
                return pieceYear >= activeFilters.yearMin && pieceYear <= (activeFilters.yearMax ?? activeFilters.yearMin);
            });
        }

        if (activeFilters.months.length > 0) {
            results = results.filter((piece) => piece.date && activeFilters.months.includes(new Date(piece.date).getMonth()));
        }

        if (activeFilters.styles.length > 0) {
            results = results.filter((piece) => activeFilters.styles.includes(piece.graffitiStyle?.name ?? piece.graffitiStyle?.graffitiStyleName));
        }

        if (activeFilters.artistSort === 'az') {
            results.sort((pieceA, pieceB) => (pieceA.user?.username || '').localeCompare(pieceB.user?.username || ''));
        } else if (activeFilters.artistSort === 'za') {
            results.sort((pieceA, pieceB) => (pieceB.user?.username || '').localeCompare(pieceA.user?.username || ''));
        }

        setFilteredPieces(results);
    }, [searchQuery, activeFilters, pieces]);

    const handleSearchSubmit = () => {
        const trimmedQuery = searchQuery.trim();
        if (trimmedQuery && !searchHistory.includes(trimmedQuery)) {
            setSearchHistory((prev) => [trimmedQuery, ...prev].slice(0, 5));
        }
    };

    const hasActiveFilters = activeFilters.yearMin !== null || activeFilters.months.length > 0 || activeFilters.styles.length > 0 || activeFilters.artistSort !== null;

    if (!fontsLoaded) return null;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#051923"/>

            {/* 1. Zoekbalk */}
            <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSubmit={handleSearchSubmit}
                searchHistory={searchHistory}
                onHistoryTap={setSearchQuery}
                onClearHistory={() => setSearchHistory([])}
            />

            {/* 2. Actie Knoppen */}
            <View style={styles.actionRow}>
                <TouchableOpacity style={[styles.filterBtn, hasActiveFilters && styles.filterBtnActive]}
                                  onPress={() => setShowFilterPanel(true)}>
                    <Text style={[styles.filterBtnText, hasActiveFilters && styles.filterBtnTextActive]}>
                        Filteren {hasActiveFilters ? '•' : ''}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('UploadPage')}>
                    <Text style={styles.addBtnText}>Toevoegen +</Text>
                </TouchableOpacity>
            </View>

            {/* 3. Kunstwerken Lijst */}
            {loading ? (
                <View style={styles.center}><Text style={styles.infoText}>Kunstwerken laden...</Text></View>
            ) : (
                <FlatList
                    data={filteredPieces}
                    keyExtractor={(item) => item._id?.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item, index}) => (
                        <PieceCard
                            item={item}
                            index={index}
                            isFavorite={favoriteIds.has(item._id)}
                            onOpenImage={(piece) => setSelectedPiece(piece)}
                            onToggleFavorite={toggleFavorite}
                            onArtistPress={(piece) => navigation.navigate('ProfilePage', {userId: piece.user?._id})}
                            onLocationPress={(piece) => {
                                if (!piece.wall?.coordinates) return;
                                const [lat, lng] = piece.wall.coordinates.split(',').map(coordinate => coordinate.trim());
                                navigation.navigate('MapPage', {
                                    latitude: parseFloat(lat),
                                    longitude: parseFloat(lng),
                                    wallName: piece.wall?.wallName
                                });
                            }}
                        />
                    )}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={styles.infoText}>Geen resultaten
                                gevonden.
                            </Text>
                        </View>}
                />
            )}

            {/* 4. Modals */}
            <FilterModal
                visible={showFilterPanel}
                onClose={() => setShowFilterPanel(false)}
                graffitiStyles={graffitiStyles}
                activeFilters={activeFilters}
                onApply={(filters) => {
                    setActiveFilters(filters);
                    setShowFilterPanel(false);
                }}
                onReset={() => setActiveFilters({
                    yearMin: null,
                    yearMax: null,
                    months: [],
                    styles: [],
                    artistSort: null
                })}
            />

            <ImageDetailModal
                item={selectedPiece}
                visible={selectedPiece !== null}
                onClose={() => setSelectedPiece(null)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#051923',
        paddingTop: Platform.OS === 'ios' ? 50 : 20
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: 14,
        marginBottom: 6
    },
    filterBtn: {
        backgroundColor: '#F5F5F5',
        borderHeight: 1,
        borderWidth: 1,
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 20,
        justifyContent: 'center'
    },
    filterBtnActive: {
        backgroundColor: '#1E5C7E',
        borderColor: '#1E5C7E'
    },
    filterBtnText: {
        color: '#051923',
        fontSize: 13,
        fontFamily: 'Montserrat_600SemiBold'
    },
    filterBtnTextActive: {
        color: '#F5F5F5'
    },
    addBtn: {
        backgroundColor: '#F5F5F5',
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 20,
        justifyContent: 'center'
    },
    addBtnText: {
        color: '#051923',
        fontSize: 13,
        fontFamily: 'Montserrat_600SemiBold'
    },
    listContent: {
        paddingBottom: 30
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40
    },
    infoText: {
        color: '#8ab4cc',
        fontSize: 14,
        fontFamily: 'Montserrat_400Regular'
    }
});