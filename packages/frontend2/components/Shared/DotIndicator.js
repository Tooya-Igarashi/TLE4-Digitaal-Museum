import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

const BASE_DOT_WIDTH = 8;
const BASE_DOT_HEIGHT = 8;
const ACTIVE_DOT_HEIGHT = 10;
const ACTIVE_DOT_BASE_WIDTH = 26;
const ACTIVE_DOT_EXTRA_PER_COLUMN = 18;

const ACCENT_COLORS = ["#FF4D6D", "#00F5D4", "#FFB703", "#A855F7"];

export default function DotIndicator({
  count = 3,
  activeIndex = 0,
  columns = 1,
}) {
  const activeDotWidth =
    ACTIVE_DOT_BASE_WIDTH + (columns - 1) * ACTIVE_DOT_EXTRA_PER_COLUMN;

  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.25,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [activeIndex]);

  const activeDotColor = ACCENT_COLORS[activeIndex % ACCENT_COLORS.length];

  return (
    <View style={styles.dotsContainer}>
      {Array.from({ length: count }).map((_, i) => {
        const isActive = i === activeIndex;
        if (isActive) {
          return (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  width: activeDotWidth,
                  height: ACTIVE_DOT_HEIGHT,
                  borderRadius: ACTIVE_DOT_HEIGHT / 2,
                  backgroundColor: activeDotColor,
                  transform: [{ scaleY: pulse }],
                  shadowColor: activeDotColor,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 6,
                  elevation: 4,
                },
              ]}
            />
          );
        }
        return <View key={i} style={styles.dot} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  dotsContainer: { flexDirection: "row", alignItems: "center" },
  dot: {
    width: BASE_DOT_WIDTH,
    height: BASE_DOT_HEIGHT,
    borderRadius: BASE_DOT_WIDTH / 2,
    backgroundColor: "rgba(255,255,255,0.35)",
    marginHorizontal: 4,
  },
});
