import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFF7F8", // Very light background
  },
  content: {
    paddingBottom: 40,
    paddingTop: 60, // Space for transparent header
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  pokemonName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E3A59", // Dark blue-gray
  },
  pokemonId: {
    fontSize: 16,
    color: "#7E8495",
    marginTop: 4,
    fontWeight: "600",
  },
  imageCard: {
    backgroundColor: "#A8D8D4", // Light teal/green card background
    borderRadius: 20,
    marginHorizontal: 20,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    // Add shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  mainImage: {
    width: 250,
    height: 250,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    justifyContent: "space-between", // Distribute evenly
  },
  tab: {
    paddingVertical: 8,
    marginRight: 15,
  },
  tabText: {
    fontSize: 16,
    color: "#A0A7BA",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#2E3A59",
    fontWeight: "bold",
  },
  sectionContainer: {
    paddingHorizontal: 20,
  },
  formsList: {
    marginBottom: 20,
  },
  varietyItem: {
    marginRight: 15,
    alignItems: "center",
  },
  varietyImageContainer: {
    backgroundColor: "#E2EAEB", // Slightly darker than bg
    borderRadius: 15,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  varietyImage: {
    width: 60,
    height: 60,
  },
  varietyName: {
    fontSize: 12,
    color: "#7E8495",
  },
  infoBlock: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E3A59",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: "#7E8495",
    lineHeight: 22,
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
