import React, { useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Pressable,
  Text,
} from "react-native";
import { FALLBACK_IMAGE } from "../Shared/fallbackImage";

const CARD_HEIGHT = 380;

export default function DigitalMuseumCard({ onPress, imageUri }) {
  const scale = useRef(new Animated.Value(1)).current;
  const badgeScale = useRef(new Animated.Value(1)).current;

  const displayUri = imageUri
    ? imageUri + "?w=1200&h=400&fit=crop"
    : FALLBACK_IMAGE;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.975,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }),
      Animated.spring(badgeScale, {
        toValue: 1.08,
        useNativeDriver: true,
        speed: 30,
        bounciness: 12,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 10,
      }),
      Animated.spring(badgeScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 10,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ marginTop: 20 }}
    >
      <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
        <Image
          source={{ uri: displayUri }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.vignette} />

        <View style={styles.badgeWrap} pointerEvents="none">
          <Animated.View
            style={[styles.badge, { transform: [{ scale: badgeScale }] }]}
          >
            <Text style={styles.badgeText}>Digitaal Museum</Text>
            <View style={styles.badgeArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </Animated.View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#00F5D4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(7,28,33,0.45)",
  },
  badgeWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
  badge: {
    backgroundColor: "#00F5D4",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 50,
    borderTopLeftRadius: 18,
    borderBottomRightRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#00F5D4",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  badgeText: {
    color: "#071c21",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  badgeArrow: {
    backgroundColor: "rgba(7,28,33,0.15)",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: {
    color: "#071c21",
    fontSize: 18,
    fontWeight: "900",
  },
});
