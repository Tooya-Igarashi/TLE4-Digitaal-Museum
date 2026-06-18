import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { useData } from "../components/UseData";
import { createPiece } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UploadPage({ navigation, route }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [selectedLocationId, setSelectedLocationId] = useState("");
    const [selectedWallId, setSelectedWallId] = useState("");
  const [selectedGraffitiStyleId, setSelectedGraffitiStyleId] = useState("");

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
  });

    const {locations, walls, graffitiStyles, loading, refreshPieces} = useData();

    // Set default location on load
  useEffect(() => {
    if (locations && locations.length > 0) {
      setSelectedLocationId(locations[0]._id ?? "");
    }
  }, [locations]);

    // When location changes, filter walls and set first wall as default
    useEffect(() => {
        if (!selectedLocationId) return;
        const wallsInLocation = walls.filter(
            (w) => w.location?._id === selectedLocationId
        );
        if (wallsInLocation.length > 0) {
            setSelectedWallId(wallsInLocation[0]._id ?? "");
        } else {
            setSelectedWallId("");
        }
    }, [selectedLocationId, walls]);

    // Set default graffiti style on load
  useEffect(() => {
    if (graffitiStyles && graffitiStyles.length > 0) {
      setSelectedGraffitiStyleId(graffitiStyles[0]._id ?? "");
    }
  }, [graffitiStyles]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
          "Toestemming vereist",
          "Geef toegang tot je fotobibliotheek om een afbeelding te kiezen.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    const userId = await AsyncStorage.getItem("userId");
    const accessToken = await AsyncStorage.getItem("accessToken");

    if (!userId || !accessToken) {
      Alert.alert("Niet ingelogd");
      return;
    }

    if (!title.trim()) {
      Alert.alert("Titel ontbreekt", "Voeg een titel toe aan je kunstwerk.");
      return;
    }
    if (!selectedLocationId) {
        Alert.alert("Locatie ontbreekt", "Selecteer een locatie voor je kunstwerk.");
        return;
    }
      if (!selectedWallId) {
          Alert.alert("Muur ontbreekt", "Selecteer een muur voor je kunstwerk.");
      return;
    }
    if (!selectedGraffitiStyleId) {
        Alert.alert("Graffiti Stijl ontbreekt", "Selecteer een graffiti stijl voor je kunstwerk.");
      return;
    }
    if (!imageUri) {
      Alert.alert("Foto ontbreekt", "Kies een foto van je kunstwerk.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("user", userId);
        // Send wall ID, not location ID
        formData.append("wall", selectedWallId);
      formData.append("graffitiStyle", selectedGraffitiStyleId);

      const selectedDate = new Date().toISOString().split("T")[0];
      formData.append("date", selectedDate);
      formData.append("image", {
        uri: imageUri,
        name: "photo.jpg",
        type: "image/jpeg",
      });

      const result = await createPiece(formData, accessToken);
      console.log("createPiece result:", result);

      if (refreshPieces) {
        await refreshPieces();
      }

      navigation.navigate("Main", {
        screen: "DigitalMuseum",
        params: {
          userId,
          accessToken,
          date: selectedDate,
          title: title,
        },
      });
    } catch (err) {
      console.error(err);
      Alert.alert("Fout", "Er ging iets mis bij het opslaan. Probeer opnieuw.");
    } finally {
      setUploading(false);
    }
  };

    // Filter walls based on selected location
    const wallsInSelectedLocation = walls.filter(
        (w) => w.location?._id === selectedLocationId
    );

  if (!fontsLoaded) return null;

  return (
      <View style={styles.root}>
          <StatusBar barStyle="light-content"/>

          {/* Header */}
          <LinearGradient colors={["#051923", "#003554"]} style={styles.header}>
              <View style={styles.headerTitleBlock}>
                  <Text style={styles.headerEyebrow}>Toevoegen</Text>
                  <Text style={styles.headerTitle}>Kunst</Text>
              </View>
          </LinearGradient>

          <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
          >
              <Text style={styles.introText}>
                  Voeg je kunstwerk toe aan het digitale museum en deel het met de
                  community. Je werk wordt ook zichtbaar op je profiel.
              </Text>

              {/* Title field */}
              <Text style={styles.label}>Titel</Text>
              <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Naam van je kunstwerk"
                  placeholderTextColor="#2a4a5e"
                  selectionColor="#1E5C7E"
              />

              {/* Description field */}
              <Text style={styles.label}>Beschrijving</Text>
              <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Vertel iets over dit werk..."
                  placeholderTextColor="#2a4a5e"
                  selectionColor="#1E5C7E"
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
              />

              {/* Step 1 — Location Picker */}
              <Text style={styles.label}>Locatie</Text>
              <View style={styles.pickerContainer}>
                  {!loading && locations.length > 0 ? (
                      <Picker
                          selectedValue={selectedLocationId}
                          onValueChange={(itemValue) => setSelectedLocationId(itemValue)}
                          style={{color: "#FFFFFF", backgroundColor: "#0a2536"}}
                      >
                          <Picker.Item label="Selecteer een locatie" value=""/>
                          {locations.map((loc) => (
                              <Picker.Item
                                  key={loc._id}
                                  label={loc.regionName ?? "Onbekende locatie"}
                                  value={loc._id ?? ""}
                                  color="#FFFFFF"
                              />
                          ))}
                      </Picker>
                  ) : (
                      <Text style={styles.pickerPlaceholder}>Locaties laden...</Text>
                  )}
              </View>

              {/* Step 2 — Wall Picker (filtered by selected location) */}
              <Text style={styles.label}>Muur</Text>
              <View style={styles.pickerContainer}>
                  {!loading && wallsInSelectedLocation.length > 0 ? (
                      <Picker
                          selectedValue={selectedWallId}
                          onValueChange={(itemValue) => setSelectedWallId(itemValue)}
                          style={{color: "#FFFFFF", backgroundColor: "#0a2536"}}
                      >
                          <Picker.Item label="Selecteer een muur" value=""/>
                          {wallsInSelectedLocation.map((wall) => (
                              <Picker.Item
                                  key={wall._id}
                                  label={`${wall.wallName} — ${wall.cityName}`}
                                  value={wall._id ?? ""}
                                  color="#FFFFFF"
                              />
                          ))}
                      </Picker>
                  ) : (
                      <Text style={styles.pickerPlaceholder}>
                          {selectedLocationId
                              ? "Geen muren gevonden voor deze locatie."
                              : "Selecteer eerst een locatie."}
                      </Text>
                  )}
              </View>

              {/* Graffiti Style Picker */}
              <Text style={styles.label}>Graffiti Stijl</Text>
              <View style={styles.pickerContainer}>
                  {!loading && graffitiStyles.length > 0 ? (
                      <Picker
                          selectedValue={selectedGraffitiStyleId}
                          onValueChange={(itemValue) =>
                              setSelectedGraffitiStyleId(itemValue)
                          }
                          style={{color: "#FFFFFF", backgroundColor: "#0a2536"}}
                      >
                          <Picker.Item label="Selecteer een stijl" value=""/>
                          {graffitiStyles.map((style) => (
                              <Picker.Item
                                  key={style._id}
                                  label={style.graffitiStyleName ?? "Onbekende stijl"}
                                  value={style._id ?? ""}
                                  color="#FFFFFF"
                              />
                          ))}
                      </Picker>
                  ) : (
                      <Text style={styles.pickerPlaceholder}>
                          Graffiti stijlen laden...
                      </Text>
                  )}
              </View>

              {/* Photo field */}
              <Text style={styles.label}>Foto</Text>
              <TouchableOpacity
                  style={styles.imagePicker}
                  onPress={pickImage}
                  activeOpacity={0.8}
              >
                  {imageUri ? (
                      <>
                          <Image
                              source={{uri: imageUri}}
                              style={styles.previewImage}
                              resizeMode="cover"
                          />
                          <TouchableOpacity
                              style={styles.changeOverlay}
                              onPress={pickImage}
                          >
                              <Ionicons name="camera-outline" size={22} color="#F5F5F5"/>
                              <Text style={styles.changeText}>Wijzigen</Text>
                          </TouchableOpacity>
                      </>
                  ) : (
                      <View style={styles.imagePickerInner}>
                          <Ionicons name="add-outline" size={28} color="#8ab4cc"/>
                          <Text style={styles.imagePickerText}>Afbeelding toevoegen</Text>
                      </View>
                  )}
              </TouchableOpacity>
          </ScrollView>

          {/* Save button */}
          <View style={styles.footer}>
              <TouchableOpacity
                  style={[styles.saveBtn, uploading && styles.saveBtnDisabled]}
                  onPress={handleSave}
                  disabled={uploading}
                  activeOpacity={0.85}
              >
                  {uploading ? (
                      <ActivityIndicator color="#051923" size="small"/>
                  ) : (
                      <>
                          <Text style={styles.saveBtnText}>Opslaan</Text>
                          <Ionicons name="checkmark-outline" size={18} color="#051923"/>
                      </>
                  )}
              </TouchableOpacity>
          </View>
      </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#051923",
  },
  header: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 12 : 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    overflow: "hidden",
  },
  backBtn: {
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  headerTitleBlock: {
    marginTop: 4,
  },
  headerEyebrow: {
    color: "#8ab4cc",
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headerTitle: {
    color: "#F5F5F5",
    fontSize: 42,
    fontFamily: "Montserrat_600SemiBold",
    lineHeight: 48,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  introText: {
    color: "#8ab4cc",
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    lineHeight: 20,
    marginBottom: 24,
  },
  label: {
    color: "#F5F5F5",
    fontSize: 15,
    fontFamily: "Montserrat_600SemiBold",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#0a2536",
    borderWidth: 1,
    borderColor: "#1e3a52",
    borderRadius: 5,
    color: "#F5F5F5",
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  pickerContainer: {
    backgroundColor: "#0a2536",
    borderWidth: 1,
    borderColor: "#1e3a52",
    borderRadius: 5,
    marginBottom: 20,
    overflow: "hidden",
  },
  picker: {
    color: "#F5F5F5",
    height: 50,
    backgroundColor: "transparent",
  },
  pickerItem: {
    color: "#F5F5F5",
    backgroundColor: "#0a2536",
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
  },
  pickerPlaceholder: {
    color: "#8ab4cc",
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  imagePicker: {
    backgroundColor: "#0a2536",
    borderWidth: 1,
    borderColor: "#1e3a52",
    borderRadius: 5,
    height: 180,
    overflow: "hidden",
    marginBottom: 20,
  },
  imagePickerInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  imagePickerText: {
    color: "#8ab4cc",
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  changeOverlay: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
  },
  changeText: {
    color: "#F5F5F5",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#1e3a52",
    backgroundColor: "#051923",
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignSelf: "flex-start",
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: "#051923",
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
  },
});