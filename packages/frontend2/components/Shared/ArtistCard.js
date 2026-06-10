import React, { useRef } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Animated,
  Pressable,
} from "react-native";
import { FALLBACK_IMAGE } from "./fallbackImage";

const TAG_COLORS = ["#006594", "#0a71a1", "#0d5f85", "#1f80ad", "#175978"];

export default function ArtistCard({ artist = {}, width, height, index = 0 }) {
  const scale = useRef(new Animated.Value(1)).current;
  const tagColor = TAG_COLORS[index % TAG_COLORS.length];

  const coverUri = artist.cover
    ? artist.cover + "?w=1200&h=800&fit=crop"
    : FALLBACK_IMAGE;
  const avatarUri = artist.avatar
    ? artist.avatar + "?w=200&h=200&fit=crop"
    : FALLBACK_IMAGE;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 40,
      bounciness: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 14,
    }).start();
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        style={[styles.card, { width, height, transform: [{ scale }] }]}
      >
        <Image
          source={{ uri: coverUri }}
          style={styles.cover}
          resizeMode="cover"
        />
        <View style={styles.overlayTop} />
        <View style={styles.overlayBottom} />

        <View style={styles.header}>
          <View style={[styles.avatarRing, { borderColor: tagColor }]}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          </View>
        </View>

        <View style={[styles.nameTag, { backgroundColor: tagColor }]}>
          <Text style={styles.name} numberOfLines={1}>
            {artist.name || "Onbekende kunstenaar"}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    overflow: "hidden",
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  cover: { width: "100%", height: "100%" },
  overlayTop: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  overlayBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "30%",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  header: {
    position: "absolute",
    top: 12,
    left: 12,
  },
  avatarRing: {
    padding: 3,
    borderRadius: 36,
    borderWidth: 3,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  nameTag: {
    position: "absolute",
    bottom: 14,
    left: 12,
    right: 12,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    alignItems: "center",
  },
  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.3,
    textTransform: "uppercase",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
