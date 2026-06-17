import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function ProfileScreen() {
    return (
        <View style={styles.container}>
            <StatusBar style="light"/>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}>

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
                        <Text style={styles.small}>Description: {user?.desc}</Text>
                        <Text style={styles.small}>Premium: {user?.premium ? "Ja" : "Nee"}</Text>
                    </View>
                </View>

                {/* BUTTONS */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.actionBtn}>
                        <Text style={styles.actionBtnText}>Bewerk Profiel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionBtn, styles.logoutBtn]}
                        onPress={handleLogout}
                    >
                        <Text style={[styles.actionBtnText, styles.logoutBtnText]}>Uitloggen</Text>
                    </TouchableOpacity>
                </View>

                {/*link naar graffiti werk uploaden */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => navigation.navigate("UploadPage", {userId, accessToken})}
                    >
                        <Text style={styles.actionBtnText}>Nieuw werk uploaden</Text>
                    </TouchableOpacity>
                </View>

                {/*graffiti werk updaten */}
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
                        <TouchableOpacity style={styles.actionBtn}>
                            <Text style={styles.actionBtnText}>Bewerk werk</Text>
                        </TouchableOpacity>
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
    scroll: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 60,
    },
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
    profileTextBlock: {alignItems: 'center'},
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
    buttonRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 24,
    },
    actionBtn: {
        flex: 1,
        backgroundColor: '#0a2536',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1e3a52',
    },
    actionBtnText: {
        color: '#F5F5F5',
        fontSize: 14,
        fontWeight: '600',
    },
    logoutBtn: {
        borderColor: '#c0392b',
        backgroundColor: '#1a0a0a',
    },
    logoutBtnText: {
        color: '#e74c3c',
    },
    sectionTitle: {
        color: '#F5F5F5',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    emptyText: {
        color: '#8ab4cc',
        marginBottom: 10,
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
    artTitle: {
        color: '#F5F5F5',
        fontSize: 14,
        fontWeight: '600',
        padding: 8,
        paddingBottom: 2,
    },
    artDate: {
        color: '#8ab4cc',
        fontSize: 12,
        paddingHorizontal: 8,
        paddingBottom: 8,
    },
});