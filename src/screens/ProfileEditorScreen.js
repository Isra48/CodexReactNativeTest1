import React, { useState, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Keyboard} from "react-native";
import TextField from "../components/common/TextField";
import PrimaryButton from "../components/buttons/PrimaryButton";
import colors from "../constants/colors";
import { getUser, setUser } from "../utils/storage";
import { globalStyles } from "../styles/globalStyles"
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import PhoneInput from "react-native-phone-number-input";






export default function ProfileEditorScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const phoneInputRef = useRef(null);
  const [phone, setPhone] = useState("");
  const [formattedPhone, setFormattedPhone] = useState("");



  const [loading, setLoading] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);

    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };


  const isValidWhatsAppNumber = (phone) => {
    const digitsOnly = phone.replace(/\D/g, "");
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
  };



  const save = async () => {
    if (!fullName || !username || !birthDate || !phone) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

  if (!formattedPhone || !phoneInputRef.current?.isValidNumber(phone)) {
  Alert.alert(
    "Número inválido",
    "Ingresa un número de WhatsApp válido"
  );
  return;
}


    setLoading(true);
    const user = (await getUser()) || {};

    await setUser({
      ...user,
      fullName,
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
        <View style={styles.phoneContainer}>
  <PhoneInput
    ref={phoneInputRef}
    defaultCode="MX"           // 🇲🇽 país inicial
    layout="first"
    value={phone}
    onChangeText={setPhone}
    onChangeFormattedText={setFormattedPhone}
    withDarkTheme={false}
    withShadow={false}
    autoFocus={false}
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

        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextField
            placeholder="Fecha de nacimiento"
            value={formattedBirthDate}
            editable={false}
            pointerEvents="none"
          />

        

        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={birthDate || new Date(2000, 0, 1)}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            maximumDate={maxDate}
            onChange={onChangeDate}
          />


        )}


        <PrimaryButton title="Guardar" onPress={save} loading={loading} />
      </View>
 

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    paddingHorizontal: 24,
    paddingTop: 82,
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
  phoneContainer: {
  marginBottom: 16,
},

phoneInputContainer: {
  width: "100%",
  height: 56,
  borderRadius: 12,
  backgroundColor: colors.white,      // 👈 igual que TextField
  borderWidth: 1,
  borderColor: colors.lightGray,       // 👈 mismo borde
},

phoneTextContainer: {
  backgroundColor: "transparent",
  borderRadius: 12,
  paddingVertical: 0,
   paddingHorizontal: 0,
},

phoneText: {
  fontSize: 16,
  color: colors.darkText,
},

phoneCodeText: {
  fontSize: 16,
  color: colors.darkText,
},




});
