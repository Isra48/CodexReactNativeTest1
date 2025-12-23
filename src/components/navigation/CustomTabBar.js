import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "../../constants/colors";
import { Feather } from "@expo/vector-icons";


const icons = {
  Home: "home",
  Classes: "video",
  Settings: "settings",
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
            <Feather
              name={icons[label]}
              size={22}
              color={isFocused ? colors.secondary : colors.gray}
            />

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
    paddingBottom: 26,
    
    borderTopWidth: 2,
    borderColor: colors.lightGray,
    
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
     paddingTop: 6,
   
  
  
  },
  tabItemActive: {
    borderTopWidth: 4,
     paddingTop: 6,
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
