import React from "react";
import { View, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";

const LEGAL_COLOR = "#00F5D4";
const ILLEGAL_COLOR = "#FF4D6D";

export default function WallMarker({ wall, onPress }) {
  const coords = parseCoordinates(wall.coordinates);

  if (!coords) return null;

  const isLegal = wall.isLegal;
  const color = isLegal ? LEGAL_COLOR : ILLEGAL_COLOR;

  return (
    <Marker coordinate={coords} onPress={() => onPress?.(wall)}>
      <View>
        <View
          style={[
            styles.pin,
            {
              borderColor: color,
              shadowColor: color,
            },
          ]}
        >
          <MaterialIcons
            name={isLegal ? "check-circle" : "warning"}
            size={18}
            color={color}
          />
        </View>

        <View
          style={[
            styles.pointer,
            {
              borderTopColor: color,
            },
          ]}
        />
      </View>
    </Marker>
  );
}

function parseCoordinates(coordinateString) {
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
  pin: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderTopLeftRadius: 6,
    backgroundColor: "rgba(7,28,33,0.92)",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 6,
  },

  pointer: {
    alignSelf: "center",
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    marginTop: -1,
  },
});
