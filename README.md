# 🌍 Country Explorer

A React Native app built for the 4-hour test task. Implements all core requirements with TypeScript, custom hooks, and comprehensive testing.


## ✅ Requirements Implemented

| Feature | Status | Implementation |
|---------|--------|----------------|
| **Browse Countries** | ✅ | Paginated list from REST Countries API |
| **Search & Filter** | ✅ | Debounced search + region filtering |
| **Details Panel** | ✅ | Modal with flag, capital, population, languages |
| **Favorites & Notes** | ✅ | Star/unstar + personal notes with AsyncStorage |
| **Error Handling** | ✅ | Retry buttons and error states |
| **TypeScript** | ✅ | Full type safety |
| **Custom Hooks** | ✅ | `useCountries`, `useFavorites`, `useFetch`, `useDebounce` |
| **Tests** | ✅ | 36 tests across hooks and components |
| **Performance** | ✅ | Lazy loading, memoization, debouncing |

### Stretch Goals
- ✅ **Local Storage** - Favorites/notes persist across reloads

## � Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn**
- **Expo CLI** (installed globally: `npm install -g @expo/cli`)
- **iOS Simulator** (Xcode) or **Android Emulator** (Android Studio)
- **Expo Go** app (for physical device testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd country-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your preferred platform**
   - **iOS**: Press `i` or `npm run ios`
   - **Android**: Press `a` or `npm run android`
   - **Web**: Press `w` or `npm run web`
   - **Physical Device**: Scan QR code with Expo Go app

## 🛠 Development

### Available Scripts

```bash
# Development
npm install             # Install dependencies
npm start               # Start Expo development server
npm run ios             # Run on iOS simulator
npm run android         # Run on Android emulator
npm run web             # Run in web browser

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format with Prettier
npm run type-check      # TypeScript type checking

# Testing
npm test               # Run Jest tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report

# Building
npm run build          # Build for production
npx expo export        # Export static files
```

## 🏗 Architecture

**Pattern**: Custom Hooks + Context + Services

```
Components → Hooks → Services → API/Storage
    ↓         ↓        ↓
   UI      Business  Data
  Logic     Logic    Layer
```

**Key Files**:
- `src/hooks/useCountries.ts` - Country fetching/pagination
- `src/contexts/FavoritesContext.tsx` - Global favorites state
- `src/services/countryService.ts` - REST Countries API
- `src/services/storageService.ts` - AsyncStorage persistence

## ⚖️ 4-Hour Trade-offs

| Prioritized | Simplified | Deferred |
|-------------|------------|----------|
| Core features | Basic UI design | Advanced filtering |
| TypeScript safety | Text-only notes | User accounts |
| Essential testing | iOS-style UI | Offline sync |
| Persistence | Basic error handling | Social features |

---

Built with React Native + Expo + TypeScript in ~4 hours

## ⚖️ Trade-offs & Decisions

Given the **4-hour development constraint**, several strategic decisions were made:

### 🎯 Prioritized Features

**✅ MUST HAVE (Implemented)**
- Core country browsing and search functionality
- Favorites with persistence
- Clean, intuitive UI
- Basic error handling
- TypeScript for type safety
- Essential testing coverage

**⚠️ NICE TO HAVE (Simplified)**
- Advanced filtering (only region-based, not by population/area)
- Basic notes functionality (text only, no rich formatting)
- Simple UI design (iOS-like, not fully custom)
- Essential tests only (not 100% coverage)

### 🔧 Technical Trade-offs

| Decision | Trade-off | Reasoning |
|----------|-----------|-----------|
| **Expo Router** vs Custom Navigation | Simpler but less flexible | Faster setup, good enough for 2-screen app |
| **Context + Reducer** vs Redux/Zustand | More boilerplate but built-in | No external dependencies, sufficient for scope |
| **AsyncStorage** vs SQLite | Less query power | Simpler setup, adequate for key-value storage |
| **FlatList** vs Advanced Virtualization | Basic optimization | Native optimization sufficient for dataset size |
| **REST Countries API** vs GraphQL | Less efficient queries | Free, reliable, no setup required |
| **Inline Styles** vs Styled Components | Less reusable | Faster development, adequate for small app |

### 🎨 UI/UX Decisions

- **iOS-style Design** - Leveraged native iOS design patterns for faster development
- **Tab Navigation** - Simple, familiar pattern vs. drawer or stack navigation
- **Modal Details** - Overlay vs. separate screen for better UX
- **Pull-to-Refresh** - Standard pattern for data refreshing
- **Basic Error States** - Simple error messages vs. detailed error handling

### � Performance Considerations

- **Pagination** - Load 20 countries at a time to avoid memory issues
- **Debounced Search** - 300ms delay to reduce API calls
- **Memoization** - React.memo and useCallback for expensive operations
- **FlatList Optimization** - getItemLayout and removeClippedSubviews
- **Lazy Loading** - Detail modal content loads on demand

### Code Quality Tools

- **ESLint** - Code linting with React/TypeScript rules
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing utilities

### Git Workflow

1. Follow conventional commit messages
2. Use feature branches for new development
3. Run tests before committing
4. Use ESLint/Prettier for consistent code style

## 🔮 Future Enhancements

### Short-term (Next Sprint)
- [ ] Covered full unit tests and core flows with e2e testing
- [ ] Advanced search filters (population, area)
- [ ] Rich text notes with formatting
- [ ] Country comparison feature
- [ ] Export favorites functionality

### Medium-term (Next Release)
- [ ] Offline-first architecture
- [ ] User accounts and cloud sync
- [ ] Social features (sharing, recommendations)
- [ ] Maps integration
- [ ] Push notifications for country updates

### Long-term (Future Versions)
- [ ] Multi-language support
- [ ] Advanced analytics and insights
- [ ] AR country exploration
- [ ] Travel planning integration

---

## 🔗 Reference

For comparison, here is a similar React Native + Redux project I completed in 8 hours, around 6 years ago: [NASA App](https://github.com/nguyendinhnhan/nasaApp)
