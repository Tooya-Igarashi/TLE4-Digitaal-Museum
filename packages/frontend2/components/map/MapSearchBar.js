import React, { useRef, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  useWindowDimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MapSearchBar({ value, onChangeText }) {
  const { width } = useWindowDimensions();
  const isWideScreen = width >= 768;

  const translateY = useRef(new Animated.Value(-20)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        speed: 14,
        bounciness: 10,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const hasValue = value && value.length > 0;

  return (
    <Animated.View
      style={[
        styles.container,
        isWideScreen ? styles.desktopPosition : styles.mobilePosition,
        { transform: [{ translateY }], opacity },
      ]}
    >
      <Ionicons
        name="search"
        size={20}
        color={hasValue ? "#00F5D4" : "rgba(255,255,255,0.45)"}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Zoek locatie of muur"
        placeholderTextColor="rgba(255,255,255,0.35)"
        style={styles.input}
        selectionColor="#00F5D4"
      />
      {hasValue && (
        <Ionicons
          name="close-circle"
          size={18}
          color="rgba(255,255,255,0.4)"
          onPress={() => onChangeText("")}
          style={{ padding: 2 }}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    backgroundColor: "rgba(7,28,33,0.88)",
    borderRadius: 28,
    borderTopLeftRadius: 18,
    borderBottomRightRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(0,245,212,0.25)",
    paddingHorizontal: 16,
    shadowColor: "#00F5D4",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  mobilePosition: {
    top: 20,
    width: "85%",
    alignSelf: "center",
  },
  desktopPosition: {
    top: 20,
    left: 20,
    width: 350,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
});
