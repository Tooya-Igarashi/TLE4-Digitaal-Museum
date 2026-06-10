import React, { useRef, useEffect, useState } from "react";
import { View, ScrollView, Image, Dimensions } from "react-native";
import { FALLBACK_IMAGE } from "../Shared/fallbackImage";
import DotIndicator from "../Shared/DotIndicator";

const { width } = Dimensions.get("window");
const CAROUSEL_HEIGHT = 380;

export default function HighlightsCarousel({ items = [] }) {
  const highlightsRef = useRef(null);
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  const startInterval = () => {
    clearInterval(intervalRef.current);
    if (items.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % Math.min(items.length, 10);
        if (highlightsRef.current)
          highlightsRef.current.scrollTo({ x: next * width, animated: true });
        return next;
      });
    }, 5000);
  };

  useEffect(() => {
    startInterval();
    return () => clearInterval(intervalRef.current);
  }, [items]);

  return (
    <View style={{ position: "relative", height: CAROUSEL_HEIGHT }}>
      <ScrollView
        ref={highlightsRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ height: CAROUSEL_HEIGHT }}
        onScrollBeginDrag={() => clearInterval(intervalRef.current)}
        onMomentumScrollEnd={(ev) => {
          const idx = Math.round(ev.nativeEvent.contentOffset.x / width);
          setIndex(idx);
          startInterval();
        }}
      >
        {items.slice(0, 10).map((item, i) => (
          <View
            key={item && item.id ? item.id : i}
            style={{ width, height: CAROUSEL_HEIGHT }}
          >
            <Image
              source={{
                uri:
                  item && item.uri
                    ? item.uri + "?w=1600&h=900&fit=crop"
                    : FALLBACK_IMAGE,
              }}
              style={{ width: "100%", height: "100%", maxHeight: 520 }}
              resizeMode="cover"
            />
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 80,
                backgroundColor: "rgba(7,28,33,0.55)",
              }}
            />
          </View>
        ))}
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 12,
          left: 0,
          right: 0,
          alignItems: "center",
          zIndex: 4,
        }}
        pointerEvents="none"
      >
        <DotIndicator count={Math.min(items.length, 10)} activeIndex={index} />
      </View>
    </View>
  );
}
