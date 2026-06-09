import React from "react";
import { View, StyleSheet } from "react-native";

export default function DotIndicator({ count = 3, activeIndex = 0 }) {
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

const styles = StyleSheet.create({
  dotsContainer: { flexDirection: "row", alignItems: "center" },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
    marginHorizontal: 4,
  },
  activeDot: { width: 26, height: 10, borderRadius: 6 },
});
