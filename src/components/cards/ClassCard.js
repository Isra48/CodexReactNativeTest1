import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import colors from "../../constants/colors";

export default function ClassCard({ item }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text>{item.instructor}</Text>
        <Text>
          {item.date} - {item.time}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: colors.white,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  content: { flex: 1 },
  title: {
    fontWeight: "700",
  },
});
