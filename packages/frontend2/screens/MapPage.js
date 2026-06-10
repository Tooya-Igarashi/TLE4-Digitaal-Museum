import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [walls, setWalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserLocation();
    fetchWalls();
  }, []);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Geen toestemming", "Locatie toestemming geweigerd");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});

      setLocation(currentLocation.coords);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchWalls = async () => {
    try {
      const response = await fetch(`${API_URL}/walls`);
      const data = await response.json();

      setWalls(data);
    } catch (error) {
      console.log(error);
      Alert.alert("Fout", "Kon walls niet ophalen");
    } finally {
      setLoading(false);
    }
  };

  const parseCoordinates = (coordinateString) => {
    const [latitude, longitude] = coordinateString.split(",").map(Number);

    return {
      latitude,
      longitude,
    };
  };

  if (loading || !location) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      showsUserLocation
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.15,
        longitudeDelta: 0.15,
      }}
    >
      {walls.map((wall) => {
        const coords = parseCoordinates(wall.coordinates);

        return (
          <Marker
            key={wall._id}
            coordinate={coords}
            title={wall.cityName}
            description={wall.description}
            pinColor={wall.isLegal ? "#00BFFF" : "#FF0000"}
          />
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
