import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from "react-native";
import colors from "../../constants/colors";
import { shouldShowJoinCTA, useClassCTAState } from "../../utils/classCta";

export default function ClassCard({ item, onPress }) {
  const ctaState = useClassCTAState(item);
  const joinable = shouldShowJoinCTA(item, ctaState);
  const dateLabel = item?.date || "";
  const timeLabel = item?.time || "";
  const dateTimeLabel = dateLabel && timeLabel ? `${dateLabel} · ${timeLabel}` : dateLabel || timeLabel;

  const handleJoinPress = (event) => {
    event?.stopPropagation?.();
    if (item?.zoomLink) {
      Linking.openURL(item.zoomLink);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(item)} activeOpacity={0.8}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.instructor}>{item.instructor}</Text>
        {!!dateTimeLabel && <Text style={styles.dateTime}>{dateTimeLabel}</Text>}

        <View style={styles.ctaRow}>
          {joinable ? (
            <TouchableOpacity
              style={[styles.ctaButton, styles.joinButton]}
              onPress={handleJoinPress}
              activeOpacity={0.8}
            >
              <Text style={styles.joinText}>Ingresar a la clase</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.ctaButton, styles.detailsButton]} onPress={() => onPress?.(item)}>
              <Text style={styles.detailsText}>Ver detalles</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
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
  instructor: { color: colors.gray, marginTop: 2 },
  dateTime: { color: colors.gray, marginTop: 2 },
  ctaRow: { marginTop: 10 },
  ctaButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  joinButton: {
    backgroundColor: "rgba(193, 122, 76, 0.12)",
    borderColor: "rgba(193, 122, 76, 0.35)",
  },
  detailsButton: {
    backgroundColor: colors.white,
    borderColor: colors.lightGray,
  },
  joinText: { color: colors.primary, fontWeight: "600", fontSize: 12 },
  detailsText: { color: colors.darkText, fontWeight: "500", fontSize: 12 },
});
