import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link, Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const COLUMN_count = 2;
const CARD_WIDTH = (width - 48) / COLUMN_count; // 48 = padding (16*3) for gap

interface Pokemon {
  name: string;
  url: string;
  image: string;
  id: number;
  types: {
    type: {
      name: string;
    };
  }[];
}

// Pastel background colors based on type
const typeColors: Record<string, string> = {
  normal: "#EAEADE",
  fire: "#F7E2CC",
  water: "#D6EAF8",
  grass: "#D2EBD3",
  electric: "#F9F1D0",
  ice: "#DBF0F0",
  fighting: "#E6D0D0",
  poison: "#E0D0E0",
  ground: "#EBDDBF",
  flying: "#DCE5EA",
  psychic: "#F6D6D6",
  bug: "#E0E6C8",
  rock: "#E2DFC7",
  ghost: "#D7D2E0",
  dragon: "#D8D0F0",
  steel: "#E6E6EB",
  dark: "#D6D1D1",
  fairy: "#F4D6DF",
};

export default function Index() {
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchPokemonData();
  }, []);

  async function fetchPokemonData() {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=52",
      );
      const data = await response.json();

      const detailedPokemonData = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const response = await fetch(pokemon.url);
          const details = await response.json();
          return {
            name: pokemon.name,
            url: pokemon.url,
            image:
              details.sprites.other["official-artwork"].front_default ||
              details.sprites.front_default,
            id: details.id,
            types: details.types,
          };
        }),
      );

      setPokemonData(detailedPokemonData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const filteredPokemon = pokemonData.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toString().includes(search),
  );

  const renderItem = ({ item }: { item: Pokemon }) => {
    const mainType = item.types[0].type.name;
    const backgroundColor = typeColors[mainType] || "#F2F2F2";

    return (
      <Link
        href={{ pathname: "/details", params: { name: item.name } }}
        asChild
      >
        <TouchableOpacity
          style={StyleSheet.flatten([styles.card, { backgroundColor }])}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              contentFit="contain"
            />
          </View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.id}>{item.id.toString().padStart(3, "0")}</Text>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <View
      style={StyleSheet.flatten([
        styles.container,
        {
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ])}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Text style={styles.title}>Pokédex</Text>
        <Text style={styles.subtitle}>
          Search for a Pokémon by name or using its National Pokédex number.
        </Text>

        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons
              name="search"
              size={20}
              color="#666"
              style={{ marginRight: 8 }}
            />
            <TextInput
              placeholder="Name or number"
              placeholderTextColor="#999"
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2E3A59" />
        </View>
      ) : (
        <FlatList
          data={filteredPokemon}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.3, // Aspect ratio
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
});
