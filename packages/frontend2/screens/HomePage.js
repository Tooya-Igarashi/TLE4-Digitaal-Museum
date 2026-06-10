import React, { useEffect, useState, useRef } from "react";
import { ScrollView, View, Animated } from "react-native";
import HighlightsCarousel from "../components/Home/HighlightsCarousel";
import ArtistsCarousel from "../components/Home/ArtistCarousel";
import DigitalMuseumCard from "../components/Home/DigitalMuseumCard";
import LegalWallsButton from "../components/Home/LegalWallsButton";
import TitleBadge from "../components/Shared/TitleBadge";
import { FALLBACK_IMAGE } from "../components/Shared/fallbackImage";
import * as api from "../api";

function SectionReveal({ children, delay = 0 }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay,
        useNativeDriver: true,
        speed: 14,
        bounciness: 6,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

export default function HomePage({ navigation }) {
  const [artists, setArtists] = useState([]);
  const [highlights, setHighlights] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const users = await api.getUsers();
        if (!mounted) return;
        const mapped = await Promise.all(
          users
            .filter((u) => u.role === "artist")
            .map(async (u) => {
              const absAvatar =
                (await api.toAbsolute(u.avatar)) || FALLBACK_IMAGE;
              const absCover =
                (await api.toAbsolute(u.cover)) || absAvatar || FALLBACK_IMAGE;
              return {
                id: u._id || u.id,
                name: u.username || u.name || "Onbekend",
                avatar: absAvatar,
                cover: absCover,
              };
            }),
        );
        setArtists(mapped);
        try {
          const pieces = await api.getPieces();
          if (!mounted) return;
          const mappedHighlights = await Promise.all(
            pieces.map(async (p) => ({
              id: p._id || p.id,
              uri: (await api.toAbsolute(p.image)) || FALLBACK_IMAGE,
            })),
          );
          setHighlights(mappedHighlights);
        } catch (e) {
          console.warn("Failed to load pieces for highlights:", e.message || e);
        }
      } catch (e) {
        console.warn("Failed to load users/highlights:", e.message || e);
      }
    })();
    return () => (mounted = false);
  }, []);

  const firstImageUri =
    highlights && highlights[0] && highlights[0].uri
      ? highlights[0].uri
      : FALLBACK_IMAGE;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#071c21" }}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={{ marginTop: 20 }}>
        <HighlightsCarousel items={highlights} />
        <View
          style={{
            position: "absolute",
            top: 18,
            left: 0,
            right: 0,
            alignItems: "center",
            zIndex: 3,
          }}
        >
          <TitleBadge style={{ paddingHorizontal: 24, paddingVertical: 10 }}>
            Highlights
          </TitleBadge>
        </View>
      </View>

      <SectionReveal delay={120}>
        <DigitalMuseumCard
          imageUri={firstImageUri}
          onPress={() => navigation.navigate("DigitalMuseum")}
        />
      </SectionReveal>

      <SectionReveal delay={240}>
        <View style={{ marginTop: 20 }}>
          <View style={{ alignItems: "center", marginBottom: 8 }}>
            <TitleBadge>Kunstenaars</TitleBadge>
          </View>
          <ArtistsCarousel artists={artists} />
        </View>
      </SectionReveal>

      <SectionReveal delay={360}>
        <LegalWallsButton onPress={() => navigation.navigate("Map")} />
      </SectionReveal>
    </ScrollView>
  );
}
