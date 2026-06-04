import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CAROUSEL_HEIGHT = 380;

const DUMMY_HIGHLIGHTS = [
  {
    id: "1",
    uri: "https://images.unsplash.com/photo-1526318472351-c75fcf070c4f",
  },
  {
    id: "2",
    uri: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
  },
  {
    id: "3",
    uri: "https://images.unsplash.com/photo-1495567720989-cebdbdd97913",
  },
  {
    id: "4",
    uri: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  },
  {
    id: "5",
    uri: "https://images.unsplash.com/photo-1511763368359-96f4b0b2a6f3",
  },
];

const DUMMY_ARTISTS = [
  {
    id: "a1",
    name: "Ali Bombali",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    cover: "https://images.unsplash.com/photo-1503602642458-232111445657",
  },
  {
    id: "a2",
    name: "Sara M.",
    avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39",
    cover: "https://images.unsplash.com/photo-1491972690050-ba117db4dc09",
  },
  {
    id: "a3",
    name: "J. Pietersen",
    avatar: "https://images.unsplash.com/photo-1545996124-1b8e2f3a6f35",
    cover: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde",
  },
];

export default function HomePage({ navigation }) {
  const highlightsRef = useRef(null);
  const artistsRef = useRef(null);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [artistIndex, setArtistIndex] = useState(0);
  const highlightInterval = useRef(null);
  const artistInterval = useRef(null);

  const startHighlightInterval = () => {
    clearInterval(highlightInterval.current);
    highlightInterval.current = setInterval(() => {
      setHighlightIndex((prev) => {
        const next = (prev + 1) % Math.min(DUMMY_HIGHLIGHTS.length, 10);
        if (highlightsRef.current)
          highlightsRef.current.scrollTo({ x: next * width, animated: true });
        return next;
      });
    }, 5000);
  };

  const startArtistInterval = () => {
    clearInterval(artistInterval.current);
    artistInterval.current = setInterval(() => {
      setArtistIndex((prev) => {
        const next = (prev + 1) % DUMMY_ARTISTS.length;
        if (artistsRef.current)
          artistsRef.current.scrollTo({
            x: next * (width * 0.9),
            animated: true,
          });
        return next;
      });
    }, 5000);
  };

  useEffect(() => {
    startHighlightInterval();
    startArtistInterval();
    return () => {
      clearInterval(highlightInterval.current);
      clearInterval(artistInterval.current);
    };
  }, []);

  function renderDots(count, activeIndex) {
    return (
      <View style={styles.dotsContainer}>
        {Array.from({ length: count }).map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex ? styles.activeDot : null]}
          />
        ))}
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }} // voor navbar dit wordt later veranderd
    >
      {/* Highlights */}
      <View style={styles.section}>
        <View style={[styles.highlightContainer, { height: CAROUSEL_HEIGHT }]}>
          <ScrollView
            ref={highlightsRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={{ height: CAROUSEL_HEIGHT }}
            onScrollBeginDrag={() => {
              // stop interval while user interacts
              clearInterval(highlightInterval.current);
            }}
            onMomentumScrollEnd={(ev) => {
              const idx = Math.round(ev.nativeEvent.contentOffset.x / width);
              setHighlightIndex(idx);
              // Herstart de timer als je met de highlight interacteert
              startHighlightInterval();
            }}
          >
            {DUMMY_HIGHLIGHTS.slice(0, 10).map((item) => (
              <View
                key={item.id}
                style={{ width, height: CAROUSEL_HEIGHT, overflow: "hidden" }}
              >
                <Image
                  source={{ uri: item.uri + "?w=1600&h=900&fit=crop" }}
                  style={styles.highlightImage}
                  resizeMode="cover"
                />
              </View>
            ))}
          </ScrollView>

          <View style={styles.titleOverlay} pointerEvents="none">
            <View
              style={styles.titleWrapOverlay}
              className="bg-[#006494] px-6 py-3 rounded-full"
            >
              <Text
                style={styles.titleTextOverlay}
                className="text-white font-extrabold"
              >
                Highlights
              </Text>
            </View>
          </View>

          <View style={styles.purpleOverlay} pointerEvents="none">
            <View style={styles.purpleBar}>
              {renderDots(
                Math.min(DUMMY_HIGHLIGHTS.length, 10),
                highlightIndex,
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Digital Museum */}
      <TouchableOpacity
        style={styles.section}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("DigitalMuseum")}
      >
        <View style={styles.titleWrapSmall}>
          <Text style={[styles.titleTextOverlay, styles.smallTitle]}>
            Ga naar digitaal museum
          </Text>
        </View>

        <Image
          source={{ uri: DUMMY_HIGHLIGHTS[0].uri + "?w=1200&h=400&fit=crop" }}
          style={styles.digitalBackground}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Artists */}
      <View style={styles.section}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ArtistsList")}
          style={styles.titleWrapSmallTouchable}
        >
          <Text style={[styles.titleTextOverlay, styles.smallTitle]}>
            Kunstenaars
          </Text>
        </TouchableOpacity>

        <View style={styles.artistsContainer}>
          <ScrollView
            ref={artistsRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ height: 380 }}
            pagingEnabled
            onScrollBeginDrag={() => {
              clearInterval(artistInterval.current);
            }}
            onMomentumScrollEnd={(ev) => {
              const idx = Math.round(
                ev.nativeEvent.contentOffset.x / (width * 0.9),
              );
              setArtistIndex(idx);
              startArtistInterval();
            }}
          >
            {DUMMY_ARTISTS.map((artist) => (
              <View key={artist.id} style={styles.artistCard}>
                <Image
                  source={{ uri: artist.cover + "?w=1200&h=800&fit=crop" }}
                  style={styles.artistCover}
                  resizeMode="cover"
                />
                <View style={styles.artistOverlay} />
                <View style={styles.artistHeader}>
                  <Image
                    source={{ uri: artist.avatar + "?w=200&h=200&fit=crop" }}
                    style={styles.artistAvatar}
                  />
                  <View style={{ flex: 1, alignItems: "center" }}>
                    <Text style={styles.artistName}>{artist.name}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.purpleOverlayArtists} pointerEvents="none">
            <View style={styles.purpleBar}>
              {renderDots(DUMMY_ARTISTS.length, artistIndex)}
            </View>
          </View>
        </View>
      </View>

      {/* Legal Walls */}
      <TouchableOpacity
        style={styles.section}
        onPress={() => navigation.navigate("Map")}
        activeOpacity={0.8}
      >
        <View style={styles.titleWrapSmall}>
          <Text style={[styles.titleTextOverlay, styles.smallTitle]}>
            Legale muren
          </Text>
        </View>

        <View style={styles.legalContainer}>
          <View style={styles.legalSquare}>
            <MaterialIcons name="map" size={40} color="#fff" />
          </View>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#071c21" },
  section: { marginTop: 20 },
  highlightContainer: { position: "relative" },
  highlightImage: { width: "100%", height: "100%", maxHeight: 520 },
  titleWrapOverlay: {
    backgroundColor: "#006494",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 30,
  },
  titleOverlay: {
    position: "absolute",
    top: 18,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 3,
  },
  titleTextOverlay: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    fontFamily: "Montserrat",
  },
  titleWrapSmall: {
    alignSelf: "center",
    backgroundColor: "#006494",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 28,
    marginBottom: 8,
  },
  titleWrapSmallTouchable: { alignSelf: "center", marginBottom: 8 },
  titleText: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "Montserrat",
    fontWeight: "700",
    textDecorationLine: "underline",
    textDecorationColor: "#fff",
  },
  smallTitle: { fontSize: 20 },
  purpleBar: {
    backgroundColor: "rgba(128,64,160,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dotsContainer: { flexDirection: "row", alignItems: "center" },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
    marginHorizontal: 4,
  },
  activeDot: { width: 26, height: 10, borderRadius: 6 },
  purpleOverlay: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 4,
  },
  artistsContainer: { position: "relative" },
  purpleOverlayArtists: {
    position: "absolute",
    bottom: 8,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 4,
  },
  digitalBackground: { width: "100%", height: 140, borderRadius: 8 },
  artistCard: {
    width: width * 0.9,
    height: CAROUSEL_HEIGHT * 0.8,
    marginHorizontal: (width * 0.05) / 2,
    borderRadius: 18,
    overflow: "hidden",
  },
  artistCover: { width: "100%", height: "100%" },
  artistOverlay: {
    backgroundColor: "rgba(0,0,0,0.25)",
    ...StyleSheet.absoluteFillObject,
  },
  artistHeader: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  artistAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: "#fff",
  },
  artistName: {
    color: "#000",
    fontSize: 24,
    fontWeight: "800",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  legalContainer: { alignItems: "center", paddingVertical: 20 },
  legalSquare: {
    width: 140,
    height: 140,
    borderRadius: 20,
    backgroundColor: "rgba(128,64,160,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  mapIcon: { fontSize: 40, color: "#fff" },
});
