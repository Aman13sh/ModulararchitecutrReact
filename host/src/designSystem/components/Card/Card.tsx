import React from 'react';
import './Card.css';

export interface CardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ children, title, footer, hoverable = false }) => {
  return (
    <div className={`ds-card ${hoverable ? 'ds-card--hoverable' : ''}`}>
      {title && <div className="ds-card__header">{title}</div>}
      <div className="ds-card__body">{children}</div>
      {footer && <div className="ds-card__footer">{footer}</div>}
    </div>
  );
};

export default Card;
