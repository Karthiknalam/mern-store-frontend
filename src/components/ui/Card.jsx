import React from 'react';
import './Card.css';

const Card = ({ children, style, ...props }) => (
  <div className="card" style={style} {...props}>
    {children}
  </div>
);

export default Card; 