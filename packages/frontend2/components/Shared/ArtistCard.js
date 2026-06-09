import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { FALLBACK_IMAGE } from "./fallbackImage";

export default function ArtistCard({ artist = {}, width, height }) {
  const coverUri = artist.cover
    ? artist.cover + "?w=1200&h=800&fit=crop"
    : FALLBACK_IMAGE;
  const avatarUri = artist.avatar
    ? artist.avatar + "?w=200&h=200&fit=crop"
    : FALLBACK_IMAGE;

  return (
    <View style={[styles.card, { width, height }]}>
      <Image
        source={{ uri: coverUri }}
        style={styles.cover}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      <View style={styles.header}>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.name}>
            {artist.name || "Onbekende kunstenaar"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    overflow: "hidden",
    marginHorizontal: 8,
  },
  cover: { width: "100%", height: "100%" },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.25)",
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: "#fff",
  },
  name: {
    color: "#000",
    fontSize: 24,
    fontWeight: "800",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
});
