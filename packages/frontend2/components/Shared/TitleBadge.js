import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TitleBadge({ children, style, textStyle }) {
  return (
    <View style={[styles.wrap, style]}>
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
    marginBottom: 8,
  },
  text: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
});
