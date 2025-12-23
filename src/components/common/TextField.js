import React, { useState } from "react";
import { TextInput, StyleSheet } from "react-native";
import colors from "../../constants/colors";

export default function TextField(props) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      {...props}
      style={[
        styles.input,
        isFocused && styles.focusedInput,
      ]}
      placeholderTextColor={colors.gray}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.white,     // ✅ FONDO BLANCO
    borderWidth: 1,
    borderColor: colors.lightGray,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.darkText,
    marginBottom: 16,
  },

  focusedInput: {
    borderColor: colors.primary,       
  },
});
