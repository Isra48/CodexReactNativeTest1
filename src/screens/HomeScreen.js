import React, { useState } from "react";
import { View, Text, ScrollView, FlatList, StyleSheet } from "react-native";
import colors from "../constants/colors";
import { categories, destinations } from "../constants/data";
import HeroCard from "../components/cards/HeroCard";
import CategoryCard from "../components/cards/CategoryCard";
import DestinationCard from "../components/cards/DestinationCard";
import { globalStyles } from "../styles/globalStyles";

export default function HomeScreen() {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const featured = destinations[0];

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.homeHeader}>
        <View style={styles.smallAvatar}><Text>👤</Text></View>
        <Text style={styles.homeTitle}>Descubre Lugares</Text>
        <Text style={styles.searchIcon}>🔍</Text>
      </View>

      <HeroCard
        item={featured}
        isFavorite={favorites.includes(featured.id)}
        onToggleFavorite={() => toggleFavorite(featured.id)}
      />

      <Text style={globalStyles.sectionTitle}>Categorías</Text>

      <FlatList
        horizontal
        data={categories}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingLeft: 24, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <CategoryCard item={item} onPress={() => {}} />
        )}
      />

      <Text style={globalStyles.sectionTitle}>Destinos Populares</Text>

      {destinations.map((item) => (
        <DestinationCard
          key={item.id}
          item={item}
          isFavorite={favorites.includes(item.id)}
          onToggleFavorite={() => toggleFavorite(item.id)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  homeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  smallAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  homeTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  searchIcon: {
    fontSize: 22,
  },
});
