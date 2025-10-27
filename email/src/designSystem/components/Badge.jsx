import React from 'react';
import './Badge.css';

const Badge = ({ children, variant = 'default' }) => {
  return (
    <span className={`ds-badge ds-badge--${variant}`}>
      {children}
    </span>
  );
};

export default Badge;
