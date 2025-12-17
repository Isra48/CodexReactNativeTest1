import React from "react";
import { TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import colors from "../../constants/colors";

export default function CategoryCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginRight: 12,
    width: 140,
    height: 140,
    overflow: "hidden",
    borderRadius: 14,
  },
  image: { ...StyleSheet.absoluteFillObject },
  name: {
    position: "absolute",
    bottom: 0,
    padding: 8,
    color: colors.white,
    fontWeight: "700",
  },
});
