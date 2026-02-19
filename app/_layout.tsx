import { Stack } from "expo-router";
import { View } from "react-native";
import { styles } from "../css/layout.styles";

export default function RootLayout() {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <Stack>
          <Stack.Screen name="index" options={{ title: "Home" }} />
          <Stack.Screen
            name="details"
            options={{
              title: "Details",
              headerBackButtonDisplayMode: "minimal",
            }}
          />
        </Stack>
      </View>
    </View>
  );
}
