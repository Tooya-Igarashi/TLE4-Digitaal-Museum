import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView, Image} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useEffect, useState} from "react";

const API = 'http://127.0.0.1:8000';

export default function ProfilePage({onBackHome}) {
    const insets = useSafeAreaInsets();

    const [user, setUser] = useState(null);
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const USER_ID = '6a26b1187e9b607e65117f09';

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);

                // Fetch user
                const userRes = await fetch(`${API}/seed/users/${USER_ID}`);
                if (!userRes.ok) throw new Error("User fetch failed");
                const userData = await userRes.json();
                setUser(userData);

                // Fetch artworks
                const piecesRes = await fetch(`${API}/pieces`);
                if (!piecesRes.ok) throw new Error("Pieces fetch failed");
                const allPieces = await piecesRes.json();

                const userPieces = allPieces.filter(p => {
                    const uid = p.username?._id || p.username;
                    return uid === USER_ID;
                });

                setArtworks(userPieces);
            } catch (err) {
                console.error("FETCH ERROR:", err);
                setError(err.message);
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
                            <Text style={styles.name}>{user?.username || "Naam wordt geladen..."}</Text>
                            <Text style={styles.bio}>{user?.description || "Beschrijving wordt geladen..."}</Text>
                            <Text style={styles.small}>Email: {user?.email || '-'}</Text>
                            <Text style={styles.small}>Rol: {user?.role || '-'}</Text>
                            <Text style={styles.small}>Premium: {user?.premium ? 'Ja' : 'Nee'}</Text>
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
                        <View key={artwork._id} style={styles.galleryCard}>
                            <View style={[styles.artMock, {backgroundColor: artwork.color || "#555"}]}>
                                {artwork.image ? (
                                    <Image
                                        source={{uri: artwork.image.startsWith('http') ? artwork.image : `${API}/${artwork.image}`}}
                                        style={{width: '100%', height: '100%'}}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <Text style={styles.artTitle}>{artwork.title}</Text>
                                )}
                            </View>

                            <Text style={{color: "#d0e8ef", fontSize: 12, padding: 6}}>
                                Gemaakt: {new Date(artwork.createdAt).toLocaleDateString()}
                            </Text>
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={styles.homeButton} onPress={onBackHome}>
                    <Text style={styles.homeButtonText}>← Terug naar Home</Text>
                </TouchableOpacity>

                <View style={{height: 40}}/>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#08202A'},
    scrollContent: {flex: 1, paddingTop: 20},
    profileSection: {paddingHorizontal: 18, marginBottom: 16},
    profileCard: {backgroundColor: '#C9C9C9', borderRadius: 12, padding: 16},
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F4F4F4',
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatarText: {fontSize: 64},
    profileTextBlock: {marginLeft: 6},
    name: {fontSize: 20, fontWeight: 'bold'},
    bio: {fontSize: 13},
    small: {fontSize: 12},
    buttonRow: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 18},
    editButton: {backgroundColor: '#fff', padding: 10, borderRadius: 6},
    buttonText: {fontWeight: '600'},
    gallerySection: {paddingHorizontal: 18},
    gallerySectionTitle: {fontSize: 16, fontWeight: 'bold', color: '#d0e8ef'},
    galleryCard: {marginBottom: 14, borderRadius: 8, overflow: 'hidden'},
    artMock: {height: 150, alignItems: 'center', justifyContent: 'center'},
    artTitle: {color: '#fff', fontSize: 28, fontWeight: '900'},
    cardEditButton: {alignSelf: 'flex-end', padding: 8, backgroundColor: '#dcdcdc', borderRadius: 6},
    cardEditText: {fontWeight: '600'},
    homeButton: {display: 'none'},
});
