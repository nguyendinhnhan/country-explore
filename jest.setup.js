// Jest setup to configure test environment
import '@testing-library/jest-native/extend-expect';

// Mock Expo Vector Icons to avoid async loading warnings in tests
// eslint-disable-next-line no-undef
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));
