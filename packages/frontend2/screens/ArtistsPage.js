import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    Dimensions,
    FlatList,
    TextInput,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import Constants from 'expo-constants';

const getBaseUrl = () => {
    if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
    if (Platform.OS === 'web') return 'http://localhost:8000';
    const host = Constants.expoConfig?.hostUri?.split(':')[0];
    return `http://${host}:8000`;
};

const BASE_URL = getBaseUrl();
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ArtistsScreen({ navigation }) {
    const [artists, setArtists] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const [fontsLoaded] = useFonts({ Montserrat_400Regular, Montserrat_700Bold });

    useEffect(() => {
        fetchArtists();
    }, []);

    useEffect(() => {
        if (search.trim() === '') {
            setFiltered(artists);
        } else {
            setFiltered(
                artists.filter((a) =>
                    a.username.toLowerCase().includes(search.toLowerCase())
                )
            );
        }
    }, [search, artists]);

    const fetchArtists = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/users/role/artist`, {
                headers: { 'x-api-key': process.env.EXPO_PUBLIC_API_KEY },
            });
            const data = await res.json();
            setArtists(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch artists:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ProfilePage', { artistId: item._id })}
            activeOpacity={0.8}
        >
            <View style={styles.avatarWrapper}>
                {item.avatar ? (
                    <Image
                        source={{ uri: `${BASE_URL}${item.avatar}` }}
                        style={styles.avatar}
                    />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarIcon}>👤</Text>
                    </View>
                )}
            </View>
            <Text style={styles.artistName}>{item.username}</Text>
            <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
    );

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerSub}>Ontdek alle</Text>
                <Text style={styles.headerTitle}>Kunstenaars</Text>
            </View>

            {/* Filter + Search row */}
            <View style={styles.searchRow}>
                {/*<TouchableOpacity style={styles.filterBtn}>*/}
                {/*    <Text style={styles.filterText}>Filter  ∨</Text>*/}
                {/*</TouchableOpacity>*/}
                <View style={styles.searchWrapper}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder=""
                        placeholderTextColor="#aaa"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            {/* List */}
            {loading ? (
                <ActivityIndicator style={{ marginTop: 40 }} color="#fff" />
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0d1b2a',
    },
    header: {
        alignItems: 'center',
        paddingTop: 32,
        paddingBottom: 24,
    },
    headerSub: {
        fontFamily: 'Montserrat_400Regular',
        color: '#fff',
        fontSize: 18,
    },
    headerTitle: {
        fontFamily: 'Montserrat_700Bold',
        color: '#fff',
        fontSize: 32,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 16,
    },
    filterBtn: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    filterText: {
        fontFamily: 'Montserrat_400Regular',
        color: '#0d1b2a',
        fontSize: 14,
    },
    searchWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    searchIcon: {
        fontSize: 14,
        marginRight: 6,
    },
    searchInput: {
        flex: 1,
        fontFamily: 'Montserrat_400Regular',
        fontSize: 14,
        color: '#0d1b2a',
        padding: 0,
    },
    list: {
        paddingHorizontal: 20,
        paddingBottom: 100,
        gap: 12,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e3a5f',
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#2a4f7a',
    },
    avatarWrapper: {
        marginRight: 16,
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#0d1b2a',
    },
    avatarPlaceholder: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#0d1b2a',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#2a4f7a',
    },
    avatarIcon: {
        fontSize: 24,
    },
    artistName: {
        flex: 1,
        fontFamily: 'Montserrat_400Regular',
        color: '#fff',
        fontSize: 16,
    },
    chevron: {
        color: '#fff',
        fontSize: 24,
        marginRight: 4,
    },
});