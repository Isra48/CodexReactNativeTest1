import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";

import {
  usePastClassesQuery,
  useUpcomingClassesQuery,
} from "../services/content/classes.queries";

import ClassCard from "../components/cards/ClassCard";
import ClassInfoBottomSheet from "../components/common/ClassInfoBottomSheet";
import SkeletonBlock from "../components/common/SkeletonBlock";

import { globalStyles } from "../styles/globalStyles";
import colors from "../constants/colors";
import { computeClassStatus } from "../utils/scheduling";

export default function ClassesScreen() {
  const [tab, setTab] = useState("upcoming");
  const [selectedClass, setSelectedClass] = useState(null);

  const [timeTick, setTimeTick] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

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

  const {
    data: upcomingData,
    isLoading: isUpcomingLoading,
    isFetching: isUpcomingFetching,
    isError: isUpcomingError,
    refetch,
  } = useUpcomingClassesQuery({ limit: 50 });
  const {
    data: pastData,
    isLoading: isPastLoading,
    isFetching: isPastFetching,
    isError: isPastError,
  } = usePastClassesQuery();

  /**
   * Recalcula estados (live/soon) sin hacer llamadas a la API.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeTick((value) => value + 1);
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const upcoming = useMemo(
    () => [...(upcomingData || [])].sort(sortUpcoming),
    [upcomingData, timeTick]
  );
  const past = useMemo(
    () => [...(pastData || [])].sort(sortPast),
    [pastData]
  );

  const showUpcomingSkeleton =
    !refreshing &&
    !(upcomingData && upcomingData.length) &&
    (isUpcomingLoading || isUpcomingFetching || isUpcomingError);
  const showPastSkeleton =
    !refreshing &&
    !(pastData && pastData.length) &&
    (isPastLoading || isPastFetching || isPastError);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

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
      <ScrollView
        contentContainerStyle={{ padding: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
        }
      >
        {tab === "upcoming" && showUpcomingSkeleton
          ? Array.from({ length: 4 }).map((_, index) => (
              <View key={`upcoming-skeleton-${index}`} style={styles.cardSkeleton}>
                <SkeletonBlock style={styles.cardSkeletonImage} />
                <View style={styles.cardSkeletonContent}>
                  <SkeletonBlock style={styles.cardSkeletonLine} />
                  <SkeletonBlock style={styles.cardSkeletonLineShort} />
                  <SkeletonBlock style={styles.cardSkeletonMeta} />
                </View>
              </View>
            ))
          : tab === "past" && showPastSkeleton
          ? Array.from({ length: 4 }).map((_, index) => (
              <View key={`past-skeleton-${index}`} style={styles.cardSkeleton}>
                <SkeletonBlock style={styles.cardSkeletonImage} />
                <View style={styles.cardSkeletonContent}>
                  <SkeletonBlock style={styles.cardSkeletonLine} />
                  <SkeletonBlock style={styles.cardSkeletonLineShort} />
                  <SkeletonBlock style={styles.cardSkeletonMeta} />
                </View>
              </View>
            ))
          : data.map((item) => (
              <ClassCard
                key={item.id}
                item={item}
                onPress={openClassDetails}
                onJoinLive={handleJoinLive}
              />
            ))}

        {data.length === 0 && !showUpcomingSkeleton && !showPastSkeleton && (
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
  cardSkeleton: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: colors.white,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  cardSkeletonImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  cardSkeletonContent: { flex: 1, justifyContent: "center" },
  cardSkeletonLine: {
    height: 12,
    borderRadius: 6,
    width: "65%",
    marginBottom: 8,
  },
  cardSkeletonLineShort: {
    height: 12,
    borderRadius: 6,
    width: "45%",
    marginBottom: 8,
  },
  cardSkeletonMeta: {
    height: 10,
    borderRadius: 5,
    width: "55%",
  },
});
