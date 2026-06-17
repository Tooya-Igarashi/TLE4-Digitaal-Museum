import {useState, useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
    TextInput
} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {useNavigation} from '@react-navigation/native';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

export default function UserScreen({route}) {
    const navigation = useNavigation();
    const {userId, accessToken} = route?.params ?? {};

    const [user, setUser] = useState(null);
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editingDesc, setEditingDesc] = useState(false);
    const [descInput, setDescInput] = useState('');
    const [saving, setSaving] = useState(false);

    // UITKLAPBARE BIO
    const [bioExpanded, setBioExpanded] = useState(false);

    // CHARACTER COUNTER
    const countChars = (text) => text.length;

    const handleLogout = () => {
        Alert.alert("Uitloggen", "Weet je zeker dat je wilt uitloggen?", [
            {text: "Annuleren", style: "cancel"},
            {
                text: "Uitloggen",
                style: "destructive",
                onPress: () => {
                    let root = navigation;
                    while (root.getParent()) root = root.getParent();
                    root.reset({index: 0, routes: [{name: 'Login'}]});
                },
            },
        ]);
    };

    useEffect(() => {
        if (!userId) return;
        fetchUser();
        fetchArtworks();
    }, [userId]);

    const fetchUser = async () => {
        try {
            const response = await fetch(`${BASE_URL}/users/${userId}`, {
                headers: {
                    "x-api-key": API_KEY,
                    "Authorization": `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            setUser(data);
            setDescInput(data.description ?? '');
        } catch (err) {
            console.warn("Failed to fetch user:", err.message);
        }
    };

    const fetchArtworks = async () => {
        try {
            const response = await fetch(`${BASE_URL}/pieces/user/${userId}`, {
                headers: {
                    "x-api-key": API_KEY,
                    "Authorization": `Bearer ${accessToken}`,
                },
            });

            const data = await response.json();
            setArtworks(Array.isArray(data) ? data : []);
        } catch (err) {
            console.warn("Failed to fetch artworks:", err);
        } finally {
            setLoading(false);
        }
    };

    const saveDescription = async () => {
        const charCount = countChars(descInput);

        if (charCount > 300) {
            Alert.alert(
                "Te veel tekst",
                `Je beschrijving bevat ${charCount} karakters. Maximaal toegestaan: 300.`
            );
            return;
        }

        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('description', descInput);

            const response = await fetch(`${BASE_URL}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    "x-api-key": API_KEY,
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: formData,
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const updated = await response.json();
            setUser(updated);
            setEditingDesc(false);
        } catch (err) {
            Alert.alert("Fout", "Opslaan mislukt: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    const cancelEdit = () => {
        setDescInput(user?.description ?? '');
        setEditingDesc(false);
    };

    if (!userId) {
        return (
            <View style={styles.container}>
                <Text style={{color: 'white', marginBottom: 20}}>Niet ingelogd.</Text>
                <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={() => {
                        let root = navigation;
                        while (root.getParent()) root = root.getParent();
                        root.reset({index: 0, routes: [{name: 'Login'}]});
                    }}
                >
                    <Text style={styles.logoutBtnText}>Inloggen</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light"/>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                {/* PROFIELKAART */}
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        {user?.avatar ? (
                            <Image
                                source={{uri: `${BASE_URL}${user.avatar}`}}
                                style={{width: "100%", height: "100%", borderRadius: 40}}
                            />
                        ) : (
                            <Text style={styles.avatarText}>👤</Text>
                        )}
                    </View>

                    <View style={styles.profileTextBlock}>
                        <Text style={styles.name}>{user?.username}</Text>
                        <Text style={styles.small}>Email: {user?.email}</Text>

                        {/* DESCRIPTION BOX */}
                        {editingDesc ? (
                            <View style={styles.descEditBlock}>

                                <TextInput
                                    style={styles.descInput}
                                    value={descInput}
                                    onChangeText={setDescInput}
                                    placeholder="Voer een beschrijving in..."
                                    placeholderTextColor="#4a7a9b"
                                    multiline
                                    autoFocus
                                    maxLength={300}
                                />

                                <Text style={styles.wordCounter}>
                                    {countChars(descInput)} / 300 karakters
                                </Text>

                                <View style={styles.descButtons}>
                                    <TouchableOpacity
                                        style={[styles.descBtn, styles.descBtnSave]}
                                        onPress={saveDescription}
                                        disabled={saving}
                                    >
                                        <Text style={styles.descBtnText}>
                                            {saving ? "Opslaan..." : "Opslaan"}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.descBtn, styles.descBtnCancel]}
                                        onPress={cancelEdit}
                                        disabled={saving}
                                    >
                                        <Text style={styles.descBtnText}>Annuleren</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <TouchableOpacity
                                onPress={() => setBioExpanded(!bioExpanded)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.bioBox}>
                                    <Text
                                        style={styles.bioText}
                                        numberOfLines={bioExpanded ? undefined : 3}
                                        ellipsizeMode={bioExpanded ? "clip" : "tail"}
                                    >
                                        {user?.description || '—'}
                                    </Text>

                                    <Text style={styles.expandText}>
                                        {bioExpanded ? "Minder weergeven ▲" : "Meer weergeven ▼"}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}

                        <Text style={styles.small}>Premium: {user?.premium ? "Ja" : "Nee"}</Text>
                    </View>
                </View>

                {/* BUTTONS */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => setEditingDesc(true)}
                    >
                        <Text style={styles.actionBtnText}>Bewerk Profiel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionBtn, styles.logoutBtn]}
                        onPress={handleLogout}
                    >
                        <Text style={[styles.actionBtnText, styles.logoutBtnText]}>Uitloggen</Text>
                    </TouchableOpacity>
                </View>

                {/* UPLOAD */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => navigation.navigate("UploadPage", {userId, accessToken})}
                    >
                        <Text style={styles.actionBtnText}>Nieuw werk uploaden</Text>
                    </TouchableOpacity>
                </View>

                {/* UPDATE WORKS */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => navigation.navigate("UpdateWorksPage", {userId})}
                    >
                        <Text style={styles.actionBtnText}>Werken updaten</Text>
                    </TouchableOpacity>
                </View>

                {/* ARTWORK GALLERY */}
                <Text style={styles.sectionTitle}>Mijn werken</Text>

                {artworks.length === 0 && !loading && (
                    <Text style={styles.emptyText}>Geen werken gevonden...</Text>
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
                        <Text style={styles.artTitle}>{artwork.title}</Text>
                        <Text style={styles.artDate}>
                            {new Date(artwork.date).toLocaleDateString('nl-NL')}
                        </Text>
                    </View>
                ))}

                <View style={{height: 40}}/>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#051923',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scroll: {flex: 1, width: '100%'},
    scrollContent: {paddingHorizontal: 20, paddingTop: 60},
    profileCard: {
        backgroundColor: '#0a2536',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
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
    avatarText: {fontSize: 36},
    profileTextBlock: {alignItems: 'center', width: '100%'},
    name: {color: '#F5F5F5', fontSize: 20, fontWeight: '600', marginBottom: 4},
    small: {color: '#8ab4cc', fontSize: 12, marginBottom: 2},

    bioBox: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#0d2f45',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#1e3a52',
        maxWidth: "90%",
    },
    bioText: {
        color: '#8ab4cc',
        fontSize: 13,
        textAlign: 'center',
    },

    expandText: {
        color: "#8ab4cc",
        fontSize: 12,
        textAlign: "center",
        marginTop: 6,
        opacity: 0.8
    },

    wordCounter: {
        color: "#8ab4cc",
        fontSize: 12,
        textAlign: "right",
        marginBottom: 6
    },

    buttonRow: {flexDirection: 'row', gap: 10, marginBottom: 24},
    actionBtn: {
        flex: 1,
        backgroundColor: '#0a2536',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1e3a52',
    },
    actionBtnText: {color: '#F5F5F5', fontSize: 14, fontWeight: '600'},
    logoutBtn: {borderColor: '#c0392b', backgroundColor: '#1a0a0a'},
    logoutBtnText: {color: '#e74c3c'},

    sectionTitle: {color: '#F5F5F5', fontSize: 18, fontWeight: '600', marginBottom: 12},
    emptyText: {color: '#8ab4cc', marginBottom: 10},

    galleryCard: {backgroundColor: '#0a2536', borderRadius: 10, marginBottom: 12, overflow: 'hidden'},
    artMock: {height: 180, backgroundColor: '#1e3a52'},
    artTitle: {color: '#F5F5F5', fontSize: 14, fontWeight: '600', padding: 8, paddingBottom: 2},
    artDate: {color: '#8ab4cc', fontSize: 12, paddingHorizontal: 8, paddingBottom: 8},

    descEditBlock: {width: '100%', marginVertical: 6},
    descInput: {
        backgroundColor: '#0d2f45',
        color: '#F5F5F5',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#1e3a52',
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 13,
        minHeight: 60,
        textAlignVertical: 'top',
        marginBottom: 8,
    },
    descButtons: {flexDirection: 'row', gap: 8},
    descBtn: {flex: 1, borderRadius: 6, paddingVertical: 8, alignItems: 'center'},
    descBtnSave: {backgroundColor: '#1a3d5c', borderWidth: 1, borderColor: '#2e6a9e'},
    descBtnCancel: {backgroundColor: '#1a0a0a', borderWidth: 1, borderColor: '#c0392b'},
    descBtnText: {color: '#F5F5F5', fontSize: 13, fontWeight: '600'},
});
