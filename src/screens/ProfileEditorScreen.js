import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import TextField from "../components/common/TextField";
import PrimaryButton from "../components/buttons/PrimaryButton";
import colors from "../constants/colors";
import { getUser, setUser } from "../utils/storage";
import { globalStyles } from "../styles/globalStyles";

export default function ProfileEditorScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!fullName || !username || !birthDate) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    setLoading(true);
    const user = (await getUser()) || {};
    await setUser({ ...user, fullName, username, birthDate });

    navigation.reset({ index: 0, routes: [{ name: "Home" }] });
  };

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.profileHeader}>
        <Text style={styles.profileTitle}>Completa tu perfil</Text>
        <Text style={styles.profileSubtitle}>Esto nos ayudará a personalizar tu experiencia</Text>
      </View>

      <View style={styles.avatarContainer}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.changePhotoLink}>Cambiar foto</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <TextField placeholder="Nombre completo" value={fullName} onChangeText={setFullName} />
        <TextField placeholder="Username" value={username} onChangeText={setUsername} />
        <TextField placeholder="Fecha de nacimiento" value={birthDate} onChangeText={setBirthDate} />

        <PrimaryButton title="Guardar" onPress={save} loading={loading} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 24,
  },
  profileTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.darkText,
  },
  profileSubtitle: {
    fontSize: 14,
    color: colors.gray,
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 48,
  },
  changePhotoLink: {
    marginTop: 12,
    color: colors.primary,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  formContainer: {
    paddingHorizontal: 24,
  },
});
