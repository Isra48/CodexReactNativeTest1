import React from "react";
import { TextInput, StyleSheet } from "react-native";
import colors from "../../constants/colors";

export default function TextField(props) {
  return (
    <TextInput
      placeholderTextColor={colors.placeholderText}
      style={[styles.input, props.style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    fontSize: 14,
    color: colors.darkText,
  },
});
