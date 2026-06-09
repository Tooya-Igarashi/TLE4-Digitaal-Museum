import React, { useRef, useEffect, useState } from "react";
import { ScrollView, Dimensions, View } from "react-native";
import ArtistCard from "../Shared/ArtistCard";
import DotIndicator from "../Shared/DotIndicator";

const { width } = Dimensions.get("window");
const CARD_MAX_WIDTH = 420;
const CARD_MARGIN_HORIZONTAL = 8; // matches ArtistCard.marginHorizontal

export default function ArtistsCarousel({ artists = [] }) {
  const ref = useRef(null);
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  const ITEM_WIDTH = Math.min(width * 0.9, CARD_MAX_WIDTH);
  const ITEM_SPACING = CARD_MARGIN_HORIZONTAL * 2; // total horizontal margin per item
  const ITEM_TOTAL = ITEM_WIDTH + ITEM_SPACING;

  const startInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % artists.length;
        if (ref.current)
          ref.current.scrollTo({ x: next * ITEM_TOTAL, animated: true });
        return next;
      });
    }, 5000);
  };

  useEffect(() => {
    startInterval();
    return () => clearInterval(intervalRef.current);
  }, [artists]);

  return (
    <View style={{ position: "relative" }}>
      <ScrollView
        ref={ref}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ height: 380 }}
        pagingEnabled
        onScrollBeginDrag={() => clearInterval(intervalRef.current)}
        onMomentumScrollEnd={(ev) => {
          const idx = Math.round(ev.nativeEvent.contentOffset.x / ITEM_TOTAL);
          setIndex(idx);
          startInterval();
        }}
      >
        {artists.map((artist) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            width={ITEM_WIDTH}
            height={Math.min(380 * 0.8, 320)}
          />
        ))}
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 8,
          left: 0,
          right: 0,
          alignItems: "center",
          zIndex: 4,
        }}
        pointerEvents="none"
      >
        <DotIndicator count={artists.length} activeIndex={index} />
      </View>
    </View>
  );
}
