import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";

type PokemonDetails = {
  id: number;
  name: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
    front_default: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
  height: number;
  weight: number;
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
};

type Species = {
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    };
  }[];
  varieties: {
    is_default: boolean;
    pokemon: {
      name: string;
      url: string;
    };
  }[];
};

type Variety = {
  name: string;
  image: string;
  is_default: boolean;
};

export default function Details() {
  const { name } = useLocalSearchParams();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [species, setSpecies] = useState<Species | null>(null);
  const [varieties, setVarieties] = useState<Variety[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Forms");
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (name) {
      fetchAllData(name as string);
    }
  }, [name]);

  async function fetchAllData(pokemonName: string) {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch Basic Pokemon Details
      const pokemonRes = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
      );
      if (!pokemonRes.ok) throw new Error("Pokemon not found");
      const pokemonData: PokemonDetails = await pokemonRes.json();
      setPokemon(pokemonData);

      // 2. Fetch Species Data (for description and varieties)
      const speciesRes = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${pokemonData.id}`,
      );
      if (!speciesRes.ok) throw new Error("Species details not found");
      const speciesData: Species = await speciesRes.json();
      setSpecies(speciesData);

      // 3. Fetch Varieties (Forms) Data to get images
      if (speciesData.varieties?.length > 0) {
        const varietyPromises = speciesData.varieties.map(async (v) => {
          try {
            const res = await fetch(v.pokemon.url);
            if (!res.ok) return null;
            const data = await res.json();
            return {
              name: v.pokemon.name,
              image:
                data.sprites.other["official-artwork"].front_default ||
                data.sprites.front_default,
              is_default: v.is_default,
            };
          } catch (e) {
            return null;
          }
        });

        const varietiesData = await Promise.all(varietyPromises);
        setVarieties(varietiesData.filter((v) => v !== null) as Variety[]);
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const getFlavorText = () => {
    if (!species) return "";
    const entry = species.flavor_text_entries.find(
      (entry) => entry.language.name === "en",
    );
    return entry
      ? entry.flavor_text.replace(/\f/g, " ").replace(/\n/g, " ")
      : "";
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error || "Pokemon not found"}</Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => name && fetchAllData(name as string)}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen
        options={{
          title: "",
          headerTransparent: true,
          headerTintColor: "#333",
        }}
      />

      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.pokemonName}>{capitalize(pokemon.name)}</Text>
        <Text style={styles.pokemonId}>
          #{pokemon.id.toString().padStart(3, "0")}
        </Text>
      </View>

      {/* Main Image Card */}
      <View style={styles.imageCard}>
        <Image
          source={{
            uri:
              pokemon.sprites.other["official-artwork"].front_default ||
              pokemon.sprites.front_default,
          }}
          style={styles.mainImage}
          contentFit="contain"
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {["Forms", "Detail", "Types", "Stats", "Weakness"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={styles.tab}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <View style={styles.sectionContainer}>
        {activeTab === "Forms" && (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.formsList}
            >
              {varieties.map((variety, index) => (
                <View key={index} style={styles.varietyItem}>
                  <View style={styles.varietyImageContainer}>
                    <Image
                      source={{ uri: variety.image }}
                      style={styles.varietyImage}
                      contentFit="contain"
                    />
                  </View>
                  <Text style={styles.varietyName}>
                    {variety.is_default ? "Default" : "Mega/Variation"}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.infoBlock}>
              <Text style={styles.sectionTitle}>Mega Evolution</Text>
              <Text style={styles.descriptionText}>{getFlavorText()}</Text>
            </View>
          </>
        )}

        {/* Placeholder for other tabs if user clicks them */}
        {activeTab === "Detail" && (
          <View style={styles.infoBlock}>
            <Text>Height: {pokemon.height / 10} m</Text>
            <Text>Weight: {pokemon.weight / 10} kg</Text>
          </View>
        )}
        {activeTab === "Types" && (
          <View style={styles.infoBlock}>
            {pokemon.types.map((t) => (
              <Text key={t.type.name} style={styles.descriptionText}>
                • {capitalize(t.type.name)}
              </Text>
            ))}
          </View>
        )}
        {activeTab === "Stats" && (
          <View style={styles.infoBlock}>
            {pokemon.stats.map((s) => (
              <Text key={s.stat.name} style={styles.descriptionText}>
                {capitalize(s.stat.name)}: {s.base_stat}
              </Text>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
