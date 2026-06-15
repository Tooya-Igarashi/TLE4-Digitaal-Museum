import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  ScrollView,
  Dimensions,
  PanResponder,
  ActivityIndicator,
  Linking,
  Platform,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import * as api from "../../api";
import { useNavigation } from "@react-navigation/native";
import { parseCoordinates } from "./WallMarker";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.45;
const DISMISS_THRESHOLD = 80;

export default function WallBottomSheet({ wall, onClose }) {
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const [pieces, setPieces] = useState([]);
  const [loadingPieces, setLoadingPieces] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (wall) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        speed: 16,
        bounciness: 6,
      }).start();
      loadPieces(wall._id);
    }
  }, [wall]);

  const loadPieces = async (wallId) => {
    setLoadingPieces(true);
    try {
      const data = await api.getPiecesByWall(wallId);
      setPieces(data || []);
    } catch (e) {
      console.warn("Could not load pieces for wall:", e.message);
      setPieces([]);
    } finally {
      setLoadingPieces(false);
    }
  };

  const openInMaps = () => {
    const coords = parseCoordinates(wall.coordinates);
    if (!coords) return;

    const { latitude, longitude } = coords;
    const label = encodeURIComponent(wall.wallName || wall.cityName || "Wall");

    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${label})`,
    });

    Linking.openURL(url).catch(() => {
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
      );
    });
  };

  const dismiss = () => {
    Animated.timing(translateY, {
      toValue: SHEET_HEIGHT,
      duration: 280,
      useNativeDriver: true,
    }).start(() => onClose?.());
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        gestureState.dy > 8 &&
        Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > DISMISS_THRESHOLD || gestureState.vy > 1.2) {
          dismiss();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            speed: 20,
            bounciness: 8,
          }).start();
        }
      },
    }),
  ).current;

  if (!wall) return null;

  const isLegal = wall.isLegal;
  const accentColor = isLegal ? "#00F5D4" : "#FF4D6D";

  return (
    <>
      <Pressable style={styles.backdrop} onPress={dismiss} />

      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
        <View {...panResponder.panHandlers} style={styles.handleArea}>
          <View style={styles.handle} />
        </View>

        <Pressable style={styles.closeBtn} onPress={dismiss}>
          <Ionicons
            name="close"
            size={20}
            color="rgba(255,255,255,0.5)"
            backgroundColor="rgba(255, 0, 0, 0.5)"
          />
        </Pressable>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          <View style={styles.headerRow}>
            <View style={styles.titleBlock}>
              <Text style={styles.city}>
                {wall.wallName || wall.cityName || "Onbekend"}
              </Text>
              {wall.regionName ? (
                <Text style={styles.region}>
                  {wall.cityName}
                  {wall.location?.regionName
                    ? ` • ${wall.location.regionName}`
                    : ""}
                </Text>
              ) : null}
            </View>
          </View>

          <View style={styles.descriptionRow}>
            {wall.description ? (
              <Text style={styles.description}>{wall.description}</Text>
            ) : null}
            <View style={[styles.legalBadge, { backgroundColor: accentColor }]}>
              <Text style={styles.legalBadgeText}>
                {isLegal ? "✓ Legaal" : "✗ Illegaal"}
              </Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <Pressable
              style={styles.locationButton}
              onPress={() => {
                navigation.navigate("LocationPage", { wall });
              }}
            >
              <Ionicons name="navigate" size={18} color="#071c21" />
              <Text style={styles.locationButtonText}>Ga naar locatie</Text>
            </Pressable>

            <Pressable style={styles.mapsButton} onPress={openInMaps}>
              <Ionicons name="map-outline" size={18} color="#00F5D4" />
            </Pressable>
          </View>

          <View style={styles.metaRow}>
            {wall.hasRoute != null && (
              <View style={styles.metaChip}>
                <MaterialIcons
                  name="directions"
                  size={14}
                  color="rgba(255,255,255,0.6)"
                />
                <Text style={styles.metaText}>
                  {wall.hasRoute ? "Route beschikbaar" : "Geen route"}
                </Text>
              </View>
            )}
            <View style={styles.metaChip}>
              <MaterialIcons
                name="image"
                size={14}
                color="rgba(255,255,255,0.6)"
              />
              <Text style={styles.metaText}>
                {loadingPieces
                  ? "..."
                  : `${pieces.length} ${pieces.length === 1 ? "werk" : "werken"}`}
              </Text>
            </View>
          </View>

          {loadingPieces ? (
            <ActivityIndicator color="#006494" style={{ marginTop: 20 }} />
          ) : pieces.length > 0 ? (
            <View style={styles.piecesSection}>
              <Text style={styles.sectionTitle}>Kunstwerken</Text>
              {pieces.slice(0, 5).map((piece) => (
                <View key={piece._id} style={styles.pieceRow}>
                  <View
                    style={[styles.pieceDot, { backgroundColor: accentColor }]}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.pieceTitle} numberOfLines={1}>
                      {piece.title || "Naamloos"}
                    </Text>
                    {piece.user?.username ? (
                      <Text style={styles.pieceArtist} numberOfLines={1}>
                        {piece.user.username}
                      </Text>
                    ) : null}
                    {piece.graffitiStyle?.graffitiStyleName ? (
                      <Text style={styles.pieceStyle}>
                        {piece.graffitiStyle.graffitiStyleName}
                      </Text>
                    ) : null}
                  </View>
                  {piece.date ? (
                    <Text style={styles.pieceDate}>
                      {new Date(piece.date).getFullYear()}
                    </Text>
                  ) : null}
                </View>
              ))}
              {pieces.length > 5 && (
                <Text style={styles.morePieces}>
                  +{pieces.length - 5} meer werken
                </Text>
              )}
            </View>
          ) : null}

          <View style={{ height: 32 }} />
        </ScrollView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 10,
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: "#0d2b35",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 10,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "rgba(0,245,212,0.15)",
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
  },
  handleArea: {
    paddingVertical: 12,
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  closeBtn: {
    position: "absolute",
    top: 14,
    right: 16,
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  titleBlock: {
    flex: 1,
    marginRight: 12,
  },
  city: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
  region: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 14,
    marginTop: 2,
  },
  legalBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderTopRightRadius: 4,
    flexShrink: 0,
  },
  legalBadgeText: {
    color: "#071c21",
    fontSize: 13,
    fontWeight: "800",
  },
  descriptionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
  },
  description: {
    flex: 1,
    color: "rgba(255,255,255,0.65)",
    fontSize: 14,
    lineHeight: 21,
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
    flexWrap: "wrap",
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.07)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  metaText: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
  },
  piecesSection: {
    gap: 2,
  },
  sectionTitle: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  pieceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  pieceDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  pieceTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  pieceArtist: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    marginTop: 1,
    fontWeight: "600",
  },
  pieceStyle: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    marginTop: 1,
  },
  pieceDate: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 12,
  },
  morePieces: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  locationButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#00F5D4",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  locationButtonText: {
    color: "#071c21",
    fontWeight: "800",
    fontSize: 15,
  },
  mapsButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "rgba(0,245,212,0.3)",
    backgroundColor: "rgba(0,245,212,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
});
