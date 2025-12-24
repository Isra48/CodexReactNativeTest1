import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import colors from "../../constants/colors";

const THIRTY_MINUTES_MS = 30 * 60 * 1000;

const getClassState = (classItem) => {
  if (!classItem) return "future";
  if (classItem.live) return "live";

  if (classItem.startDateTime) {
    const start = new Date(classItem.startDateTime);
    if (!Number.isNaN(start.getTime())) {
      const now = new Date();
      const diffMs = start.getTime() - now.getTime();
      const durationMs = (classItem.duration || 60) * 60000;

      if (diffMs <= 0 && Math.abs(diffMs) <= durationMs) {
        return "live";
      }

      if (diffMs > 0 && diffMs <= THIRTY_MINUTES_MS) {
        return "soon";
      }
    }
  }

  return "future";
};

export default function HeroCard({ item, onOpenDetails, onJoinLive }) {
  if (!item) return null;

  const classState = getClassState(item);
  const isLive = classState === "live";
  const ctaLabel = isLive ? "Entrar a la clase" : classState === "soon" ? "Entrar pronto" : "Ver detalles";

  const handleCtaPress = () => {
    if (isLive) {
      if (onJoinLive) onJoinLive(item);
      return;
    }
    if (onOpenDetails) onOpenDetails(item);
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.overlay}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Proxima Clase</Text>
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>

        <TouchableOpacity style={styles.ctaButton} activeOpacity={0.9} onPress={handleCtaPress}>
          <Text style={styles.ctaText}>{ctaLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 24,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: colors.lightGray,
    height: 335,
    marginBottom: 20,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    flex: 1,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "space-between",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  badgeText: { color: colors.white, fontSize: 11, fontWeight: "700" },
  title: { fontSize: 22, color: colors.white, fontWeight: "700" },
  description: { color: colors.white },
  textBlock: { paddingTop: 6 },
  ctaButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    width: "100%",
  },
  ctaText: { color: colors.white, fontSize: 15, fontWeight: "700" },
});
