import React, { useState, useEffect, useRef, useCallback } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
  Animated,
  StatusBar,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";
import Constants from "expo-constants";
import { useFocusEffect } from "@react-navigation/native";

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === "web") {
    return "http://localhost:8000";
  }
  const host = Constants.expoConfig?.hostUri?.split(":")[0];
  return `http://${host}:8000`;
};

const BASE_URL = getBaseUrl();
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const MAX_HISTORY = 4;

export default function MuseumPage({ navigation, route }) {
  // Get userId, accessToken for upload navigation and wallId for optional wall filter.
// wallId is only passed when navigating from LocationPage.
  const {userId, accessToken, wallId} = route.params ?? {};

// Store wallId in a ref so it persists during the session but doesn't cause re-renders.
// Using a ref instead of state prevents unnecessary re-fetches.
  const initialWallId = useRef(wallId);
  const [pieces, setPieces] = useState([]);
  const [filteredPieces, setFilteredPieces] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [graffitiStyles, setGraffitiStyles] = useState([]);

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
  });

  const filterAnim = useRef(new Animated.Value(0)).current;
  const imageScaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchPieces();
    fetchGraffitiStyles();
  }, []);

  useFocusEffect(
      React.useCallback(() => {
        // Fetch pieces and styles every time this screen comes into focus
        fetchPieces();
        fetchGraffitiStyles();

        // Cleanup: when the user leaves this screen, clear the wall filter
        // so that next time they open Digital Museum it shows all pieces
        return () => {
          initialWallId.current = null;
        };
      }, []),
  );

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedStyle, pieces]);

  useEffect(() => {
    Animated.timing(filterAnim, {
      toValue: showFilterDropdown ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [showFilterDropdown]);

  const fetchPieces = async () => {
    try {
      setLoading(true);
      // If wallId exists, fetch only pieces for that wall (came from LocationPage)
      // Otherwise fetch all pieces (came from tab bar or home)
      const url = initialWallId.current
          ? `${BASE_URL}/pieces/wall/${initialWallId.current}`
          : `${BASE_URL}/pieces`;
      const res = await fetch(url, {
        headers: { "x-api-key": process.env.EXPO_PUBLIC_API_KEY },
      });
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setPieces(list);
      setFilteredPieces(list);
    } catch (err) {
      console.error("Failed to fetch pieces:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGraffitiStyles = async () => {
    try {
      const res = await fetch(`${BASE_URL}/graffiti-styles`, {
        headers: { "x-api-key": process.env.EXPO_PUBLIC_API_KEY },
      });
      const data = await res.json();
      setGraffitiStyles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch graffiti styles:", err);
    }
  };

  const applyFilters = () => {
    let results = [...pieces];
    const q = searchQuery.toLowerCase().trim();

    if (q) {
      results = results.filter((p) => {
        const year = p.date ? new Date(p.date).getFullYear().toString() : "";
        const month = p.date
          ? new Date(p.date)
              .toLocaleString("nl-NL", { month: "long" })
              .toLowerCase()
          : "";
        const artistName = p.user?.username?.toLowerCase() || "";
        const style = (
          p.graffitiStyle?.name ??
          p.graffitiStyle?.graffitiStyleName ??
          ""
        )?.toLowerCase();
        return (
          year.includes(q) ||
          month.includes(q) ||
          artistName.includes(q) ||
          style.includes(q)
        );
      });
    }

    if (selectedStyle) {
      results = results.filter(
        (p) =>
          (
            p.graffitiStyle?.name ??
            p.graffitiStyle?.graffitiStyleName ??
            ""
          )?.toLowerCase() === selectedStyle.toLowerCase(),
      );
    }

    setFilteredPieces(results);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleSearchSubmit = () => {
    const q = searchQuery.trim();
    if (!q) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((h) => h !== q);
      return [q, ...filtered].slice(0, MAX_HISTORY);
    });
  };

  const handleHistoryTap = (item) => {
    setSearchQuery(item);
  };

  const openImage = (piece) => {
    setSelectedImage(piece);
    imageScaleAnim.setValue(0);
    Animated.spring(imageScaleAnim, {
      toValue: 1,
      friction: 7,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };

  const closeImage = () => {
    Animated.timing(imageScaleAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => setSelectedImage(null));
  };

  const handleLocationPress = (piece) => {
    if (!piece?.wall?.coordinates) return;
    const [lat, lng] = piece.wall.coordinates.split(",").map((s) => s.trim());
    navigation.navigate("MapPage", {
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      wallName: piece.wall?.wallName,
    });
  };

  const handleArtistPress = (piece) => {
    if (!piece?.user?._id) return;
    navigation.navigate("ProfilePage", { userId: piece.user._id });
  };

  const handleAddPress = () => {
    navigation.navigate("UploadPage", { userId, accessToken });
  };

  const selectStyle = (style) => {
    setSelectedStyle((prev) => (prev === style ? null : style));
    setShowFilterDropdown(false);
  };
  const renderPiece = ({ item, index }) => {
    const isEven = index % 2 === 0;

    const gradientStart = isEven ? { x: 0.3, y: 0 } : { x: 1, y: 1 };
    const gradientEnd = isEven ? { x: 1, y: 0.3 } : { x: 0, y: 0 };

    const rotation = isEven ? "5deg" : "-5deg";

    return (
      <LinearGradient
        colors={[
          "rgba(245,245,245,0.50)",
          "rgba(0,100,148,0.70)",
          "rgba(0,31,46,1)",
        ]}
        locations={[0.2, 0.6, 1]}
        start={gradientStart}
        end={gradientEnd}
        style={styles.pieceCard}
      >
        {isEven ? (
          <>
            <TouchableOpacity
              style={styles.imageWrapper}
              activeOpacity={0.9}
              onPress={() => openImage(item)}
            >
              <View
                style={[
                  styles.imageBackground,
                  {
                    transform: [{ rotate: rotation }],
                  },
                ]}
              />
              <View style={{ transform: [{ rotate: rotation }] }}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.pieceImage}
                  resizeMode="cover"
                />

                <Ionicons
                  name="expand-outline"
                  size={22}
                  color="#F5F5F5"
                  style={styles.expandIcon}
                />
              </View>
            </TouchableOpacity>
            <View style={styles.pieceInfo}>
              <Text style={styles.pieceDescription} numberOfLines={5}>
                {item.description}
              </Text>
              {item.date && (
                <View style={styles.metaRow}>
                  <Ionicons name="calendar-outline" size={12} color="#8ab4cc" />
                  <Text style={styles.metaText}>
                    {new Date(item.date).toLocaleDateString("nl-NL", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              )}
              {(item.graffitiStyle?.name ??
              item.graffitiStyle?.graffitiStyleName) ? (
                <View style={styles.metaRow}>
                  <Ionicons
                    name="color-palette-outline"
                    size={12}
                    color="#8ab4cc"
                  />
                  <Text style={styles.styleChip}>
                    {item.graffitiStyle?.name ??
                      item.graffitiStyle?.graffitiStyleName}
                  </Text>
                </View>
              ) : null}
              <TouchableOpacity onPress={() => handleArtistPress(item)}>
                <Text style={styles.artistLabel}>
                  Ontworpen door{" "}
                  <Text style={styles.artistName}>
                    {item.user?.username || "—"}
                  </Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.locationRow}
                onPress={() => handleLocationPress(item)}
              >
                <Text style={styles.locationText}>Locatie</Text>
                <Ionicons name="map-outline" size={22} color="#F5F5F5" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.pieceInfo}>
              <Text style={styles.pieceDescription} numberOfLines={5}>
                {item.description}
              </Text>
              {item.date && (
                <View style={styles.metaRow}>
                  <Ionicons name="calendar-outline" size={12} color="#8ab4cc" />
                  <Text style={styles.metaText}>
                    {new Date(item.date).toLocaleDateString("nl-NL", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              )}
              {(item.graffitiStyle?.name ??
              item.graffitiStyle?.graffitiStyleName) ? (
                <View style={styles.metaRow}>
                  <Ionicons
                    name="color-palette-outline"
                    size={12}
                    color="#8ab4cc"
                  />
                  <Text style={styles.styleChip}>
                    {item.graffitiStyle?.name ??
                      item.graffitiStyle?.graffitiStyleName}
                  </Text>
                </View>
              ) : null}
              <TouchableOpacity onPress={() => handleArtistPress(item)}>
                <Text style={styles.artistLabel}>
                  Ontworpen door{" "}
                  <Text style={styles.artistName}>
                    {item.user?.username || "—"}
                  </Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.locationRow}
                onPress={() => handleLocationPress(item)}
              >
                <Text style={styles.locationText}>Locatie</Text>
                <Ionicons name="map-outline" size={22} color="#F5F5F5" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.imageWrapper}
              activeOpacity={0.9}
              onPress={() => openImage(item)}
            >
              <View
                style={[
                  styles.imageBackground,
                  {
                    transform: [{ rotate: isEven ? "5deg" : "-5deg" }],
                  },
                ]}
              />
              <View style={{ transform: [{ rotate: rotation }] }}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.pieceImage}
                  resizeMode="cover"
                />

                <Ionicons
                  name="expand-outline"
                  size={22}
                  color="#F5F5F5"
                  style={styles.expandIcon}
                />
              </View>
            </TouchableOpacity>
          </>
        )}
      </LinearGradient>
    );
  };

  const filterDropdownTranslateY = filterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0],
  });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d1b2a" />

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Zoek op jaar, maand, naam of stijl..."
          placeholderTextColor="#4a6080"
          value={searchQuery}
          onChangeText={handleSearch}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search history chips */}
      {searchHistory.length > 0 && (
        <View style={styles.historyRow}>
          {searchHistory.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.historyChip}
              onPress={() => handleHistoryTap(item)}
            >
              <Text style={styles.historyChipText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Filter + Toevoegen row */}
      <View style={styles.actionRow}>
        <View>
          <TouchableOpacity
            style={[styles.filterBtn, selectedStyle && styles.filterBtnActive]}
            onPress={() => setShowFilterDropdown((v) => !v)}
          >
            <Text style={styles.filterBtnText}>
              Filter {selectedStyle ? `· ${selectedStyle}` : ""}
            </Text>
          </TouchableOpacity>

          <Modal
            transparent
            visible={showFilterDropdown}
            animationType="fade"
            onRequestClose={() => setShowFilterDropdown(false)}
          >
            <TouchableOpacity
              style={styles.modalBackdrop}
              activeOpacity={1}
              onPress={() => setShowFilterDropdown(false)}
            >
              <Animated.View
                style={[
                  styles.dropdownModal,
                  {
                    opacity: filterAnim,
                    transform: [{ translateY: filterDropdownTranslateY }],
                  },
                ]}
              >
                <ScrollView
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}
                >
                  {graffitiStyles.map((style) => {
                    const name =
                      style?.name ?? style?.graffitiStyleName ?? String(style);
                    return (
                      <TouchableOpacity
                        key={name}
                        style={[
                          styles.dropdownItem,
                          selectedStyle === name && styles.dropdownItemActive,
                        ]}
                        onPress={() => selectStyle(name)}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            selectedStyle === name &&
                              styles.dropdownItemTextActive,
                          ]}
                        >
                          {name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </Animated.View>
            </TouchableOpacity>
          </Modal>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleAddPress}>
          <Text style={styles.addBtnText}>Toevoegen +</Text>
        </TouchableOpacity>
      </View>

      {/* Pieces list */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Laden...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPieces}
          keyExtractor={(item) => item._id?.toString()}
          renderItem={renderPiece}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Geen pieces gevonden.</Text>
          }
        />
      )}

      {/* Fullscreen image modal */}
      <Modal
        visible={!!selectedImage}
        transparent
        animationType="none"
        onRequestClose={closeImage}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeImage}
        >
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ scale: imageScaleAnim }],
                opacity: imageScaleAnim,
              },
            ]}
          >
            {selectedImage && (
              <>
                <Image
                  source={{ uri: selectedImage.image }}
                  style={styles.fullImage}
                  resizeMode="contain"
                />
                {selectedImage.description ? (
                  <ScrollView
                    style={styles.modalDescriptionScroll}
                    contentContainerStyle={styles.modalDescriptionContent}
                    showsVerticalScrollIndicator={false}
                    onStartShouldSetResponder={() => true}
                    onTouchEnd={(e) => e.stopPropagation()}
                  >
                    <Text style={styles.modalDescription}>
                      {selectedImage.description}
                    </Text>
                  </ScrollView>
                ) : null}
              </>
            )}
            <Text style={styles.modalCloseHint}>Tik om te sluiten</Text>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    backgroundColor: "#051923",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 44,
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    marginHorizontal: 16,
    marginBottom: 15,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    color: "#051923",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    padding: 6,
  },
  clearBtn: {
    color: "#061923",
    fontSize: 14,
    paddingLeft: 8,
  },

  // History chips
  historyRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  historyChip: {
    backgroundColor: "#162436",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#1e3a52",
  },
  historyChipText: {
    color: "#8ab4cc",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },

  // Action row
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    marginBottom: 8,
    zIndex: 100,
  },
  filterBtn: {
    backgroundColor: "#F5F5F5",
    borderRadius: 5,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#1e3a52",
  },
  filterBtnActive: {
    backgroundColor: "#1E5C7E",
  },
  filterBtnText: {
    color: "#051923",
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
  },
  filterBtnTextActive: {
    color: "#F5F5F5",
  },
  addBtn: {
    backgroundColor: "#F5F5F5",
    borderRadius: 5,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderWidth: 1,
  },
  addBtnText: {
    color: "#051923",
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
  },

  // Dropdown
  dropdown: {
    position: "absolute",
    top: 40,
    left: 0,
    backgroundColor: "#F5F5F5",
    borderRadius: 5,
    width: 200,
    maxHeight: 280,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#051923",
  },
  dropdownItemActive: {
    backgroundColor: "#1E5C7E",
  },
  dropdownItemText: {
    color: "#051923",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
  },
  dropdownItemTextActive: {
    color: "#F5F5F5",
    fontFamily: "Montserrat_600SemiBold",
  },

  // List
  listContent: {
    paddingBottom: 40,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#4a6080",
    fontSize: 16,
  },
  emptyText: {
    color: "#4a6080",
    textAlign: "center",
    marginTop: 60,
    fontSize: 15,
  },

  // Piece card
  pieceCard: {
    flexDirection: "row",
    minHeight: 100,
    marginTop: 20,
    marginBottom: 10,
    overflow: "visible",
  },
  imageWrapper: {
    width: SCREEN_WIDTH * 0.45,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  imageBackground: {
    position: "absolute",
    width: 180,
    height: 180,
    backgroundColor: "#1E5C7E",
    borderRadius: 6,
    boxShadowColor: "#F5F5F5",
    boxShadowOffset: {
      width: 0,
      height: 2,
    },
    boxShadowOpacity: 0.25,
    boxShadowRadius: 8,
    elevation: 6,
  },
  pieceImage: {
    width: 150,
    height: 150,
  },
  expandIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 4,
    borderRadius: 4,
  },
  pieceInfo: {
    flex: 1,
    padding: 14,
    justifyContent: "space-between",
  },
  pieceDescription: {
    color: "#F5F5F5",
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Montserrat_400Regular",
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  metaText: {
    color: "#8ab4cc",
    fontSize: 10,
    fontFamily: "Montserrat_400Regular",
  },
  styleChip: {
    color: "#F5F5F5",
    fontSize: 10,
    fontFamily: "Montserrat_600SemiBold",
    backgroundColor: "rgba(30,92,126,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  artistLabel: {
    color: "#F5F5F5",
    fontSize: 10,
    marginBottom: 8,
  },
  artistName: {
    color: "#FFFF00",
    fontFamily: "Montserrat_600SemiBold",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    color: "#F5F5F5",
    fontSize: 10,
    marginRight: 4,
  },
  locationIcon: {
    fontSize: 22,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(5, 12, 20, 0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  fullImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.75,
  },
  modalDescriptionScroll: {
    width: SCREEN_WIDTH,
    maxHeight: SCREEN_HEIGHT * 0.18,
    marginTop: 12,
    paddingHorizontal: 20,
  },
  modalDescriptionContent: {
    paddingBottom: 4,
  },
  modalDescription: {
    color: "#F5F5F5",
    fontSize: 13,
    lineHeight: 20,
    fontFamily: "Montserrat_400Regular",
    textAlign: "center",
  },
  modalCloseHint: {
    color: "#4a6080",
    fontSize: 12,
    marginTop: 12,
    textAlign: "center",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "transparent",
  },
  dropdownModal: {
    position: "absolute",
    top: Platform.OS === "android" ? StatusBar.currentHeight + 120 : 160,
    left: 16,

    backgroundColor: "#F5F5F5",
    borderRadius: 5,
    width: 200,
    maxHeight: 280,

    boxShadowColor: "#000",
    boxShadowOffset: {
      width: 0,
      height: 2,
    },
    boxShadowOpacity: 0.25,
    boxShadowRadius: 4,
    elevation: 5,
  },
});
