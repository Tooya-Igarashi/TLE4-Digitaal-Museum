import React, { useRef, useEffect, useState } from "react";
import { ScrollView, Dimensions, View } from "react-native";
import ArtistCard from "../Shared/ArtistCard";
import DotIndicator from "../Shared/DotIndicator";

const CARD_MARGIN_HORIZONTAL = 8;

function getColumns(screenWidth) {
  if (screenWidth >= 800) return 3;
  if (screenWidth >= 500) return 2;
  return 1;
}

export default function ArtistsCarousel({ artists = [] }) {
  const ref = useRef(null);
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width,
  );

  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => sub?.remove();
  }, []);

  const columns = getColumns(screenWidth);

  const CARD_WIDTH =
    (screenWidth - CARD_MARGIN_HORIZONTAL * 2 * columns) / columns;
  const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN_HORIZONTAL * 2;
  const CARD_HEIGHT = Math.min(screenWidth * 0.5, 320);
  const CAROUSEL_HEIGHT = CARD_HEIGHT + 40;

  const maxIndex = Math.max(0, artists.length - columns);
  const dotCount = maxIndex + 1;

  const scrollToIndex = (i, animated = true) => {
    if (ref.current) {
      ref.current.scrollTo({ x: i * SNAP_INTERVAL, animated });
    }
  };

  const startInterval = () => {
    clearInterval(intervalRef.current);
    if (dotCount <= 1) return;
    intervalRef.current = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % dotCount;
        scrollToIndex(next);
        return next;
      });
    }, 5000);
  };

  useEffect(() => {
    setIndex(0);
    scrollToIndex(0, false);
    startInterval();
    return () => clearInterval(intervalRef.current);
  }, [artists, columns]);

  return (
    <View style={{ position: "relative", height: CAROUSEL_HEIGHT }}>
      <ScrollView
        ref={ref}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ height: CARD_HEIGHT }}
        snapToInterval={SNAP_INTERVAL}
        snapToAlignment="start"
        decelerationRate="fast"
        onScrollBeginDrag={() => clearInterval(intervalRef.current)}
        onMomentumScrollEnd={(ev) => {
          const i = Math.round(ev.nativeEvent.contentOffset.x / SNAP_INTERVAL);
          setIndex(i);
          startInterval();
        }}
      >
        {artists.map((artist, i) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            width={CARD_WIDTH}
            height={CARD_HEIGHT}
            index={i}
          />
        ))}
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 4,
          left: 0,
          right: 0,
          alignItems: "center",
          zIndex: 4,
        }}
        pointerEvents="none"
      >
        <DotIndicator count={dotCount} activeIndex={index} columns={columns} />
      </View>
    </View>
  );
}
