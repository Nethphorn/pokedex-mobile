import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#2E3A59",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#7E8495",
    marginBottom: 20,
    lineHeight: 20,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F8F9",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: "#EBF3F5",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  filterBtn: {
    width: 50,
    height: 50,
    backgroundColor: "#5D5F7E", // Dark grayish blue
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
  },
  image: {
    width: "90%",
    height: "90%",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E3A59",
    textTransform: "capitalize",
    marginBottom: 4,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  id: {
    fontSize: 14,
    color: "#7E8495",
    fontWeight: "600",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  retryBtn: {
    backgroundColor: "#2E3A59",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFF",
    fontWeight: "600",
  },
});
