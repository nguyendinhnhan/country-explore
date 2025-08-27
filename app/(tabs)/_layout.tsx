import { useThemeColor } from '@/src/hooks';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Colors } from '@/src/constants/Colors';

export default function RootLayout() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primaryColor,
        tabBarInactiveTintColor: iconColor,
        headerStyle: {
          backgroundColor: backgroundColor,
        },
        headerTintColor: textColor,
        tabBarStyle: {
          position: 'absolute',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Countries',
          headerTitle: 'Explore Countries',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="earth" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          headerTitle: 'My Favorites',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
