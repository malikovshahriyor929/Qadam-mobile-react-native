import { Platform } from 'react-native';

export const shadowLg = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },
  android: {
    elevation: 7,
  },
});
