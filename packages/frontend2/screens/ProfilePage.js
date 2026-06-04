import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function ProfilePage({onBackHome}) {
    const insets = useSafeAreaInsets();
    const user = {
        name: 'Ali Bonbali',
        bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse non sapien faucibus felis ultrices mollis at in ipsum. Nullam sem metus, placerat eget eros a, placerat posuere leo. Maecenas imperdiet malesuada ante fermentum placerat.',
    };

    const artworks = [
        {id: 1, title: '', color: '#ff6fb1'},
        {id: 2, title: '', color: '#43c7e8'},
    ];

    const handleEditProfile = () => {
        alert('Bewerk profiel komt hier later');
    };

    const handleAddArtwork = () => {
        alert('Voeg artwork toe');
    };

    return (
        //
        <View style={[styles.container, {paddingBottom: insets.bottom}]}>
            <StatusBar style="light"/>
            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.profileSection}>
                    <View style={styles.profileCard}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>👤</Text>
                        </View>

                        <View style={styles.profileTextBlock}>
                            <Text style={styles.name}>{user.name}</Text>
                            <Text style={styles.bio}>{user.bio}</Text>
                        </View>

                        <TouchableOpacity style={styles.cardEditButton} onPress={handleEditProfile}>
                            <Text style={styles.cardEditText}>Bewerken 🔧</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                        <Text style={styles.buttonText}>Bewerken</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.editButton} onPress={handleAddArtwork}>
                        <Text style={styles.buttonText}>Toevoegen +</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.gallerySection}>
                    <Text style={styles.gallerySectionTitle}>Mijn werken</Text>
                    {artworks.map((artwork) => (
                        <View key={artwork.id} style={styles.galleryCard}>
                            <View style={[styles.artMock, {backgroundColor: artwork.color}]}>
                                <Text style={styles.artTitle}>{artwork.title}</Text>
                            </View>
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
    container: {
        flex: 1,
        backgroundColor: '#08202A',
    },
    scrollContent: {
        flex: 1,
        paddingTop: 20,
    },
    topIcon: {
        color: '#fff',
        fontSize: 24,
        width: 30,
        textAlign: 'center',
    },
    logo: {
        color: '#d0e8ef',
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 1,
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
    logoutButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        display: 'none',
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




