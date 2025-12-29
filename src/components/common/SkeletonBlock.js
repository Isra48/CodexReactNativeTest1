import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import colors from "../../constants/colors";

const MIN_OPACITY = 0.45;
const MAX_OPACITY = 0.85;
const ANIMATION_MS = 700;

const SkeletonBlock = ({ style }) => {
  const opacity = useRef(new Animated.Value(MIN_OPACITY)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: MAX_OPACITY,
          duration: ANIMATION_MS,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: MIN_OPACITY,
          duration: ANIMATION_MS,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return <Animated.View style={[styles.block, style, { opacity }]} />;
};

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.lightGray,
  },
});

export default SkeletonBlock;
