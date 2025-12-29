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
import { useRegisterContentQuery } from "../services/content/register.queries";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    data: registerContent,
    isLoading: isRegisterContentLoading,
    isFetching: isRegisterContentFetching,
    isError: isRegisterContentError,
  } = useRegisterContentQuery();

  const handleRegister = async () => {
    if (!email || !password || !confirm) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await setUser({ email });

    navigation.reset({ index: 0, routes: [{ name: "ProfileEditor" }] });
  };

  const showRegisterSkeleton =
    !registerContent?.title &&
    (isRegisterContentLoading ||
      isRegisterContentFetching ||
      isRegisterContentError);
  const title = registerContent?.title || "Crear cuenta";
  const description =
    registerContent?.description || "Únete a nuestra comunidad MindCo";
  const backgroundMedia = registerContent?.backgroundMedia;
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

      <ScrollView
        contentContainerStyle={styles.loginContent}
        keyboardShouldPersistTaps="handled"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.loginWrapper}>
            {/* HEADER */}
            <View style={styles.loginHeader}>
              {showRegisterSkeleton ? (
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
          <TextField placeholder="Email" value={email} onChangeText={setEmail} />
          <TextField
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextField
            placeholder="Confirmar contraseña"
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
          />

          <PrimaryButton
            title="Registrar"
            onPress={handleRegister}
            loading={loading}
          />

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.linkText}>Ya tengo cuenta</Text>
          </TouchableOpacity>
        </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
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
    marginBottom: 4,
    lineHeight: 38,
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
