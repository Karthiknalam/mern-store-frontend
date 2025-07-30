import React from 'react';
import './Button.css';

const Button = ({ variant = 'primary', children, onClick, type = 'button', disabled = false, ...props }) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 