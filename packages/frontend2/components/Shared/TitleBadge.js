import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

export default function TitleBadge({ children, style, textStyle }) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const shimmerOpacity = shimmer.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.1, 0],
  });

  return (
    <View style={[styles.wrap, style]}>
      <Animated.View
        style={[styles.shimmerOverlay, { opacity: shimmerOpacity }]}
        pointerEvents="none"
      />
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: "center",
    backgroundColor: "#006494",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 28,
    borderTopLeftRadius: 22,
    borderBottomRightRadius: 12,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 20,
    marginBottom: 8,
    overflow: "hidden",
    shadowColor: "#00F5D4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 6,
  },
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ffffff",
    borderRadius: 28,
  },
  text: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
