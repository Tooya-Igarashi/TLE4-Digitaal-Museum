import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView, Image} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useEffect, useState} from "react";

// Pas deze base aan indien je op een device test: gebruik je machine IP i.p.v. localhost
const API = 'http://127.0.0.1:8000';

export default function ProfilePage({onBackHome}) {
    const insets = useSafeAreaInsets();

    const [user, setUser] = useState(null);
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // BACKEND DATA OPHALEN (async/await, betere foutafhandeling)
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch users en pieces van seed endpoints
                const [usersRes, piecesRes] = await Promise.all([
                    fetch(`${API}/seed/users`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: 5 }) }),
                    fetch(`${API}/seed/pieces`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: 10 }) })
                ]);

                if (!usersRes.ok) throw new Error(`Users: ${usersRes.status} ${usersRes.statusText}`);
                if (!piecesRes.ok) throw new Error(`Pieces: ${piecesRes.status} ${piecesRes.statusText}`);

                const users = await usersRes.json();
                const pieces = await piecesRes.json();

                setUser(users[0] || null); // eerste user als profiel
                setArtworks(pieces || []);
            } catch (e) {
                console.log('FETCH ERROR:', e);
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleEditProfile = () => {
        alert('Bewerk profiel komt hier later');
    };

    const handleAddArtwork = () => {
        alert('Voeg artwork toe');
    };

    return (
        <View style={[styles.container, {paddingBottom: insets.bottom}]}>
            <StatusBar style="light"/>

            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* PROFIELKAART */}
                <View style={styles.profileSection}>
                    <View style={styles.profileCard}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>👤</Text>
                        </View>

                        <View style={styles.profileTextBlock}>
                            <Text style={styles.name}>{user?.name || "Naam wordt geladen..."}</Text>
                            <Text style={styles.bio}>{user?.bio || "Bio wordt geladen..."}</Text>
                        </View>

                        <TouchableOpacity style={styles.cardEditButton} onPress={handleEditProfile}>
                            <Text style={styles.cardEditText}>Bewerken 🔧</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* BUTTONS */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                        <Text style={styles.buttonText}>Bewerken</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.editButton} onPress={handleAddArtwork}>
                        <Text style={styles.buttonText}>Toevoegen +</Text>
                    </TouchableOpacity>
                </View>

                {/* ARTWORK GALLERY */}
                <View style={styles.gallerySection}>
                    <Text style={styles.gallerySectionTitle}>Mijn werken</Text>

                    {loading && <Text style={{color: '#d0e8ef', marginBottom: 10}}>Laden...</Text>}
                    {error && <Text style={{color: '#ffb3b3', marginBottom: 10}}>Fout: {error}</Text>}

                    {artworks.length === 0 && !loading && !error && (
                        <Text style={{color: "#d0e8ef", marginBottom: 10}}>
                            Geen werken gevonden...
                        </Text>
                    )}

                    {artworks.map((artwork) => (
                        <View key={artwork._id || artwork.id} style={styles.galleryCard}>
                            <View style={[styles.artMock, {backgroundColor: artwork.color || "#555"}]}>
                                {/* Als afbeelding beschikbaar is, toon die */}
                                {artwork.image ? (
                                    <Image
                                        source={{uri: artwork.image.startsWith('http') ? artwork.image : `${API}/${artwork.image}`}}
                                        style={{width: '100%', height: '100%'}} resizeMode="cover"/>
                                ) : (
                                    <Text style={styles.artTitle}>{artwork.title}</Text>
                                )}
                            </View>
                        </View>
                    ))}
                </View>

                {/* HOME BUTTON (verborgen) */}
                <TouchableOpacity style={styles.homeButton} onPress={onBackHome}>
                    <Text style={styles.homeButtonText}>← Terug naar Home</Text>
                </TouchableOpacity>

                <View style={{height: 40}}/>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#08202A',
    },
    scrollContent: {
        flex: 1,
        paddingTop: 20,
    },
    profileSection: {
        paddingHorizontal: 18,
        marginBottom: 16,
    },
    profileCard: {
        backgroundColor: '#C9C9C9',
        borderRadius: 12,
        padding: 16,
        minHeight: 240,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F4F4F4',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#C8C8C8',
    },
    avatarText: {
        color: '#111',
        fontSize: 64,
        fontWeight: '700',
    },
    profileTextBlock: {
        marginLeft: 6,
        marginBottom: 8,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1d1d1d',
        marginBottom: 6,
    },
    bio: {
        fontSize: 13,
        color: '#2c2c2c',
        lineHeight: 18,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        marginBottom: 24,
        gap: 12,
    },
    editButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#cfcfcf',
        alignItems: 'center',
    },
    buttonText: {
        color: '#222',
        fontWeight: '600',
        fontSize: 14,
    },
    gallerySection: {
        paddingHorizontal: 18,
        marginBottom: 16,
    },
    gallerySectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#d0e8ef',
        marginBottom: 12,
    },
    galleryCard: {
        marginBottom: 14,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#d0d0d0',
    },
    artMock: {
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
    },
    artTitle: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: 2,
    },
    cardEditButton: {
        alignSelf: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        backgroundColor: '#dcdcdc',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    cardEditText: {
        color: '#222',
        fontWeight: '600',
    },
    homeButton: {
        display: 'none',
    },
    homeButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
