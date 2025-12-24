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
import { Feather } from "@expo/vector-icons";
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
      .replace(/[-:]|\\.\d{3}/g, "")}/${end.toISOString().replace(/[-:]|\\.\d{3}/g, "")}`;

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
        <View style={styles.header}>
          <Text style={styles.title}>{classInfo.title}</Text>
          <View style={styles.subtitleRow}>
            <Feather name="user" size={14} color={colors.placeholderText} style={styles.rowIcon} />
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>

        <View style={styles.detailGroup}>
          <View style={styles.detailRow}>
            <Feather name="calendar" size={14} color={colors.placeholderText} style={styles.rowIcon} />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Fecha y hora</Text>
              <Text style={styles.detailValue}>{displayDate || "Por confirmar"}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Feather name="clock" size={14} color={colors.placeholderText} style={styles.rowIcon} />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Duración</Text>
              <Text style={styles.detailValue}>
                {classInfo.duration ? `${classInfo.duration} min` : "Por confirmar"}
              </Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Feather name="briefcase" size={14} color={colors.placeholderText} style={styles.rowIcon} />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Materiales</Text>
              <Text style={styles.detailValue}>{classInfo.materials || "N/A"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.ctaGroup}>
          <TouchableOpacity style={[styles.ctaButton, styles.ctaPrimary]} onPress={addToCalendar}>
            <Text style={[styles.ctaText, styles.ctaPrimaryText]}>Agregar a calendario</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.ctaButton, styles.ctaSecondary, styles.ctaButtonLast]}
            onPress={copyLink}
          >
            <Text style={[styles.ctaText, styles.ctaSecondaryText]}>Copiar enlace</Text>
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
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: colors.background,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    marginHorizontal: 10,
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
    marginBottom: 14,
  },
  header: { marginBottom: 12 },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.darkText,
    letterSpacing: 0.2,
    lineHeight: 26,
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  subtitle: {
    color: colors.placeholderText,
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.2,
    lineHeight: 19,
  },
  rowIcon: { marginRight: 8 },
  detailGroup: { marginBottom: 18 },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  detailText: { flex: 1 },
  detailLabel: {
    fontSize: 11,
    color: colors.gray,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 15,
    color: "rgba(51, 51, 51, 0.75)",
    fontWeight: "500",
    lineHeight: 20,
  },
  ctaGroup: { marginTop: 2 },
  ctaButton: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    marginBottom: 10,
  },
  ctaButtonLast: { marginBottom: 0 },
  ctaPrimary: {
    backgroundColor: "rgba(193, 122, 76, 0.12)",
    borderColor: "rgba(193, 122, 76, 0.35)",
  },
  ctaSecondary: {
    backgroundColor: colors.white,
    borderColor: colors.lightGray,
  },
  ctaText: { fontSize: 14, letterSpacing: 0.2 },
  ctaPrimaryText: { color: colors.primary, fontWeight: "600" },
  ctaSecondaryText: { color: colors.darkText, fontWeight: "500" },
});

export default ClassInfoBottomSheet;
