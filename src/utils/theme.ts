import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Colors } from '@/src/constants/Colors';

export const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.light.background,
    primary: Colors.primaryColor,
  },
};

export const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.dark.background,
    primary: Colors.primaryColor,
  },
};
