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

  const displayDate = (() => {
    if (classInfo.date) return classInfo.date;
    if (classInfo.startDateTime) {
      const start = new Date(classInfo.startDateTime);
      if (!Number.isNaN(start.getTime())) {
        return start.toLocaleString();
      }
    }
    return "";
  })();

  const instructorLabel = classInfo.instructor || "Instructor por confirmar";
  const subtitle = classInfo.modality ? `${instructorLabel} · ${classInfo.modality}` : instructorLabel;

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
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.detailGroup}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fecha y hora</Text>
            <Text style={styles.detailValue}>{displayDate || "Por confirmar"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duración</Text>
            <Text style={styles.detailValue}>
              {classInfo.duration ? `${classInfo.duration} min` : "Por confirmar"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Materiales</Text>
            <Text style={styles.detailValue}>{classInfo.materials || "N/A"}</Text>
          </View>
        </View>

        <View style={styles.linkActions}>
          <TouchableOpacity style={styles.linkButton} onPress={addToCalendar}>
            <Text style={styles.linkText}>Agregar al calendario</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkButton} onPress={copyLink}>
            <Text style={styles.linkText}>Copiar enlace</Text>
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
  subtitle: { color: colors.gray, marginBottom: 12 },
  detailGroup: { marginBottom: 10 },
  detailRow: { marginBottom: 10 },
  detailLabel: { fontSize: 12, color: colors.gray, marginBottom: 2 },
  detailValue: { fontSize: 15, color: colors.darkText, fontWeight: "600" },
  linkActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 6,
  },
  linkButton: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  linkText: { color: colors.primary, fontWeight: "600" },
});

export default ClassInfoBottomSheet;
