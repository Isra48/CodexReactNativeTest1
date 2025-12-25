import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, FlatList, StyleSheet, Modal, TouchableOpacity, Alert } from "react-native";
import colors from "../constants/colors";
import { categories, classes, getNextClass } from "../constants/data";
import HeroCard from "../components/cards/HeroCard";
import CategoryCard from "../components/cards/CategoryCard";
import DestinationCard from "../components/cards/DestinationCard";
import { globalStyles } from "../styles/globalStyles";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useNotifications } from "../context/NotificationContext";
import ClassInfoBottomSheet from "../components/common/ClassInfoBottomSheet";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const { shouldShowPermissionPrompt, requestPermissions, markPromptSeen, scheduleClassNotifications } =
    useNotifications();

  const featured = useMemo(() => getNextClass(), []);

  useEffect(() => {
    if (shouldShowPermissionPrompt) {
      setPermissionModalVisible(true);
    }
  }, [shouldShowPermissionPrompt]);

  useEffect(() => {
    if (featured) {
      scheduleClassNotifications(featured);
    }
  }, [featured, scheduleClassNotifications]);

  const handleEnableNotifications = async () => {
    setPermissionModalVisible(false);
    await requestPermissions();
  };

  const handleDismissPermission = () => {
    setPermissionModalVisible(false);
    markPromptSeen();
  };

  const openClassDetails = (classItem) => {
    if (!classItem) return;
    setSelectedClass(classItem);
  };

  const handleJoinLive = (classItem) => {
    if (!classItem) return;
    Alert.alert("Entrar a la clase", "Aquí abriremos Zoom cuando esté listo.");
  };

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.homeHeader}>
        <TouchableOpacity onPress={() => navigation.navigate("ProfileEditor")} activeOpacity={0.7}>
          <View style={styles.smallAvatar}>
            <Feather name="user" size={24} color="#000" />
          </View>
        </TouchableOpacity>
        <Text style={styles.homeTitle}>MindCo</Text>
        <Feather name="search" size={24} color="#000" />
      </View>

      <HeroCard item={featured} onOpenDetails={openClassDetails} onJoinLive={handleJoinLive} />

      <Text style={[globalStyles.sectionTitle, styles.sectionTitle]}>Eventos presenciales</Text>

      <FlatList
        horizontal
        data={categories}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.categoryListContent}
        renderItem={({ item }) => <CategoryCard item={item} onPress={() => {}} />}
      />

      <Text style={[globalStyles.sectionTitle, styles.sectionTitle]}>Clases Populares</Text>

      {classes.slice(0, 4).map((item) => (
        <DestinationCard key={item.id} item={item} onPress={() => openClassDetails(item)} />
      ))}

      <Modal transparent visible={permissionModalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.permissionModal}>
            <Text style={styles.modalTitle}>Recibe recordatorios</Text>
            <Text style={styles.modalText}>Obtén notificaciones para no perder tus clases.</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleDismissPermission}>
                <Text style={styles.secondaryText}>Ahora no</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={handleEnableNotifications}>
                <Text style={styles.primaryText}>Activar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ClassInfoBottomSheet
        visible={!!selectedClass}
        onClose={() => setSelectedClass(null)}
        classInfo={selectedClass}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  homeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 64,
    paddingBottom: 12,
  },

  homeTitle: {
    fontSize: 24,
    fontWeight: "400",
  },

  smallAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    marginLeft: 16,
    marginBottom: 8,
  },
  categoryListContent: {
    paddingLeft: 16,
    paddingBottom: 12,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  permissionModal: {
    width: "82%",
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 6 },
  modalText: { color: colors.gray, marginBottom: 16 },
  modalActions: { flexDirection: "row", justifyContent: "flex-end" },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginLeft: 10,
  },
  primaryText: { color: colors.white, fontWeight: "600" },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  secondaryText: { color: colors.gray },
});
