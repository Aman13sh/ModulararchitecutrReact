declare module 'host' {
  import type { ButtonProps, CardProps, InputProps, BadgeProps } from 'host';

  export const Button: React.FC<ButtonProps>;
  export const Card: React.FC<CardProps>;
  export const Input: React.FC<InputProps>;
  export const Badge: React.FC<BadgeProps>;
  export const eventBus: any;

  export interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
    size?: 'small' | 'medium' | 'large';
    onClick?: () => void;
    disabled?: boolean;
    fullWidth?: boolean;
    type?: 'button' | 'submit' | 'reset';
  }

  export interface CardProps {
    children: React.ReactNode;
    title?: string;
    footer?: React.ReactNode;
    hoverable?: boolean;
  }

  export interface InputProps {
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    error?: string;
    disabled?: boolean;
    fullWidth?: boolean;
  }

  export interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  }
}

declare module 'host/styles.css' {
  const styles: any;
  export default styles;
}
