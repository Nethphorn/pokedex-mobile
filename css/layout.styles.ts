import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Platform.OS === "web" ? "#f0f0f0" : "#fff",
    alignItems: "center",
  },
  innerContainer: {
    flex: 1,
    width: "100%",
    maxWidth: Platform.OS === "web" ? 500 : "100%",
    backgroundColor: "#fff",
    // Shadow for web to look like a phone
    ...Platform.select({
      web: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
    }),
  },
});
