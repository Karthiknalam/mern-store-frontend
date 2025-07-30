import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../App';

export default function Order() {
  const { user, cart, setCart } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchOrders = async () => {
    if (!user?.email) return;
    
    try {
      setIsLoading(true);
      setError("");
      const url = `${API_URL}/api/orders/${user.email}`;
      const result = await axios.get(url);
      setOrders(result.data || []);
    } catch (err) {
      console.log(err);
      setError("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'badge-warning';
      case 'processing':
        return 'badge-primary';
      case 'shipped':
        return 'badge-secondary';
      case 'delivered':
        return 'badge-success';
      case 'cancelled':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  if (!user?.token) {
    return (
      <div className="page-container">
        <div className="container">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">My Orders</h2>
            <div className="card p-8">
              <p className="text-gray-600 mb-4">Please log in to view your orders.</p>
              <a href="/login" className="btn btn-primary">
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="container">
        <h2 className="text-2xl font-bold mb-6">My Orders</h2>
        
        {error && (
          <div className="alert alert-error mb-6">
            {error}
          </div>
        )}
        
        {isLoading && (
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        )}

        {!isLoading && !error && orders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <a href="/" className="btn btn-primary">
              Start Shopping
            </a>
          </div>
        )}

        {!isLoading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="card">
                <div className="card-body p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Order #{order._id.slice(-8)}</h3>
                      <p className="text-gray-600 text-sm">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                      <p className="text-lg font-bold text-primary mt-2">
                        ${order.orderValue}
                      </p>
                    </div>
                  </div>
                  
                  {order.items && order.items.length > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-semibold mb-3">Order Items:</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">{item.productName}</span>
                              <span className="text-gray-600 ml-2">x{item.qty}</span>
                            </div>
                            <span className="text-gray-600">${item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}