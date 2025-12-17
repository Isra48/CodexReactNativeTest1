import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "../../constants/colors";

const icons = {
  Home: "🏠",
  Classes: "🎥",
  Settings: "⚙️",
};

export default function CustomTabBar({ state, navigation }) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const label = route.name;

        return (
          <TouchableOpacity
            key={label}
            onPress={() => navigation.navigate(route.name)}
            style={[styles.tabItem, isFocused && styles.tabItemActive]}
          >
            <Text style={styles.icon}>{icons[label]}</Text>
            <Text style={isFocused ? styles.tabLabelActive : styles.tabLabel}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: colors.white,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: colors.lightGray,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
  },
  tabItemActive: {
    borderTopWidth: 2,
    borderTopColor: colors.secondary,
  },
  icon: {
    fontSize: 22,
  },
  tabLabel: {
    color: colors.gray,
  },
  tabLabelActive: {
    color: colors.secondary,
    fontWeight: "700",
  },
});
