import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";
import Clipboard from "react-native/Libraries/Components/Clipboard/Clipboard";
import colors from "../../constants/colors";

const ClassInfoBottomSheet = ({ visible, onClose, classInfo }) => {
  const translateY = useRef(new Animated.Value(300)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 120, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 300, duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [opacity, translateY, visible]);

  if (!classInfo) return null;

  const displayDate = classInfo.date
    ? classInfo.date
    : classInfo.startDateTime
    ? new Date(classInfo.startDateTime).toLocaleString()
    : "";

  const addToCalendar = () => {
    if (!classInfo.startDateTime) return;
    const start = new Date(classInfo.startDateTime);
    const end = new Date(start.getTime() + (classInfo.duration || 60) * 60000);
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      classInfo.title
    )}&details=${encodeURIComponent(classInfo.link || "https://zoom.us/j/123456789")}&dates=${start
      .toISOString()
      .replace(/[-:]|\.\d{3}/g, "")}/${end.toISOString().replace(/[-:]|\.\d{3}/g, "")}`;

    Linking.openURL(url);
  };

  const copyLink = () => {
    if (classInfo.link) {
      Clipboard.setString(classInfo.link);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.backdrop, { opacity }]}> 
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}> 
        <View style={styles.grabber} />
        <Text style={styles.title}>{classInfo.title}</Text>
        <Text style={styles.meta}>{classInfo.instructor}</Text>
        <Text style={styles.meta}>{classInfo.modality}</Text>
        <Text style={styles.meta}>Materiales: {classInfo.materials || "N/A"}</Text>
        <Text style={styles.meta}>Duración: {classInfo.duration || 0} min</Text>
        <Text style={styles.meta}>Fecha: {displayDate}</Text>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} onPress={addToCalendar}>
            <Text style={styles.actionText}>Agregar al calendario</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.secondaryAction]} onPress={copyLink}>
            <Text style={[styles.actionText, styles.secondaryText]}>Copiar enlace</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginHorizontal: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: -2 },
    elevation: 6,
  },
  grabber: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.lightGray,
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 6 },
  meta: { color: colors.gray, marginBottom: 4 },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginRight: 8,
  },
  secondaryAction: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    marginRight: 0,
    marginLeft: 8,
  },
  actionText: { color: colors.white, fontWeight: "600" },
  secondaryText: { color: colors.primary },
});

export default ClassInfoBottomSheet;
