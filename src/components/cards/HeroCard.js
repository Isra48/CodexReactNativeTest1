import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import colors from "../../constants/colors";

const getBadgeConfig = (state) => {
  switch (state) {
    case "starting_soon":
      return { text: "Por comenzar", color: "#24244A" };
    case "live":
      return { text: "En curso", color: "#C35B4A" };
    case "upcoming":
    default:
      return { text: "Próxima clase", color: colors.secondary };
  }
};
const getClassState = (item) => {
  if (!item?.startDateTime) return "upcoming";

  const now = new Date();
  const start = new Date(item.startDateTime);

  if (Number.isNaN(start.getTime())) return "upcoming";

  const diffMinutes = (start - now) / 60000;

  if (diffMinutes <= 0 && diffMinutes >= -90) return "live";
  if (diffMinutes > 0 && diffMinutes <= 30) return "starting_soon";

  return "upcoming";
};


export default function HeroCard({ item, onOpenDetails, onJoinLive }) {
  if (!item) return null;

  const classState = getClassState(item);
  const isJoinable = classState === "live";
  const ctaLabel = isJoinable ? "Entrar a la clase" : "Ver detalles";
  const badgeConfig = getBadgeConfig(classState);

  const handleCtaPress = () => {
    if (isJoinable) {
      onJoinLive?.(item);
    } else {
      onOpenDetails?.(item);
    }
  };

  const hasImage = typeof item.image === "string" && item.image.length > 0;

  return (
    <View style={styles.card}>
      {hasImage ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: colors.lightGray },
          ]}
        />
      )}

      <View style={styles.overlay}>
        <View style={[styles.badge, { backgroundColor: badgeConfig.color }]}>
          <Text style={styles.badgeText}>{badgeConfig.text}</Text>
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.title}>{item.title || ""}</Text>

          {item.description ? (
            <Text style={styles.description}>{item.description}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.ctaButton}
          activeOpacity={0.9}
          onPress={handleCtaPress}
        >
          <Text style={styles.ctaText}>{ctaLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  card: {
    marginHorizontal: 18,
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
