import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";

interface Pokemon {
  name: string;
  url: string;
  image: string;
  id: number;
  imageBack: string;
  types: {
    type: {
      name: string;
    };
  }[];
}

export default function Index() {
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);

  useEffect(() => {
    fetchPokemonData();
  }, [])

  async function fetchPokemonData() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10");
    const data = await response.json();
    
    const detailedPokemonData = await Promise.all(
      data.results.map(async (pokemon: any) => {
        const response = await fetch(pokemon.url);
        const details = await response.json();
        return {
          name: pokemon.name,
          url: pokemon.url,
          image: details.sprites.front_default,
          id: details.id,
          imageBack: details.sprites.back_default,
          types: details.types,
        }
      })
    );

    setPokemonData(detailedPokemonData);
  }



  return (
   <ScrollView>
    {pokemonData.map((pokemon) => (
      <View key={pokemon.name}>

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10 }}>
          <Text>{pokemon.name}</Text>
          <Text>{pokemon.types[0].type.name}</Text>
          <Image source={{ uri: pokemon.image }} style={{ width: 100, height: 100 }} />
          <Image source={{ uri: pokemon.imageBack }} style={{ width: 100, height: 100 }} />
        </View>
      </View>
    ))}
   </ScrollView>
  );
}