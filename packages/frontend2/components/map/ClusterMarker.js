import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Pressable } from "react-native";
import { Marker } from "react-native-maps";

export default function ClusterMarker({ cluster, onPress }) {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const { id, geometry, properties } = cluster;
  const { point_count } = properties;
  const [longitude, latitude] = geometry.coordinates;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 16,
        bounciness: 14,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const size = Math.min(42 + point_count * 3, 72);
  const fontSize = point_count > 99 ? 13 : point_count > 9 ? 15 : 18;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 0.85,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 16,
      }),
    ]).start();
    onPress?.(cluster);
  };

  return (
    <Marker
      key={`cluster-${id}`}
      coordinate={{ latitude, longitude }}
      onPress={handlePress}
      tracksViewChanges={false}
    >
      <Animated.View
        style={[
          styles.wrapper,
          { width: size + 16, height: size + 16 },
          { transform: [{ scale }], opacity },
        ]}
      >
        <View
          style={[
            styles.outerRing,
            {
              width: size + 16,
              height: size + 16,
              borderRadius: (size + 16) / 2,
            },
          ]}
        />
        <View
          style={[
            styles.bubble,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <Text style={[styles.count, { fontSize }]}>{point_count}</Text>
          <Text style={styles.label}>walls</Text>
        </View>
      </Animated.View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  outerRing: {
    position: "absolute",
    backgroundColor: "rgba(0,100,148,0.22)",
    borderWidth: 1.5,
    borderColor: "rgba(0,245,212,0.25)",
  },
  bubble: {
    backgroundColor: "#006494",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#00F5D4",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    gap: -2,
  },
  count: {
    color: "#fff",
    fontWeight: "900",
    lineHeight: undefined,
  },
  label: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
