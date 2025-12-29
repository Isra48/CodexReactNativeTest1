import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Alert,
  StyleSheet,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import PrimaryButton from "../components/buttons/PrimaryButton";
import TextField from "../components/common/TextField";
import SkeletonBlock from "../components/common/SkeletonBlock";
import colors from "../constants/colors";
import { setUser } from "../utils/storage";
import { KeyboardAvoidingView, Platform } from "react-native";
import loginBg from "../../assets/images/Welcome.png";
import { useLoginContentQuery } from "../services/content/login.queries";


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    data: loginContent,
    isLoading: isLoginContentLoading,
    isFetching: isLoginContentFetching,
    isError: isLoginContentError,
  } = useLoginContentQuery();

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

  const showLoginSkeleton =
    !loginContent?.title &&
    (isLoginContentLoading || isLoginContentFetching || isLoginContentError);
  const title = loginContent?.title || "MindCo";
  const description = loginContent?.description || "Explora tu nueva comunidad.";
  const backgroundMedia = loginContent?.backgroundMedia;
  const isVideoBackground =
    backgroundMedia?.type === "video" && backgroundMedia?.url;
  const backgroundSource = backgroundMedia?.url
    ? typeof backgroundMedia.url === "number"
      ? backgroundMedia.url
      : { uri: backgroundMedia.url }
    : loginBg;

  return (
    <View style={styles.heroContainer}>
      {isVideoBackground ? (
        <Video
          source={backgroundSource}
          style={StyleSheet.absoluteFillObject}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          isMuted
        />
      ) : (
        <ImageBackground
          source={backgroundSource}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      )}

      <View style={styles.loginOverlay} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.loginContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.loginWrapper}>
            {/* TEXTO FUERA DEL FORM */}
            <View style={styles.loginHeader}>
              {showLoginSkeleton ? (
                <>
                  <SkeletonBlock style={styles.loginTitleSkeleton} />
                  <SkeletonBlock style={styles.loginSubtitleSkeleton} />
                </>
              ) : (
                <>
                  <Text style={styles.heroTitle}>{title}</Text>
                  <Text style={styles.heroSubtitle}>{description}</Text>
                </>
              )}
            </View>

            {/* FORM */}
            <View style={styles.loginForm}>
              <TextField
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
              <TextField
                placeholder="Contraseña"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <PrimaryButton
                title="Iniciar sesión"
                onPress={handleLogin}
                loading={loading}
              />

              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.linkText}>Crear una cuenta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

      </KeyboardAvoidingView>
    </View>
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
    justifyContent: "flex-end",
    
  },
  loginHeader: {
    paddingHorizontal: 24,
    paddingTop: 60,
    marginBottom: 32
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 6,
    lineHeight: 48,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.white,
  },
  loginTitleSkeleton: {
    height: 40,
    borderRadius: 10,
    width: 180,
    marginBottom: 10,
  },
  loginSubtitleSkeleton: {
    height: 16,
    borderRadius: 8,
    width: 220,
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
