import {useEffect, useState} from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Image,
    TouchableOpacity
} from "react-native";
import Constants from "expo-constants";
import {StatusBar} from "expo-status-bar";

const localhost = Constants.expoConfig?.hostUri?.split(":")[0];
const BASE_URL =
    process.env.EXPO_PUBLIC_API_URL ?? `http://${localhost}:8000`;

export default function UserScreen() {
    const [users, setUsers] = useState([]);
    const [artworks, setArtworks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
        fetchArtworks();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${BASE_URL}/users`, {
                headers: {"x-api-key": process.env.EXPO_PUBLIC_API_KEY},
            });

            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchArtworks = async () => {
        try {
            const response = await fetch(`${BASE_URL}/pieces`, {
                headers: {"x-api-key": process.env.EXPO_PUBLIC_API_KEY},
            });

            const data = await response.json();
            setArtworks(Array.isArray(data) ? data : []);
        } catch (err) {
            console.log("Failed to fetch artworks:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4db6e6"/>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.error}>Error: {error}</Text>
            </View>
        );
    }

    // We tonen de eerste user (zoals jouw mockup)
    const user = users[0];

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
                            <View style={[styles.artMock]}>
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
    container: {flex: 1, backgroundColor: '#08202A'},
    scrollContent: {flex: 1, paddingTop: 20},
    loadingContainer: {flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#08202A"},

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

    profileTextBlock: {marginTop: 12},
    name: {fontSize: 20, fontWeight: 'bold'},
    bio: {fontSize: 13, marginBottom: 6},
    small: {fontSize: 12},

    cardEditButton: {alignSelf: 'flex-end', padding: 8, backgroundColor: '#dcdcdc', borderRadius: 6},
    cardEditText: {fontWeight: '600'},

    buttonRow: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 18, marginBottom: 20},
    editButton: {backgroundColor: '#fff', padding: 10, borderRadius: 6},
    buttonText: {fontWeight: '600'},

    gallerySection: {paddingHorizontal: 18},
    gallerySectionTitle: {fontSize: 16, fontWeight: 'bold', color: '#d0e8ef', marginBottom: 10},

    galleryCard: {marginBottom: 14, borderRadius: 8, overflow: 'hidden'},
    artMock: {height: 150, backgroundColor: "#333"},

    error: {color: "#ff6b6b", fontSize: 16}
});
