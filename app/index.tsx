import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link, Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "../css/index.styles";
import { typeColors } from "../css/typeColors";

const COLUMN_count = 2;

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

export default function Index() {
  const { width } = useWindowDimensions();
  const actualWidth = Math.min(width, 500); // Respect the 500px max width from layout
  const cardWidth = (actualWidth - 48) / COLUMN_count;

  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchPokemonData();
  }, []);

  async function fetchPokemonData() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      setError(null);
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=52",
        { signal: controller.signal },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data = await response.json();

      const detailedPokemonData = await Promise.all(
        data.results.map(async (pokemon: any) => {
          try {
            const detailResponse = await fetch(pokemon.url, {
              signal: controller.signal,
            });
            const details = await detailResponse.json();
            return {
              name: pokemon.name,
              url: pokemon.url,
              image:
                details.sprites.other["official-artwork"].front_default ||
                details.sprites.front_default,
              id: details.id,
              types: details.types,
            };
          } catch (e) {
            console.error(`Error fetching details for ${pokemon.name}:`, e);
            return null;
          }
        }),
      );

      setPokemonData(
        detailedPokemonData.filter((p) => p !== null) as Pokemon[],
      );
    } catch (error: any) {
      console.error("Fetch error:", error);
      if (error.name === "AbortError") {
        setError("Request timed out. The network might be slow.");
      } else {
        setError(
          error.message || "Something went wrong while fetching Pokémon data.",
        );
      }
    } finally {
      clearTimeout(timeoutId);
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
          style={StyleSheet.flatten([
            styles.card,
            { backgroundColor, width: cardWidth, height: cardWidth * 1.3 },
          ])}
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
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchPokemonData}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
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
