import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, Alert, Text, Animated } from "react-native";
import MapView from "react-native-map-clustering";
import * as Location from "expo-location";
import MapSearchBar from "../components/map/MapSearchBar";
import WallMarker, { parseCoordinates } from "../components/map/WallMarker";
import ClusterMarker from "../components/map/ClusterMarker";
import WallBottomSheet from "../components/map/WallBottomSheet";
import * as api from "../api";
import Ionicons from "@expo/vector-icons/Ionicons";

function LoadingScreen() {
  const pulse = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.6,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <View style={styles.loader}>
      <Animated.View style={{ opacity: pulse }}>
        <Ionicons name="map" size={96} color={"#00F5D4"} />
      </Animated.View>
      <Text style={styles.loaderText}>Kaart laden...</Text>
    </View>
  );
}

export default function MapPage() {
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [walls, setWalls] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [selectedWall, setSelectedWall] = useState(null);

  useEffect(() => {
    initializeMap();
  }, []);

  const initializeMap = async () => {
    try {
      await getCurrentLocation();
      await loadWalls();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Locatie geweigerd", "De kaart heeft locatie nodig.");
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    setUserLocation(location.coords);
  };

  const loadWalls = async () => {
    try {
      const data = await api.getWalls();
      setWalls(data);
    } catch (error) {
      console.log(error);
      Alert.alert("Fout", "Walls konden niet worden geladen");
    }
  };

  const filteredWalls = useMemo(() => {
    if (!searchText.trim()) return walls;
    const search = searchText.toLowerCase();
    return walls.filter(
      (wall) =>
        wall.cityName?.toLowerCase().includes(search) ||
        wall.regionName?.toLowerCase().includes(search) ||
        wall.wallName?.toLowerCase().includes(search) ||
        wall.description?.toLowerCase().includes(search),
    );
  }, [walls, searchText]);

  const handleClusterPress = (cluster) => {
    const [longitude, latitude] = cluster.geometry.coordinates;
    const { expansion_zoom } = cluster.properties;
    const delta = Math.max(
      0.01,
      0.05 / Math.pow(2, (expansion_zoom || 12) - 8),
    );
    mapRef.current?.animateToRegion(
      { latitude, longitude, latitudeDelta: delta, longitudeDelta: delta },
      450,
    );
  };

  const handleWallPress = (wall) => {
    setSelectedWall(wall);
  };

  const handleSearchSubmit = () => {
    if (!searchText.trim()) return;

    const search = searchText.toLowerCase();
    const matches = walls.filter((wall) => {
      const coords = parseCoordinates(wall.coordinates);
      return (
        coords &&
        (wall.cityName?.toLowerCase().includes(search) ||
          wall.regionName?.toLowerCase().includes(search) ||
          wall.wallName?.toLowerCase().includes(search) ||
          wall.description?.toLowerCase().includes(search))
      );
    });

    if (matches.length === 0) {
      Alert.alert(
        "Geen resultaten",
        "Geen muren gevonden voor deze zoekopdracht.",
      );
      return;
    }

    const coordsList = matches.map((wall) =>
      parseCoordinates(wall.coordinates),
    );

    const avgLatitude =
      coordsList.reduce((sum, c) => sum + c.latitude, 0) / coordsList.length;
    const avgLongitude =
      coordsList.reduce((sum, c) => sum + c.longitude, 0) / coordsList.length;

    const latitudes = coordsList.map((c) => c.latitude);
    const longitudes = coordsList.map((c) => c.longitude);
    const latSpread = Math.max(...latitudes) - Math.min(...latitudes);
    const lngSpread = Math.max(...longitudes) - Math.min(...longitudes);

    const latitudeDelta = Math.max(0.02, latSpread * 1.5);
    const longitudeDelta = Math.max(0.02, lngSpread * 1.5);

    mapRef.current?.animateToRegion(
      {
        latitude: avgLatitude,
        longitude: avgLongitude,
        latitudeDelta,
        longitudeDelta,
      },
      450,
    );
  };

  if (loading || !userLocation) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation
        animationEnabled={false}
        radius={40}
        minZoom={1}
        maxZoom={20}
        minPoints={2}
        clusterMaxZoom={40}
        removeClippedSubviews={false}
        renderCluster={(cluster) => (
          <ClusterMarker
            key={`cluster-${cluster.id}`}
            cluster={cluster}
            onPress={handleClusterPress}
          />
        )}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        onPress={(e) => {
          if (e?.nativeEvent?.action !== "marker-press") {
            setSelectedWall(null);
          }
        }}
      >
        {filteredWalls.map((wall) => {
          const coords = parseCoordinates(wall.coordinates);
          if (!coords) return null;
          return (
            <WallMarker
              key={wall._id}
              coordinate={coords}
              wall={wall}
              onPress={handleWallPress}
            />
          );
        })}
      </MapView>

      <MapSearchBar
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={handleSearchSubmit}
      />

      {selectedWall && (
        <WallBottomSheet
          wall={selectedWall}
          onClose={() => setSelectedWall(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#071c21" },
  map: { flex: 1 },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#071c21",
    gap: 12,
  },
  loaderIcon: { fontSize: 48 },
  loaderText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
