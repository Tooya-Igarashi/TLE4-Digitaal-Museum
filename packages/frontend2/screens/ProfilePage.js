import {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native';
import {StatusBar} from 'expo-status-bar';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function UserScreen({route}) {
    const {userId, accessToken} = route?.params ?? {};

    const [user, setUser] = useState(null);
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;
        fetchUser();
        fetchArtworks();
    }, [userId]);

    const fetchUser = async () => {
        try {
            const response = await fetch(`${BASE_URL}/users/${userId}`, {
                headers: {
                    "x-api-key": process.env.EXPO_PUBLIC_API_KEY,
                    "Authorization": `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setUser(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchArtworks = async () => {
        try {
            const response = await fetch(`${BASE_URL}/pieces/user/${userId}`, {
                headers: {
                    "x-api-key": process.env.EXPO_PUBLIC_API_KEY,
                    "Authorization": `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();
            setArtworks(Array.isArray(data) ? data : []);
        } catch (err) {
            console.log("Failed to fetch artworks:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!userId) {
        return (
            <View style={styles.container}>
                <Text style={{color: 'white'}}>Niet ingelogd.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light"/>

            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* PROFIELKAART */}
                <View style={styles.profileSection}>
                    <View style={styles.profileCard}>

                        {/* Avatar */}
                        <View style={styles.avatar}>
                            {user?.avatar ? (
                                <Image
                                    source={{uri: user.avatar}}
                                    style={{width: "100%", height: "100%", borderRadius: 60}}
                                />
                            ) : (
                                <Text style={styles.avatarText}>👤</Text>
                            )}
                        </View>

                        {/* Tekst */}
                        <View style={styles.profileTextBlock}>
                            <Text style={styles.name}>{user?.username}</Text>
                            <Text style={styles.bio}>{user?.description}</Text>
                            <Text style={styles.small}>Email: {user?.email}</Text>
                            <Text style={styles.small}>Rol: {user?.role}</Text>
                            <Text style={styles.small}>Premium: {user?.premium ? "Ja" : "Nee"}</Text>
                        </View>

                        {/* Bewerken */}
                        <TouchableOpacity style={styles.cardEditButton}>
                            <Text style={styles.cardEditText}>Bewerken 🔧</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* BUTTONS */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.editButton}>
                        <Text style={styles.buttonText}>Bewerken</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.editButton}>
                        <Text style={styles.buttonText}>Toevoegen +</Text>
                    </TouchableOpacity>
                </View>

                {/* ARTWORK GALLERY */}
                <View style={styles.gallerySection}>
                    <Text style={styles.gallerySectionTitle}>Mijn werken</Text>

                    {artworks.length === 0 && (
                        <Text style={{color: "#d0e8ef", marginBottom: 10}}>
                            Geen werken gevonden...
                        </Text>
                    )}

                    {artworks.map((artwork) => (
                        <View key={artwork._id} style={styles.galleryCard}>
                            <View style={styles.artMock}>
                                <Image
                                    source={{uri: artwork.image}}
                                    style={{width: "100%", height: "100%"}}
                                    resizeMode="cover"
                                />
                            </View>
                            <Text style={{color: "#d0e8ef", fontSize: 12, padding: 6}}>
                                Gemaakt: {new Date(artwork.createdAt).toLocaleDateString()}
                            </Text>
                        </View>
                    ))}
                </View>

                <View style={{height: 40}}/>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#051923',
    },
    scrollContent: {
        flex: 1,
        paddingHorizontal: 20,
    },
    profileSection: {
        marginTop: 40,
        marginBottom: 20,
    },
    profileCard: {
        backgroundColor: '#0a2536',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#1e3a52',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        overflow: 'hidden',
    },
    avatarText: {
        fontSize: 36,
    },
    profileTextBlock: {
        alignItems: 'center',
        marginBottom: 12,
    },
    name: {
        color: '#F5F5F5',
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 4,
    },
    bio: {
        color: '#8ab4cc',
        fontSize: 13,
        textAlign: 'center',
        marginBottom: 8,
    },
    small: {
        color: '#8ab4cc',
        fontSize: 12,
        marginBottom: 2,
    },
    cardEditButton: {
        backgroundColor: '#1e3a52',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    cardEditText: {
        color: '#F5F5F5',
        fontSize: 13,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 24,
    },
    editButton: {
        flex: 1,
        backgroundColor: '#0a2536',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1e3a52',
    },
    buttonText: {
        color: '#F5F5F5',
        fontSize: 14,
    },
    gallerySection: {
        marginBottom: 20,
    },
    gallerySectionTitle: {
        color: '#F5F5F5',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    galleryCard: {
        backgroundColor: '#0a2536',
        borderRadius: 10,
        marginBottom: 12,
        overflow: 'hidden',
    },
    artMock: {
        height: 180,
        backgroundColor: '#1e3a52',
    },
});