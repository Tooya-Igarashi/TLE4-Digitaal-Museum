import React, { useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Marker } from "react-native-maps";

const LEGAL_COLOR = "#00F5D4";
const ILLEGAL_COLOR = "#FF4D6D";

export default function WallMarker({ wall, coordinate, onPress }) {
  const [tracksChanges, setTracksChanges] = useState(true);
  const coords = coordinate ?? parseCoordinates(wall.coordinates);

  if (!coords) return null;

  const isLegal = wall.isLegal;
  const color = isLegal ? LEGAL_COLOR : ILLEGAL_COLOR;

  return (
    <Marker
      coordinate={coords}
      onPress={() => onPress?.(wall)}
      tracksViewChanges={Platform.OS === "android" ? true : tracksChanges}
      anchor={{ x: 0.5, y: 1 }}
    >
      <View
        style={styles.markerContainer}
        onLayout={() => {
          if (Platform.OS === "android") return;
          if (tracksChanges) {
            setTimeout(() => setTracksChanges(false), 300);
          }
        }}
      >
        <View
          style={[
            styles.pin,
            {
              borderColor: color,
              shadowColor: color,
            },
          ]}
        >
          {isLegal ? (
            <View style={styles.checkIconWrapper}>
              <View
                style={[styles.checkStemLong, { backgroundColor: color }]}
              />
              <View
                style={[styles.checkStemShort, { backgroundColor: color }]}
              />
            </View>
          ) : (
            <View style={styles.warningIconWrapper}>
              <View
                style={[styles.warningTriangle, { borderBottomColor: color }]}
              />
              <View
                style={[
                  styles.warningDot,
                  { backgroundColor: "rgba(7,28,33,0.92)" },
                ]}
              />
            </View>
          )}
        </View>

        {/* <View
          style={[
            styles.pointer,
            {
              borderTopColor: color,
            },
          ]}
        /> */}
      </View>
    </Marker>
  );
}

export function parseCoordinates(coordinateString) {
  if (!coordinateString) return null;

  const parts = coordinateString.split(",").map((part) => Number(part.trim()));

  if (parts.length !== 2 || parts.some(isNaN)) {
    return null;
  }

  return {
    latitude: parts[0],
    longitude: parts[1],
  };
}

const styles = StyleSheet.create({
  markerContainer: {
    width: 38,
    height: 45,
    alignItems: "center",
  },
  pin: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderTopLeftRadius: 6,
    backgroundColor: "rgba(7,28,33,0.92)",
    borderWidth: 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      android: {
        elevation: 6,
      },
      ios: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 8,
      },
    }),
  },
  // pointer: {
  //   alignSelf: "center",
  //   width: 0,
  //   height: 0,
  //   borderLeftWidth: 8,
  //   borderRightWidth: 8,
  //   borderTopWidth: 8,
  //   borderLeftColor: "transparent",
  //   borderRightColor: "transparent",
  //   marginTop: -1,
  // },
  checkIconWrapper: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  checkStemShort: {
    position: "absolute",
    width: 6,
    height: 2.5,
    borderRadius: 1,
    left: 2,
    top: 9,
    transform: [{ rotate: "45deg" }],
  },
  checkStemLong: {
    position: "absolute",
    width: 11,
    height: 2.5,
    borderRadius: 1,
    left: 5,
    top: 7.5,
    transform: [{ rotate: "-45deg" }],
  },
  warningIconWrapper: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  warningTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderBottomWidth: 16,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  warningDot: {
    position: "absolute",
    width: 2.5,
    height: 2.5,
    borderRadius: 1.25,
    bottom: 1,
  },
});
