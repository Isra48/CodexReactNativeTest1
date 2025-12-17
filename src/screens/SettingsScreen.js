import React, { useState } from "react";
import { View, Text, ScrollView, Switch, TouchableOpacity, StyleSheet } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import colors from "../constants/colors";
import { deleteUser } from "../utils/storage";

export default function SettingsScreen({ navigation }) {
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(false);

  const logout = async () => {
    await deleteUser();
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  return (
    <ScrollView style={globalStyles.container}>
      <View style={globalStyles.screenHeader}>
        <Text style={globalStyles.screenTitle}>Ajustes</Text>
      </View>

      <View style={styles.settingsSection}>
        <View style={styles.settingItem}>
          <Text>Notificaciones Push</Text>
          <Switch value={push} onValueChange={setPush} />
        </View>

        <View style={styles.settingItem}>
          <Text>Notificaciones por Email</Text>
          <Switch value={email} onValueChange={setEmail} />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  settingsSection: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: colors.primary,
    marginHorizontal: 24,
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
