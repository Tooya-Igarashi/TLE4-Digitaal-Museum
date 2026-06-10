import React, { useRef, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Animated,
  Text,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import TitleBadge from "../Shared/TitleBadge";

function Drip({ left, delay, color, height }) {
  const drip = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(drip, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.delay(1200),
        Animated.timing(drip, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const translateY = drip.interpolate({
    inputRange: [0, 1],
    outputRange: [-height, 0],
  });

  const opacity = drip.interpolate({
    inputRange: [0, 0.1, 0.85, 1],
    outputRange: [0, 1, 1, 0],
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
        left,
        top: 0,
        width: 6,
        height,
        backgroundColor: color,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        transform: [{ translateY }],
        opacity,
      }}
    />
  );
}

export default function LegalWallsButton({ onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 40,
      bounciness: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 16,
    }).start();
  };

  return (
    <TouchableOpacity
      style={{ marginTop: 20 }}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <View style={{ alignItems: "center", marginBottom: 8 }}>
        <TitleBadge>Legale muren</TitleBadge>
      </View>

      <View style={styles.legalContainer}>
        <Animated.View style={[styles.legalSquare, { transform: [{ scale }] }]}>
          <View style={styles.dripsContainer}>
            <Drip left={18} delay={0} color="#FF4D6D" height={28} />
            <Drip left={38} delay={400} color="#00F5D4" height={20} />
            <Drip left={58} delay={900} color="#FFB703" height={34} />
            <Drip left={78} delay={300} color="#A855F7" height={22} />
            <Drip left={98} delay={700} color="#FF4D6D" height={18} />
          </View>

          <MaterialIcons name="map" size={44} color="#fff" />
          <Text style={styles.label}>Bekijk kaart</Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  legalContainer: { alignItems: "center", paddingVertical: 20 },
  legalSquare: {
    width: 160,
    height: 160,
    borderRadius: 24,
    borderTopLeftRadius: 10,
    backgroundColor: "#1a0533",
    borderWidth: 2,
    borderColor: "#A855F7",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    gap: 8,
    shadowColor: "#A855F7",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 10,
  },
  dripsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    overflow: "hidden",
  },
  label: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
