import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Map({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kaart - Legale muren</Text>
      <Text style={styles.info}>
        Placeholder map screen. (react-native-maps of webview).
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Terug</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#071c21",
  },
  title: { color: "#fff", fontSize: 24, fontWeight: "700", marginBottom: 8 },
  info: {
    color: "#ddd",
    marginBottom: 16,
    paddingHorizontal: 24,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#006494",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "700" },
});
