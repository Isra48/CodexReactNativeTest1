import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { pastClasses, upcomingClasses } from "../constants/data";
import ClassCard from "../components/cards/ClassCard";
import { globalStyles } from "../styles/globalStyles";
import colors from "../constants/colors";

export default function ClassesScreen() {
  const [tab, setTab] = useState("upcoming");
  const data = tab === "upcoming" ? upcomingClasses : pastClasses;

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.screenHeader}>
        <Text style={globalStyles.screenTitle}>Clases</Text>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tab, tab === "upcoming" && styles.tabActive]} onPress={() => setTab("upcoming")}>
          <Text>Próximas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tab, tab === "past" && styles.tabActive]} onPress={() => setTab("past")}>
          <Text>Pasadas</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {data.map((item) => (
          <ClassCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: colors.lightGray,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: "center",
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.secondary,
  },
});
