import React, {useEffect, useState, useRef} from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    PanResponder,
} from "react-native";
import MapView from "react-native-maps";
import WallMarker from "../components/map/WallMarker";
import {Picker} from "@react-native-picker/picker";
import {
    useFonts,
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_900Black,
} from "@expo-google-fonts/montserrat";
import * as api from "../api";
import CloseButton from "../components/Shared/CloseButton";

const {width: SCREEN_WIDTH} = Dimensions.get("window");

// Timeline config — Jan 2020 to current date
const START_YEAR = 2020;
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from(
    {length: CURRENT_YEAR - START_YEAR + 1},
    (_, i) => START_YEAR + i
);

const MONTHS = [
    "Januari", "Februari", "Maart", "April", "Mei", "Juni",
    "Juli", "Augustus", "September", "Oktober", "November", "December"
];

const PIECES_PER_PAGE = 5;
const TIMELINE_PADDING = 20;
const TIMELINE_WIDTH = SCREEN_WIDTH - TIMELINE_PADDING * 2;

export default function LocationPage({route, navigation}) {
    // Get the wall object passed from WallBottomSheet via navigation params
    const {wall} = route.params;
    const [pieces, setPieces] = useState([]);
    const [loading, setLoading] = useState(true);

    // Timeline and filter state
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [dotPosition, setDotPosition] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const timelineRef = useRef(null);

    const [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_600SemiBold,
        Montserrat_900Black,
    });

    // Parse coordinates string "lat, lng" into separate numbers for MapView
    const [latitude, longitude] = wall.coordinates
        .split(",")
        .map((item) => Number(item.trim()));

    // Fetch pieces for this wall when the page loads
    useEffect(() => {
        fetchPieces();
    }, []);

    // Reset to page 1 when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedYear, selectedMonth]);

    // Fetch all pieces linked to this specific wall from the backend
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

    // Sort pieces — selected year/month first, then rest by date descending
    const getSortedPieces = () => {
        if (!selectedYear) return pieces;

        const matching = [];
        const rest = [];

        pieces.forEach((piece) => {
            if (!piece.date) {
                rest.push(piece);
                return;
            }
            const date = new Date(piece.date);
            const yearMatch = date.getFullYear() === selectedYear;
            const monthMatch = selectedMonth === null || date.getMonth() === selectedMonth;

            if (yearMatch && monthMatch) {
                matching.push(piece);
            } else {
                rest.push(piece);
            }
        });

        // Sort matching by date descending
        matching.sort((a, b) => new Date(b.date) - new Date(a.date));
        rest.sort((a, b) => new Date(b.date) - new Date(a.date));

        return [...matching, ...rest];
    };

    const sortedPieces = getSortedPieces();
    const totalPages = Math.ceil(sortedPieces.length / PIECES_PER_PAGE);
    const paginatedPieces = sortedPieces.slice(
        (currentPage - 1) * PIECES_PER_PAGE,
        currentPage * PIECES_PER_PAGE
    );

    // Calculate dot X position from year
    const yearToDotX = (year) => {
        const index = year - START_YEAR;
        return (index / (YEARS.length - 1)) * TIMELINE_WIDTH;
    };

    // Calculate year from dot X position
    const dotXToYear = (x) => {
        const clamped = Math.max(0, Math.min(x, TIMELINE_WIDTH));
        const index = Math.round((clamped / TIMELINE_WIDTH) * (YEARS.length - 1));
        return YEARS[index];
    };

    // Handle dot drag on timeline
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (e) => {
                const x = e.nativeEvent.locationX - TIMELINE_PADDING;
                const year = dotXToYear(x);
                setSelectedYear(year);
                setDotPosition(yearToDotX(year));
            },
            onPanResponderMove: (e) => {
                const x = e.nativeEvent.locationX - TIMELINE_PADDING;
                const year = dotXToYear(x);
                setSelectedYear(year);
                setDotPosition(yearToDotX(year));
            },
        })
    ).current;

    // Handle tap on timeline to jump to year
    const handleTimelineTap = (e) => {
        const x = e.nativeEvent.locationX - TIMELINE_PADDING;
        const year = dotXToYear(x);
        setSelectedYear(year);
        setDotPosition(yearToDotX(year));
    };

    // Handle year picker change — also moves dot
    const handleYearChange = (year) => {
        if (!year) {
            setSelectedYear(null);
            setDotPosition(0);
            return;
        }
        setSelectedYear(year);
        setDotPosition(yearToDotX(year));
    };

    // Wait for fonts to load before rendering
    if (!fontsLoaded) return null;

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Map showing the wall's location with a marker */}
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
                        {/* Reusing WallMarker component from map page for consistent styling */}
                        <WallMarker wall={wall}/>
                    </MapView>
                </View>

                {/* Timeline */}
                <View style={styles.timelineContainer}>

                    {/* Timeline track and dot */}
                    <View
                        style={styles.timelineTrack}
                        {...panResponder.panHandlers}
                        onTouchEnd={handleTimelineTap}
                    >
                        {/* Purple line */}
                        <View style={styles.timelineLine}/>

                        {/* Year tick marks */}
                        {YEARS.map((year, index) => {
                            const x = (index / (YEARS.length - 1)) * TIMELINE_WIDTH;
                            return (
                                <View
                                    key={year}
                                    style={[styles.timelineTick, {left: x}]}
                                />
                            );
                        })}

                        {/* Draggable dot */}
                        <View
                            style={[
                                styles.timelineDot,
                                {left: selectedYear ? dotPosition : 0},
                            ]}
                        />
                    </View>

                    {/* Year labels */}
                    <View style={styles.timelineLabels}>
                        <Text style={styles.timelineLabel}>Jan {START_YEAR}</Text>
                        <Text style={styles.timelineLabel}>{CURRENT_YEAR}</Text>
                    </View>

                    {/* Selected year indicator */}
                    {selectedYear && (
                        <Text style={styles.selectedYearText}>
                            {selectedYear}{selectedMonth !== null ? ` — ${MONTHS[selectedMonth]}` : ""}
                        </Text>
                    )}

                    {/* Year picker */}
                    <View style={styles.pickerRow}>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedYear}
                                onValueChange={handleYearChange}
                                style={styles.picker}
                                dropdownIconColor="#00F5D4"
                            >
                                <Picker.Item label="Alle jaren" value={null} color="#fff"/>
                                {YEARS.map((year) => (
                                    <Picker.Item
                                        key={year}
                                        label={String(year)}
                                        value={year}
                                        color="#fff"
                                    />
                                ))}
                            </Picker>
                        </View>

                        {/* Month picker */}
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedMonth}
                                onValueChange={(val) => setSelectedMonth(val)}
                                style={styles.picker}
                                dropdownIconColor="#00F5D4"
                            >
                                <Picker.Item label="Alle maanden" value={null} color="#fff"/>
                                {MONTHS.map((month, index) => (
                                    <Picker.Item
                                        key={month}
                                        label={month}
                                        value={index}
                                        color="#fff"
                                    />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    {/* Reset filter button */}
                    {selectedYear && (
                        <TouchableOpacity
                            style={styles.resetButton}
                            onPress={() => {
                                setSelectedYear(null);
                                setSelectedMonth(null);
                                setDotPosition(0);
                            }}
                        >
                            <Text style={styles.resetButtonText}>Filter wissen</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Wall details — name, city and description */}
                <View style={styles.infoContainer}>
                    <Text style={styles.wallName}>{wall.wallName}</Text>
                    <Text style={styles.cityName}>{wall.cityName}</Text>
                    <Text style={styles.description}>{wall.description}</Text>
                </View>

                {/* Kunstwerken section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Kunstwerken</Text>

                    {loading ? (
                        <ActivityIndicator color="#00F5D4" style={{marginTop: 20}}/>
                    ) : pieces.length === 0 ? (
                        <Text style={styles.emptyText}>Geen kunstwerken gevonden.</Text>
                    ) : (
                        <>
                            {/* Pagination — above first piece */}
                            {totalPages > 1 && (
                                <View style={styles.pagination}>
                                    {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                                        <TouchableOpacity
                                            key={page}
                                            style={[
                                                styles.pageBtn,
                                                currentPage === page && styles.pageBtnActive,
                                            ]}
                                            onPress={() => setCurrentPage(page)}
                                        >
                                            <Text
                                                style={[
                                                    styles.pageBtnText,
                                                    currentPage === page && styles.pageBtnTextActive,
                                                ]}
                                            >
                                                {page}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            {/* No pieces for selected period */}
                            {selectedYear && paginatedPieces.every(p => {
                                if (!p.date) return true;
                                const date = new Date(p.date);
                                const yearMatch = date.getFullYear() === selectedYear;
                                const monthMatch = selectedMonth === null || date.getMonth() === selectedMonth;
                                return !(yearMatch && monthMatch);
                            }) && (
                                <Text style={styles.noMatchText}>
                                    Geen kunstwerken gevonden
                                    voor {selectedYear}{selectedMonth !== null ? ` — ${MONTHS[selectedMonth]}` : ""}.
                                    Andere werken worden hieronder getoond.
                                </Text>
                            )}

                            {/* Piece cards */}
                            {paginatedPieces.map((piece) => {
                                const imageUri = api.toAbsolute(piece.image);
                                const isHighlighted = selectedYear && piece.date &&
                                    new Date(piece.date).getFullYear() === selectedYear &&
                                    (selectedMonth === null || new Date(piece.date).getMonth() === selectedMonth);

                                return (
                                    <View
                                        key={piece._id}
                                        style={[
                                            styles.pieceCard,
                                            isHighlighted && styles.pieceCardHighlighted,
                                        ]}
                                    >
                                        {/* Piece image with date overlay in bottom right */}
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

                                        {/* Piece title, description and artist name */}
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
                            })}

                            {/* Pagination — below last piece */}
                            {totalPages > 1 && (
                                <View style={styles.pagination}>
                                    {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                                        <TouchableOpacity
                                            key={page}
                                            style={[
                                                styles.pageBtn,
                                                currentPage === page && styles.pageBtnActive,
                                            ]}
                                            onPress={() => setCurrentPage(page)}
                                        >
                                            <Text
                                                style={[
                                                    styles.pageBtnText,
                                                    currentPage === page && styles.pageBtnTextActive,
                                                ]}
                                            >
                                                {page}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </>
                    )}
                </View>

                {/*
                    Navigate to Digital Museum filtered by this wall.
                    Passes wallId so DigitalMuseumPage only shows pieces for this wall.
                    wallId is cleared when the user leaves DigitalMuseumPage.
                */}
                <TouchableOpacity
                    style={styles.museumButton}
                    onPress={() =>
                        navigation.navigate("Main", {
                            screen: "DigitalMuseum",
                            params: {wallId: wall._id, userId: null, accessToken: null}
                        })
                    }
                >
                    <Text style={styles.museumButtonText}>Ga naar Digital Museum</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* Sticky close button — always visible at bottom, navigates back to map */}
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

    // Timeline
    timelineContainer: {
        paddingHorizontal: TIMELINE_PADDING,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.08)",
    },
    timelineTrack: {
        height: 40,
        justifyContent: "center",
        marginBottom: 4,
    },
    timelineLine: {
        position: "absolute",
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: "#7B2FBE",
    },
    timelineTick: {
        position: "absolute",
        width: 1,
        height: 10,
        backgroundColor: "#7B2FBE",
        top: "50%",
        marginTop: -5,
    },
    timelineDot: {
        position: "absolute",
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: "#00F5D4",
        top: "50%",
        marginTop: -8,
        marginLeft: -8,
    },
    timelineLabels: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    timelineLabel: {
        color: "rgba(255,255,255,0.5)",
        fontSize: 11,
        fontFamily: "Montserrat_400Regular",
    },
    selectedYearText: {
        color: "#00F5D4",
        fontSize: 14,
        fontFamily: "Montserrat_600SemiBold",
        textAlign: "center",
        marginBottom: 12,
    },
    pickerRow: {
        flexDirection: "row",
        gap: 10,
    },
    pickerContainer: {
        flex: 1,
        backgroundColor: "#0d2b35",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(0,245,212,0.2)",
        overflow: "hidden",
    },
    picker: {
        color: "#fff",
        backgroundColor: "#0d2b35",
    },
    resetButton: {
        marginTop: 10,
        alignSelf: "center",
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
    },
    resetButtonText: {
        color: "rgba(255,255,255,0.5)",
        fontSize: 12,
        fontFamily: "Montserrat_400Regular",
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
    noMatchText: {
        color: "rgba(255,255,255,0.4)",
        fontSize: 13,
        fontFamily: "Montserrat_400Regular",
        textAlign: "center",
        marginBottom: 16,
        lineHeight: 20,
    },

    // Pagination
    pagination: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 16,
    },
    pageBtn: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: "#0d2b35",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(0,245,212,0.2)",
    },
    pageBtnActive: {
        backgroundColor: "#00F5D4",
        borderColor: "#00F5D4",
    },
    pageBtnText: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 13,
        fontFamily: "Montserrat_600SemiBold",
    },
    pageBtnTextActive: {
        color: "#071c21",
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
    pieceCardHighlighted: {
        borderColor: "#00F5D4",
        borderWidth: 2,
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
        backgroundColor: "#00F5D4",
        alignItems: "center",
        justifyContent: "center",
    },
    museumButtonText: {
        color: "#071c21",
        fontSize: 16,
        fontFamily: "Montserrat_900Black",
    },
});