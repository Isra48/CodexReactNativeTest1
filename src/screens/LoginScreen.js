import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, Alert, StyleSheet } from "react-native";
import PrimaryButton from "../components/buttons/PrimaryButton";
import TextField from "../components/common/TextField";
import colors from "../constants/colors";
import { setUser } from "../utils/storage";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await setUser({ email });

    navigation.reset({ index: 0, routes: [{ name: "ProfileEditor" }] });
  };

  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500" }}
      style={styles.heroContainer}
    >
      <View style={styles.loginOverlay} />

      <ScrollView contentContainerStyle={styles.loginContent}>
        <View style={styles.loginHeader}>
          <Text style={styles.heroTitle}>Descubre{"\n"}nuevos lugares</Text>
          <Text style={styles.heroSubtitle}>Explora el mundo con nosotros</Text>
        </View>

        <View style={styles.loginForm}>
          <TextField placeholder="Email" value={email} onChangeText={setEmail} />
          <TextField placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />

          <PrimaryButton title="Iniciar sesión" onPress={handleLogin} loading={loading} />

          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.linkText}>Crear una cuenta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  heroContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  loginOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  loginContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  loginHeader: {
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 12,
    lineHeight: 48,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.white,
  },
  loginForm: {
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  linkText: {
    textAlign: "center",
    color: colors.primary,
    fontWeight: "600",
    marginTop: 16,
  },
});
