import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

import {
  getPastClasses,
  getUpcomingClasses,
} from "../services/content/classes.repository";

import ClassCard from "../components/cards/ClassCard";
import ClassInfoBottomSheet from "../components/common/ClassInfoBottomSheet";

import { globalStyles } from "../styles/globalStyles";
import colors from "../constants/colors";
import { computeClassStatus } from "../utils/scheduling";

export default function ClassesScreen() {
  const [tab, setTab] = useState("upcoming");
  const [selectedClass, setSelectedClass] = useState(null);

  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);

  /**
   * Orden:
   * 1. Live arriba
   * 2. Luego por fecha ascendente
   */
  const sortUpcoming = (a, b) => {
    const aStatus = computeClassStatus(a.startDateTime);
    const bStatus = computeClassStatus(b.startDateTime);

    if (aStatus === "live" && bStatus !== "live") return -1;
    if (aStatus !== "live" && bStatus === "live") return 1;

    return new Date(a.startDateTime) - new Date(b.startDateTime);
  };

  /**
   * Pasadas: más reciente primero
   */
  const sortPast = (a, b) =>
    new Date(b.startDateTime) - new Date(a.startDateTime);

  const loadClasses = useCallback(async () => {
    try {
      const [upcomingData, pastData] = await Promise.all([
        getUpcomingClasses({ limit: 50 }),
        getPastClasses(),
      ]);

      if (upcomingData) {
        setUpcoming([...upcomingData].sort(sortUpcoming));
      }

      if (pastData) {
        setPast([...pastData].sort(sortPast));
      }
    } catch (error) {
      if (__DEV__) {
        console.warn("Classes fetch failed");
        console.error(error);
      }
    }
  }, []);

  /**
   * Carga inicial + auto refresh cada minuto
   */
  useEffect(() => {
    loadClasses();
    const interval = setInterval(loadClasses, 60 * 1000);
    return () => clearInterval(interval);
  }, [loadClasses]);

  const data = tab === "upcoming" ? upcoming : past;

  const openClassDetails = (item) => {
    if (!item) return;
    setSelectedClass(item);
  };

  const handleJoinLive = (item) => {
    // Aquí luego conectas Zoom / deep link
    alert("Entrando a la clase en vivo");
  };

  return (
    <View style={globalStyles.container}>
      {/* Header */}
      <View style={globalStyles.screenHeader}>
        <Text style={globalStyles.screenTitle}>Clases</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, tab === "upcoming" && styles.tabActive]}
          onPress={() => setTab("upcoming")}
        >
          <Text>Próximas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, tab === "past" && styles.tabActive]}
          onPress={() => setTab("past")}
        >
          <Text>Pasadas</Text>
        </TouchableOpacity>
      </View>

      {/* Listado */}
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {data.map((item) => (
          <ClassCard
            key={item.id}
            item={item}
            onPress={openClassDetails}
            onJoinLive={handleJoinLive}
          />
        ))}

        {data.length === 0 && (
          <Text style={styles.emptyText}>
            No hay clases para mostrar.
          </Text>
        )}
      </ScrollView>

      {/* Bottom sheet */}
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
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: colors.gray,
  },
});
