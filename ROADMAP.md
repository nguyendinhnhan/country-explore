## 🗺️ Country Explorer – Roadmap

### 1. Goal

Build a Country Explorer mobile app using **React Native**, enabling users to browse countries,
search/filter, view details, favorite countries, and write personal notes — with focus on clean
architecture, state management, and performance.

---

## 2. Assumptions

- I’ll use **Expo SDK** to simplify development and submission.
- Navigation will be handled using **Expo Router**.
- I’ll follow the **Time-box of \~4 hours**, likely between `14h–18h tomorrow`, and submit the code
  after that.
- The repository will be public (for example:
  [https://github.com/nguyendinhnhan/country-explore](https://github.com/nguyendinhnhan/country-explore)),
  and shared upon completion.

---

## 3. Technologies Used

| Area                 | Library / Tool                              | Purpose / Notes                                                   |
| -------------------- | ------------------------------------------- | ----------------------------------------------------------------- |
| Framework            | `Expo`                                      | Fast development, deployment, testing                             |
| Navigation           | `expo-router + react-navigation`            | File-based routing for screens/tabs                               |
| State Management     | `React Context + useState`                  | Lightweight solution for shared state                             |
| Local Storage        | `@react-native-async-storage/async-storage` | To persist favorites and notes locally                            |
| Toast Notifications  | `react-native-toast-message`                | Feedback for actions (e.g. added to favorites, error retry, etc.) |
| HTTP Requests        | `fetch API`                                 | To fetch country data from public API                             |
| Type Safety          | `TypeScript`                                | Static typing throughout the app                                  |
| Linting / Formatting | `ESLint + Prettier`                         | Consistent coding style and formatting                            |
| Testing              | `Jest + @testing-library/react-native`      | Unit tests for hooks and components                               |
| Performance          | `React.memo, useCallback, lazy loading`     | Avoid re-renders, load detail screens on demand                   |

---

## 4. Project Structure

```
/app
  ├── index.tsx              # Home screen (search & browse)
  ├── favorites.tsx          # Favorites & Notes screen
  └── [country].tsx          # Country detail modal/page

/src
  ├── components/            # Shared UI components (Card, Banner, Loader, etc.)
  ├── contexts/              # FavoriteContext, NotesContext
  ├── hooks/                 # useCountries (fetch & cache logic)
  ├── services/              # api.ts (country fetch service)
  ├── utils/                 # helpers, constants, type guards
  ├── types/                 # Type definitions (Country, Region, etc.)
```

---

## 5. Features & Implementation Plan

### 5.1. Core Features

| Step | Feature           | Description                                                              |
| ---- | ----------------- | ------------------------------------------------------------------------ |
| 1    | Home (Browse)     | Fetch from API; display country name, flag, region with infinite scroll  |
| 2    | Search & Filter   | Search by name; dropdown filter by region                                |
| 3    | Country Details   | Lazy-load modal/page with full details (flag, capital, population, etc.) |
| 4    | Favorites & Notes | Add/remove favorites; store personal notes; use local storage            |
| 5    | Error Handling    | Retry banner on failed fetch                                             |

### 5.2. Stretch Goals (time permitting)

1. Local-Storage Sync (favorites & notes) [✔ planned]
2. Simple End-to-End Test
3. LLM Fun-Fact Call

---

## 6. Testing Plan

| Layer           | Tools                       | Target                                              |
| --------------- | --------------------------- | --------------------------------------------------- |
| Unit Tests      | Jest, React Testing Library | `useCountries`, local storage helpers               |
| Component Tests | React Testing Library       | `CountryCard`, `SearchBar`, etc.                    |
| Manual Testing  | Expo Go                     | Check navigation, error handling, persistence, etc. |
