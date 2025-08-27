/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export const primaryColor = '#ff9933';
const tintColorLight = primaryColor;
const tintColorDark = '#fff';

export const Colors = {
  primaryColor,
  favoriteColor: '#FFD700',
  white: '#fff',
  border: 'rgba(128, 128, 128, 0.25)',
  error: '#ff6b6b',
  light: {
    text: '#11181C',
    background: '#F5F5F5',
    item: '#fff',
    tint: tintColorLight,
    tintContrast: tintColorDark,
    icon: '#687076',
  },
  dark: {
    text: '#ECEDEE',
    background: '#121212',
    item: '#1E1E1E',
    tint: tintColorDark,
    tintContrast: tintColorLight,
    icon: '#9BA1A6',
  },
};
