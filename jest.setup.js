// Jest setup to configure test environment
import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage for tests (fixes "NativeModule: AsyncStorage is null")
// eslint-disable-next-line no-undef
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Expo Vector Icons to avoid async loading warnings in tests
// eslint-disable-next-line no-undef
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Suppress React act() warnings and other verbose test warnings
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: An update to') ||
      args[0].includes('act(') ||
      args[0].includes('ReactDOM.render is no longer supported'))
  ) {
    return;
  }
  originalError.call(console, ...args);
};
