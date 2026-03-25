declare module 'lucide-react-native' {
  import type { ComponentType } from 'react';

  interface LucideProps {
    size?: number | string;
    color?: string; // allow color prop for icons
  }

  export const Camera: ComponentType<LucideProps>;
  export const Image: ComponentType<LucideProps>;
  export const X: ComponentType<LucideProps>;
}
