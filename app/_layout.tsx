import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { FavoritesProvider } from "../src/contexts/FavoritesContext";

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "#8E8E93",
          headerStyle: {
            backgroundColor: "#F8F9FA",
          },
          headerTintColor: "#000",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopColor: "#E5E5E7",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Countries",
            headerTitle: "Explore Countries",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="earth" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: "Favorites",
            headerTitle: "My Favorites",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="star" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </FavoritesProvider>
  );
}
