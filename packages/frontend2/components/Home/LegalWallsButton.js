import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import TitleBadge from "../Shared/TitleBadge";

export default function LegalWallsButton({ onPress }) {
  return (
    <TouchableOpacity
      style={{ marginTop: 20 }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={{ alignItems: "center", marginBottom: 8 }}>
        <TitleBadge>Legale muren</TitleBadge>
      </View>

      <View style={styles.legalContainer}>
        <View style={styles.legalSquare}>
          <MaterialIcons name="map" size={40} color="#fff" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  legalContainer: { alignItems: "center", paddingVertical: 20 },
  legalSquare: {
    width: 140,
    height: 140,
    borderRadius: 20,
    backgroundColor: "rgba(128,64,160,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
});
