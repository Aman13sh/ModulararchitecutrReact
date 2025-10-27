import React from 'react';
import './Input.css';

const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  error,
  disabled = false,
  fullWidth = false
}) => {
  return (
    <div className={`ds-input-wrapper ${fullWidth ? 'ds-input-wrapper--full-width' : ''}`}>
      {label && <label className="ds-input-label">{label}</label>}
      <input
        type={type}
        className={`ds-input ${error ? 'ds-input--error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {error && <span className="ds-input-error">{error}</span>}
    </div>
  );
};

export default Input;
