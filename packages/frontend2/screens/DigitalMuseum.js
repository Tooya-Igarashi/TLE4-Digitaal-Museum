import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";

export default function DigitalMuseum({ navigation }) {
  const [walls, setWalls] = useState([]);
  const [pieces, setPieces] = useState([]);
  const [filteredPieces, setFilteredPieces] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPieces();
    // also fetch walls
    (async () => {
      try {
        const api = await import("../api");
        const w = await api.getWalls();
        setWalls(w || []);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const fetchPieces = async () => {
    try {
      setLoading(true);
      const api = await import("../api");
      const BASE_URL = await api.getBase();
      const res = await fetch(`${BASE_URL}/pieces`, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      setPieces(data || []);
      setFilteredPieces(data || []);
    } catch (err) {
      console.error("Failed to fetch pieces:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text style={styles.title}>Digitaal Museum</Text>

      {loading && (
        <View style={{ marginVertical: 12 }}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      <Text style={styles.info}>Beschikbare muren: {walls.length}</Text>
      <Text style={styles.info}>Getoonde werken: {pieces.length}</Text>

      <View style={{ marginTop: 12 }}>
        {walls.slice(0, 5).map((w) => (
          <Text key={w._id || w.id} style={styles.item}>
            Muur: {w.wallName || w.cityName || "Onbekend"}
          </Text>
        ))}
      </View>

      <View style={{ marginTop: 12 }}>
        {pieces.slice(0, 5).map((p) => (
          <Text key={p._id || p.id} style={styles.item}>
            Werk: {p.title || "Onbekend"}
          </Text>
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Terug</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#071c21",
  },
  title: { color: "#fff", fontSize: 28, fontWeight: "700", marginBottom: 8 },
  info: { color: "#ddd", marginBottom: 20 },
  button: {
    backgroundColor: "#006494",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "700" },
});
