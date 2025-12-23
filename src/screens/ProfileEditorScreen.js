import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Modal,
  Pressable,
  Appearance,
} from "react-native";
import TextField from "../components/common/TextField";
import PrimaryButton from "../components/buttons/PrimaryButton";
import colors from "../constants/colors";
import { getUser, setUser } from "../utils/storage";
import { globalStyles } from "../styles/globalStyles";
import DateTimePicker from "@react-native-community/datetimepicker";
import PhoneInput from "react-native-phone-number-input";
import { Feather } from "@expo/vector-icons";

export default function ProfileEditorScreen({ navigation }) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const phoneInputRef = useRef(null);
  const [phone, setPhone] = useState("");
  const [formattedPhone, setFormattedPhone] = useState("");

  const [loading, setLoading] = useState(false);

  // 🔒 Forzar Light Mode SOLO en esta pantalla
  useEffect(() => {
    const originalScheme = Appearance.getColorScheme();
    Appearance.setColorScheme("light");

    return () => {
      Appearance.setColorScheme(originalScheme);
    };
  }, []);

  const openDatePicker = () => setShowDatePicker(true);
  const closeDatePicker = () => setShowDatePicker(false);

  const onChangeDate = (_, selectedDate) => {
    if (Platform.OS === "android") {
      closeDatePicker();
    }

    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  const save = async () => {
    if (!name || !lastName || !username || !birthDate || !phone) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    if (!formattedPhone || !phoneInputRef.current?.isValidNumber(phone)) {
      Alert.alert("Número inválido", "Ingresa un número de WhatsApp válido");
      return;
    }

    setLoading(true);
    const user = (await getUser()) || {};

    await setUser({
      ...user,
      name,
      lastName,
      username,
      birthDate,
      phone: formattedPhone,
    });

    navigation.reset({ index: 0, routes: [{ name: "Home" }] });
  };

  const formattedBirthDate = birthDate
    ? birthDate.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    : "";

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 13);

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.profileHeader}>
        <Text style={styles.profileTitle}>Completa tu perfil</Text>
        <Text style={styles.profileSubtitle}>
          Esto nos ayudará a personalizar tu experiencia
        </Text>
      </View>

      <View style={styles.avatarContainer}>
        <View style={styles.avatarPlaceholder}>
          <Feather name="user" size={52} color="#6f6e6e" />
        </View>
        <TouchableOpacity>
          <Text style={styles.changePhotoLink}>Cambiar foto</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <TextField
          placeholder="Nombre o nombres"
          value={name}
          onChangeText={setName}
        />

        <TextField
          placeholder="Apellidos"
          value={lastName}
          onChangeText={setLastName}
        />

        <TextField
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />

        <View style={styles.phoneContainer}>
          <PhoneInput
            ref={phoneInputRef}
            defaultCode="MX"
            layout="first"
            value={phone}
            onChangeText={setPhone}
            onChangeFormattedText={setFormattedPhone}
            containerStyle={styles.phoneInputContainer}
            textContainerStyle={styles.phoneTextContainer}
            textInputStyle={styles.phoneText}
            codeTextStyle={styles.phoneCodeText}
            flagButtonStyle={styles.flagButton}
            textInputProps={{
              keyboardType: "number-pad",
              placeholder: "Número de WhatsApp",
            }}
          />
        </View>

        <TouchableOpacity onPress={openDatePicker} activeOpacity={0.8}>
          <TextField
            placeholder="Fecha de nacimiento"
            value={formattedBirthDate}
            editable={false}
            pointerEvents="none"
          />
        </TouchableOpacity>

        {/* ANDROID */}
        {showDatePicker && Platform.OS === "android" && (
          <DateTimePicker
            value={birthDate || new Date(2000, 0, 1)}
            mode="date"
            maximumDate={maxDate}
            onChange={onChangeDate}
            textColor={colors.darkText}
            themeVariant="light"
            style={{
              width: "100%",
              alignSelf: "center",
            }}

          />
        )}

        {/* iOS */}
        {Platform.OS === "ios" && (
          <Modal
            transparent
            animationType="slide"
            visible={showDatePicker}
            onRequestClose={closeDatePicker}
          >
            <View style={styles.modalOverlay}>
              <Pressable style={styles.backdrop} onPress={closeDatePicker} />

              <View style={styles.iosPickerContainer}>
                <DateTimePicker
                  value={birthDate || new Date(2000, 0, 1)}
                  mode="date"
                  display="spinner"
                  maximumDate={maxDate}
                  onChange={onChangeDate}
                  textColor={colors.darkText}
                  themeVariant="light"
                />

                <TouchableOpacity
                  style={styles.iosPickerDone}
                  onPress={closeDatePicker}
                >
                  <Text style={styles.iosPickerDoneText}>Listo</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        <PrimaryButton title="Guardar" onPress={save} loading={loading} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    paddingHorizontal: 24,
    paddingTop: 32,
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
    paddingTop: 4,
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
  changePhotoLink: {
    marginTop: 12,
    color: colors.primary,
    fontWeight: "600",
    textDecorationLine: "underline",
  },

  formContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  phoneContainer: {
    marginBottom: 16,
  },
  phoneInputContainer: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    backgroundColor: "#FFFFFF", // fijo
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  phoneTextContainer: {
    backgroundColor: "transparent",
    borderRadius: 12,
  },
  phoneText: {
    fontSize: 16,
    color: colors.darkText,
  },
  phoneCodeText: {
    fontSize: 16,
    color: colors.darkText,
  },
  flagButton: {
    borderRadius: 12,
    paddingHorizontal: 8,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
     paddingHorizontal: 0,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  iosPickerContainer: {
    backgroundColor: "#FFFFFF", // fijo
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 12,
    width: "100%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  iosPickerDone: {
    alignItems: "center",
    paddingVertical: 10,
  },
  iosPickerDoneText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 16,
  },
});
