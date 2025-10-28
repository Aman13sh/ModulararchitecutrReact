/// <reference types="vite/client" />

// Module Federation type declarations
declare module 'host/designSystem' {
  import { ButtonProps } from './designSystem/components/Button/Button';
  import { CardProps } from './designSystem/components/Card/Card';
  import { InputProps } from './designSystem/components/Input/Input';
  import { BadgeProps } from './designSystem/components/Badge/Badge';

  export const Button: React.ComponentType<ButtonProps>;
  export const Card: React.ComponentType<CardProps>;
  export const Input: React.ComponentType<InputProps>;
  export const Badge: React.ComponentType<BadgeProps>;
  export const eventBus: any;
}
