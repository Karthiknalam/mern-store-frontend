import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <nav className="navbar">
      <div className="navbar-logo">MyApp</div>
      <button className="navbar-toggle" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>
        <span className="navbar-hamburger" />
      </button>
      <ul className={`navbar-links${open ? ' open' : ''}`}>
        <li><a href="/">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/cart">Cart</a></li>
        <li><a href="/profile">Profile</a></li>
      </ul>
    </nav>
  );
};

export default Navbar; 