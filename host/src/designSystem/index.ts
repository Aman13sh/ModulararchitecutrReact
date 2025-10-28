// Design System - Main Export File
import './styles.css';
import Button from './components/Button';
import Card from './components/Card';
import Input from './components/Input';
import Badge from './components/Badge';
import eventBus from './eventBus';

// Export components
export { Button, Card, Input, Badge, eventBus };

// Export types
export type { ButtonProps } from './components/Button';
export type { CardProps } from './components/Card';
export type { InputProps } from './components/Input';
export type { BadgeProps } from './components/Badge';

// Default export for compatibility
export default {
  Button,
  Card,
  Input,
  Badge,
  eventBus
};
