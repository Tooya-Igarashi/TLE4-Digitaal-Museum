import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import MapView, {Marker} from "react-native-maps";
import {
    useFonts,
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_900Black,
} from "@expo-google-fonts/montserrat";
import * as api from "../api";
import CloseButton from "../components/Shared/CloseButton";

const {width: SCREEN_WIDTH} = Dimensions.get("window");

export default function LocationPage({route, navigation}) {
    const {wall} = route.params;
    const [pieces, setPieces] = useState([]);
    const [loading, setLoading] = useState(true);

    const [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_600SemiBold,
        Montserrat_900Black,
    });

    const [latitude, longitude] = wall.coordinates
        .split(",")
        .map((item) => Number(item.trim()));

    useEffect(() => {
        fetchPieces();
    }, []);

    const fetchPieces = async () => {
        try {
            setLoading(true);
            const data = await api.getPiecesByWall(wall._id);
            setPieces(Array.isArray(data) ? data : []);
        } catch (err) {
            console.warn("Could not load pieces:", err.message);
            setPieces([]);
        } finally {
            setLoading(false);
        }
    };

    if (!fontsLoaded) return null;

    return (
        <View style={styles.container}>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Map */}
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude,
                            longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        <Marker coordinate={{latitude, longitude}}/>
                    </MapView>
                </View>

                {/* Wall info */}
                <View style={styles.infoContainer}>
                    <Text style={styles.wallName}>{wall.wallName}</Text>
                    <Text style={styles.cityName}>{wall.cityName}</Text>
                    <Text style={styles.description}>{wall.description}</Text>
                </View>

                {/* Kunstwerken */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Kunstwerken</Text>

                    {loading ? (
                        <ActivityIndicator color="#00F5D4" style={{marginTop: 20}}/>
                    ) : pieces.length === 0 ? (
                        <Text style={styles.emptyText}>Geen kunstwerken gevonden.</Text>
                    ) : (
                        pieces.map((piece) => {
                            const imageUri = api.toAbsolute(piece.image);
                            return (
                                <View key={piece._id} style={styles.pieceCard}>
                                    <View style={styles.imageContainer}>
                                        <Image
                                            source={{uri: imageUri}}
                                            style={styles.pieceImage}
                                            resizeMode="cover"
                                        />
                                        {piece.date && (
                                            <View style={styles.dateOverlay}>
                                                <Text style={styles.dateText}>
                                                    {new Date(piece.date).toLocaleDateString("nl-NL", {
                                                        day: "numeric",
                                                        month: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={styles.pieceInfo}>
                                        <Text style={styles.pieceTitle} numberOfLines={1}>
                                            {piece.title || "Naamloos"}
                                        </Text>
                                        <Text style={styles.pieceDescription} numberOfLines={3}>
                                            {piece.description}
                                        </Text>
                                        {piece.user?.username && (
                                            <Text style={styles.artistLabel}>
                                                Door{" "}
                                                <Text style={styles.artistName}>
                                                    {piece.user.username}
                                                </Text>
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            );
                        })
                    )}
                </View>

                {/* Ga naar Digitale Museum button */}
                <TouchableOpacity
                    style={styles.museumButton}
                    onPress={() =>
                        navigation.navigate("DigitalMuseum", {wallId: wall._id})
                    }
                >
                    <Text style={styles.museumButtonText}>Ga naar Digitale Museum</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* Sticky close button */}
            <CloseButton onPress={() => navigation.goBack()}/>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#071c21",
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 120,
    },

    // Map
    mapContainer: {
        height: 250,
        width: "100%",
    },
    map: {
        flex: 1,
    },

    // Wall info
    infoContainer: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.08)",
    },
    wallName: {
        color: "#fff",
        fontSize: 28,
        fontFamily: "Montserrat_900Black",
        marginBottom: 4,
    },
    cityName: {
        color: "#00F5D4",
        fontSize: 15,
        fontFamily: "Montserrat_600SemiBold",
        marginBottom: 12,
    },
    description: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 14,
        fontFamily: "Montserrat_400Regular",
        lineHeight: 22,
    },

    // Kunstwerken
    section: {
        padding: 20,
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 22,
        fontFamily: "Montserrat_900Black",
        marginBottom: 16,
    },
    emptyText: {
        color: "rgba(255,255,255,0.4)",
        fontSize: 14,
        fontFamily: "Montserrat_400Regular",
        textAlign: "center",
        marginTop: 20,
    },

    // Piece card
    pieceCard: {
        backgroundColor: "#0d2b35",
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "rgba(0,245,212,0.1)",
    },
    imageContainer: {
        width: "100%",
        height: 200,
        position: "relative",
    },
    pieceImage: {
        width: "100%",
        height: "100%",
    },
    dateOverlay: {
        position: "absolute",
        bottom: 10,
        right: 10,
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    dateText: {
        color: "#fff",
        fontSize: 12,
        fontFamily: "Montserrat_600SemiBold",
    },
    pieceInfo: {
        padding: 16,
    },
    pieceTitle: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Montserrat_900Black",
        marginBottom: 6,
    },
    pieceDescription: {
        color: "rgba(255,255,255,0.6)",
        fontSize: 13,
        fontFamily: "Montserrat_400Regular",
        lineHeight: 20,
        marginBottom: 10,
    },
    artistLabel: {
        color: "rgba(255,255,255,0.5)",
        fontSize: 12,
        fontFamily: "Montserrat_400Regular",
    },
    artistName: {
        color: "#00F5D4",
        fontFamily: "Montserrat_600SemiBold",
    },

    // Museum button
    museumButton: {
        marginHorizontal: 20,
        marginTop: 8,
        height: 54,
        borderRadius: 16,
        backgroundColor: "#006494",
        alignItems: "center",
        justifyContent: "center",
    },
    museumButtonText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Montserrat_900Black",
    },
});