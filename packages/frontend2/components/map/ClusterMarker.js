import React, { useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Marker } from "react-native-maps";

const SIZE = 56;
const WRAPPER_SIZE = SIZE + 16;

export default function ClusterMarker({ cluster, onPress }) {
  const [tracksChanges, setTracksChanges] = useState(true);
  const { id, geometry, properties } = cluster;
  const { point_count } = properties;
  const [longitude, latitude] = geometry.coordinates;

  const fontSize = point_count > 99 ? 13 : point_count > 9 ? 15 : 18;

  return (
    <Marker
      key={`cluster-${id}`}
      coordinate={{ latitude, longitude }}
      onPress={() => onPress?.(cluster)}
      tracksViewChanges={Platform.OS === "android" ? true : tracksChanges}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <View
        style={styles.wrapper}
        onLayout={() => {
          if (Platform.OS === "android") return;
          if (tracksChanges) {
            setTimeout(() => setTracksChanges(false), 1000);
          }
        }}
      >
        <View style={styles.outerRing} />
        <View style={styles.bubble}>
          <Text style={[styles.count, { fontSize }]}>{point_count}</Text>
          <Text style={styles.label}>walls</Text>
        </View>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: WRAPPER_SIZE,
    height: WRAPPER_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  outerRing: {
    position: "absolute",
    top: 0,
    left: 0,
    width: WRAPPER_SIZE,
    height: WRAPPER_SIZE,
    borderRadius: WRAPPER_SIZE / 2,
    backgroundColor: "rgba(0,100,148,0.22)",
    borderWidth: 1.5,
    borderColor: "rgba(0,245,212,0.25)",
  },
  bubble: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: "#006494",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      android: {
        elevation: 8,
      },
      ios: {
        shadowColor: "#00F5D4",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
      },
    }),
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
