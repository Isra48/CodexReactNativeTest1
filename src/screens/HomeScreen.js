import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import colors from "../constants/colors";
import { categories } from "../constants/data";
import { globalStyles } from "../styles/globalStyles";

import HeroCard from "../components/cards/HeroCard";
import CategoryCard from "../components/cards/CategoryCard";
import DestinationCard from "../components/cards/DestinationCard";
import ClassInfoBottomSheet from "../components/common/ClassInfoBottomSheet";

import {
  getHeroClass,
  getHomeClasses,
} from "../services/content/classes.repository";


import { useNotifications } from "../context/NotificationContext";

export default function HomeScreen() {
  const navigation = useNavigation();

  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [featured, setFeatured] = useState(null);
  const [classList, setClassList] = useState([]);

  const {
    shouldShowPermissionPrompt,
    requestPermissions,
    markPromptSeen,
    scheduleClassNotifications,
  } = useNotifications();

useEffect(() => {
  let isMounted = true;

  const hydrateContent = async () => {
    try {
      const [hero, list] = await Promise.all([
        getHeroClass(),
        getHomeClasses({ limit: 4 }),
      ]);

      if (!isMounted) return;

      setFeatured(hero);
      setClassList(list.filter(item => item.id !== hero?.id));
    } catch (error) {
      if (__DEV__) {
        console.warn("Home content fetch failed");
        console.error(error);
      }
    }
  };

  hydrateContent();

  return () => {
    isMounted = false;
  };
}, []);

  

  /**
   * Mostrar modal de permisos de notificaciones
   */
  useEffect(() => {
    if (shouldShowPermissionPrompt) {
      setPermissionModalVisible(true);
    }
  }, [shouldShowPermissionPrompt]);

  /**
   * Agendar notificaciones para la clase destacada
   */
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

  const handleJoinLive = () => {
    Alert.alert(
      "Entrar a la clase",
      "Aquí se abrirá Zoom cuando la clase esté en vivo."
    );
  };

  return (
    <ScrollView style={globalStyles.container}>
      {/* Header */}
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

      {/* Hero */}
      {featured && (
        <HeroCard
          item={featured}
          onOpenDetails={openClassDetails}
          onJoinLive={handleJoinLive}
        />
      )}

      {/* Categorías */}
      <Text style={[globalStyles.sectionTitle, styles.sectionTitle]}>
        Eventos presenciales
      </Text>

      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.categoryListContent}
        renderItem={({ item }) => (
          <CategoryCard item={item} onPress={() => {}} />
        )}
        showsHorizontalScrollIndicator={false}
      />

      {/* Próximas clases */}
      {classList.length > 0 && (
        <>
          <Text style={[globalStyles.sectionTitle, styles.sectionTitle]}>
            Próximas clases
          </Text>

          {classList.map((item) => (
            <DestinationCard
              key={item.id}
              item={item}
              onPress={() => openClassDetails(item)}
            />
          ))}
        </>
      )}

      {/* Modal permisos notificaciones */}
      <Modal transparent visible={permissionModalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.permissionModal}>
            <Text style={styles.modalTitle}>Recibe recordatorios</Text>
            <Text style={styles.modalText}>
              Obtén notificaciones para no perder tus clases.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleDismissPermission}
              >
                <Text style={styles.secondaryText}>Ahora no</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleEnableNotifications}
              >
                <Text style={styles.primaryText}>Activar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom sheet */}
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  modalText: {
    color: colors.gray,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginLeft: 10,
  },
  primaryText: {
    color: colors.white,
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  secondaryText: {
    color: colors.gray,
  },
});
