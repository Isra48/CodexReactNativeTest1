import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import {
  getPastClasses as getPastClassesFromRepository,
  getUpcomingClasses as getUpcomingClassesFromRepository,
} from "../services/content/classes.repository";
import { getPastClasses as getPastMockClasses, getUpcomingClasses as getUpcomingMockClasses } from "../constants/data";
import ClassCard from "../components/cards/ClassCard";
import { globalStyles } from "../styles/globalStyles";
import colors from "../constants/colors";
import ClassInfoBottomSheet from "../components/common/ClassInfoBottomSheet";

export default function ClassesScreen() {
  const [tab, setTab] = useState("upcoming");
  const [selectedClass, setSelectedClass] = useState(null);
  const [upcoming, setUpcoming] = useState(() => getUpcomingMockClasses());
  const [past, setPast] = useState(() => getPastMockClasses());

  const loadClasses = useCallback(async () => {
    try {
      const [upcomingData, pastData] = await Promise.all([
        getUpcomingClassesFromRepository(),
        getPastClassesFromRepository(),
      ]);
      if (upcomingData?.length) setUpcoming(upcomingData);
      if (pastData?.length) setPast(pastData);
    } catch (error) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn("Classes fetch failed", error);
      }
    }
  }, []);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  const data = tab === "upcoming" ? upcoming : past;

  const openClassDetails = (item) => {
    if (!item) return;
    setSelectedClass(item);
  };

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
          <ClassCard key={item.id} item={item} onPress={openClassDetails} />
        ))}
      </ScrollView>

      <ClassInfoBottomSheet
        visible={!!selectedClass}
        onClose={() => setSelectedClass(null)}
        classInfo={selectedClass}
      />
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
