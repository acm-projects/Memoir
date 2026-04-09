/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  const scheme = useColorScheme();
<<<<<<< HEAD
  // Normalize the color scheme to the two keys used in Colors ('light' | 'dark')
  const theme: keyof typeof Colors = scheme === 'dark' ? 'dark' : 'light';
=======
  const theme = scheme === 'unspecified' ? 'light' : scheme;
>>>>>>> kasish

  return Colors[theme];
}
