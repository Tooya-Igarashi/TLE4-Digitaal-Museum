import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function LocationPage({ route }) {
  const { wall } = route.params;

  const [latitude, longitude] = wall.coordinates
    .split(",")
    .map((item) => Number(item.trim()));

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude,
            longitude,
          }}
        />
      </MapView>

      <View style={styles.info}>
        <Text style={styles.title}>{wall.wallName}</Text>

        <Text style={styles.subtitle}>{wall.cityName}</Text>

        <Text style={styles.description}>{wall.description}</Text>

        <Text style={styles.meta}>
          {wall.isLegal ? "Legale muur" : "Illegale muur"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#071c21",
  },

  map: {
    flex: 1,
  },

  info: {
    padding: 20,
    backgroundColor: "#0d2b35",
  },

  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
  },

  subtitle: {
    color: "#00F5D4",
    marginTop: 4,
    fontSize: 15,
  },

  description: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 12,
    lineHeight: 22,
  },

  meta: {
    color: "rgba(255,255,255,0.4)",
    marginTop: 10,
  },
});
