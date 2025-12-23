import { StyleSheet } from "react-native";
import colors from "../constants/colors";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  sectionTitle: {
    marginLeft: 24,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "700",
  },
  screenHeader: {
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 10,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "700",
  },
});

export default globalStyles;
