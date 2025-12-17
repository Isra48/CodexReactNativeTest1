import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import colors from "../../constants/colors";

export default function HeroCard({ item, isFavorite, onToggleFavorite }) {
  if (!item) return null;

  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.overlay}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>DESTACADO</Text>
        </View>

        <View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>

        <TouchableOpacity onPress={onToggleFavorite}>
          <Text style={styles.favoriteIcon}>{isFavorite ? "❤️" : "🤍"}</Text>
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
    height: 300,
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
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: { color: colors.white, fontSize: 11, fontWeight: "700" },
  title: { fontSize: 22, color: colors.white, fontWeight: "700" },
  description: { color: colors.white },
  favoriteIcon: {
    fontSize: 20,
    alignSelf: "flex-start",
  },
});
