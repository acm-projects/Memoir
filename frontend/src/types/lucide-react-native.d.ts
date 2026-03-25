declare module 'lucide-react-native' {
  import * as React from 'react';
  import { ViewProps } from 'react-native';

  export interface LucideIconProps extends ViewProps {
    color?: string;
    size?: number | string;
    strokeWidth?: number | string;
  }

  export type LucideIcon = React.FC<LucideIconProps>;

  // Declare only the icons you actually use in the app
  export const Bell: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Lock: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const LogOut: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const Settings: LucideIcon;
  export const Star: LucideIcon;
  export const Shield: LucideIcon;
}
