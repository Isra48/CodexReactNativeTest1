import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import colors from "../../constants/colors";

export default function DestinationCard({ item, isFavorite, onToggleFavorite }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onToggleFavorite}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>

      <Text style={styles.favoriteIcon}>{isFavorite ? "❤️" : "🤍"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 14,
    backgroundColor: colors.white,
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.lightGray,
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  title: {
    fontWeight: "700",
    fontSize: 15,
  },
  category: {
    color: colors.gray,
  },
  favoriteIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
});
