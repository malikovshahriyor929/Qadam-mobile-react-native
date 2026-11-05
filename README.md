<p align="center">
  <img src="public/qadam-logo-mark-lemon-yellow-rgb-300px-w-72ppi.png" alt="Qadam" width="96" />
</p>

# Qadam

A mobile app for finding gyms, booking visits and managing gym memberships. Built with Expo and React Native.

## Features

- **Sign up and sign in by phone**, with SMS (OTP) verification and password reset
- **Explore gyms** and open a gym's page; its location opens in Yandex Maps
- **Bookings**: upcoming and past gym visits
- **Memberships**: see your active memberships and their details
- **Support chat** in real time over Socket.io
- **Profile and settings**, including avatar upload
- **Three languages**: Uzbek, Russian and English, chosen on first launch

## Tech stack

| Area | Libraries |
|---|---|
| App | Expo, React Native, Expo Router (file-based routing) |
| UI | Tamagui, NativeWind (Tailwind CSS), Lucide icons, Reanimated |
| Data | TanStack Query, Axios, Socket.io client |
| Forms | React Hook Form, Zod |
| i18n | i18next, react-i18next, expo-localization |

## Project structure

```
app/
  auth/           language, login, register, OTP, forgot password
  (tabs)/         home, explore (gyms), booking, profile
  chat/           support chat
components/       shared UI components
shared/config/    i18n resources (uz, ru, en)
hooks/, utils/    helpers
```

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file with the backend URL:

   ```bash
   EXPO_PUBLIC_BASE_URL=https://your-backend.example.com
   ```

3. Start the app:

   ```bash
   npx expo start
   ```

   Then open it in Expo Go, an Android emulator or the iOS simulator.

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Start the Expo dev server |
| `npm run android` | Start and open on Android |
| `npm run ios` | Start and open on iOS |
| `npm run web` | Start the web version |
| `npm run lint` | Run ESLint |
