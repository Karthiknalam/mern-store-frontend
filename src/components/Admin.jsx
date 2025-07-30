import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

export default function Admin() {
  const location = useLocation();
  
  return (
    <div className="page-container">
      <div className="container">
        <div className="card">
          <div className="card-body p-6">
            <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
            
            <div className="flex gap-4 mb-6 border-b border-gray-200">
              <Link 
                to="/admin" 
                className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
              >
                👥 Users
              </Link>
              <Link 
                to="/admin/products" 
                className={`nav-link ${location.pathname === '/admin/products' ? 'active' : ''}`}
              >
                📦 Products
              </Link>
              <Link 
                to="/admin/orders" 
                className={`nav-link ${location.pathname === '/admin/orders' ? 'active' : ''}`}
              >
                📋 Orders
              </Link>
            </div>
            
            <div className="mt-6">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}