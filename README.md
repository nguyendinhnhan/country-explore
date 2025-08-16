# 🌍 Country Explorer

A React Native application for exploring world countries with favorites, notes, and comprehensive search functionality.

## ✅ Completed Features

### Core Functionality

- **Browse Countries** - Paginated list from REST Countries API
- **Search & Filter** - Real-time search with region filtering
- **Country Details** - Comprehensive modal with country information
- **Favorites & Notes** - Star countries and add personal notes
- **Error Handling** - Robust error states with retry functionality

### Technical Excellence

- **TypeScript** - Full type safety throughout the application
- **Custom Hooks** - Reusable `useCountries`, `useFavorites`, `useFetch` hooks
- **State Management** - React Context for global favorites state
- **Performance Optimized** - Lazy loading, memoization, and FlatList optimization
- **Lint & Format** - ESLint + Prettier configuration
- **Local Storage** - AsyncStorage persistence for favorites

## 🚀 Performance Optimizations

- **Lazy Loading** - Detail modal loads only when needed
- **Component Memoization** - Prevents unnecessary re-renders
- **Optimized FlatList** - Efficient scrolling and rendering
- **Debounced Search** - Smooth search experience
- **Stable Callbacks** - Reduced re-render cascades

See [docs/PERFORMANCE.md](docs/PERFORMANCE.md) for detailed performance documentation.

## 🏗 Architecture

```
src/
├── components/     # Reusable UI components
├── contexts/       # React Context providers
├── hooks/          # Custom hooks for business logic
├── services/       # API and storage services
└── types/          # TypeScript type definitions
```

## 🛠 Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npx expo start
   ```

3. **Run linting and formatting**
   ```bash
   npm run lint
   npm run format
   ```

## 📱 Available Scripts

- `npm start` - Start Expo development server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator

## 📚 Documentation

- [Planning Documents](docs/) - Architecture and development planning
- [Performance Guide](docs/PERFORMANCE.md) - Performance optimization details
- [Lint Configuration](LINT_CONFIG.md) - ESLint and Prettier setup

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
