import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../App";

export default function Header() {
  const { user, setUser, cart } = useContext(AppContext);

  const handleLogout = () => {
    setUser({});
    localStorage.removeItem('user');
  };
  
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="header-title">
          🛍️ MERN Store
        </Link>
        
        <nav className="nav-links">
          <Link to="/" className="nav-link">
            🏠 Home
          </Link>
          <Link to="/cart" className="nav-link">
            🛒 Cart {cart.length > 0 && <span className="badge badge-primary pulse">{cart.length}</span>}
          </Link>
          <Link to="/order" className="nav-link">
            📦 Orders
          </Link>
          
          {user?.role === "admin" && (
            <Link to="/admin" className="nav-link">
              ⚙️ Admin
            </Link>
          )}
          
          {user?.token ? (
            <>
              <Link to="/profile" className="nav-link">
                👤 Profile
              </Link>
              <button onClick={handleLogout} className="nav-link bg-transparent border-none cursor-pointer">
                🚪 Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link">
              🔐 Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}