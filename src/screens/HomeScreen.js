import React, { useState } from "react";
import { View, Text, ScrollView, FlatList, StyleSheet } from "react-native";
import colors from "../constants/colors";
import { categories, destinations } from "../constants/data";
import HeroCard from "../components/cards/HeroCard";
import CategoryCard from "../components/cards/CategoryCard";
import DestinationCard from "../components/cards/DestinationCard";
import { globalStyles } from "../styles/globalStyles";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from '@expo/vector-icons';



export default function HomeScreen() {
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

  const toggleFavorite = (id) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const featured = destinations[0];

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.homeHeader}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ProfileEditor")}
          activeOpacity={0.7}
        >
          <View style={styles.smallAvatar}>
          <Feather name="user" size={24} color="#000" />

          </View>
        </TouchableOpacity>
        <Text style={styles.homeTitle}>MindCo</Text>
         <Feather name="search" size={24} color="#000" />
      </View>

      <HeroCard
        item={featured}
        isFavorite={favorites.includes(featured.id)}
        onToggleFavorite={() => toggleFavorite(featured.id)}
      />

      <Text style={globalStyles.sectionTitle}>Eventos presenciales</Text>

      <FlatList
        horizontal
        data={categories}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingLeft: 24, paddingBottom: 20,  }}
        renderItem={({ item }) => (
          <CategoryCard item={item} onPress={() => { }} />
        )}
      />

      <Text style={globalStyles.sectionTitle}>Clases Populares</Text>

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
    paddingTop: 72,
    paddingBottom: 20,
  },
 
  homeTitle: {
    fontSize: 24,
    fontWeight: "400",
  },

});
