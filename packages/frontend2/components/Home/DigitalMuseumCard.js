import React from "react";
import { TouchableOpacity, View, Image, StyleSheet } from "react-native";
import TitleBadge from "../Shared/TitleBadge";
import { FALLBACK_IMAGE } from "../Shared/fallbackImage";

const CARD_HEIGHT = 380;

export default function DigitalMuseumCard({ onPress, imageUri }) {
  const displayUri = imageUri
    ? imageUri + "?w=1200&h=400&fit=crop"
    : FALLBACK_IMAGE;

  return (
    <TouchableOpacity
      style={{ marginTop: 20 }}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.container}>
        <Image
          source={{ uri: displayUri }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.badgeWrap} pointerEvents="box-none">
          <TitleBadge>Ga naar digitaal museum</TitleBadge>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    height: CARD_HEIGHT,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badgeWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
});
