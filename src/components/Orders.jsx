import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../App';

export default function Orders() {
  const { user } = useContext(AppContext);
  const isLoggedIn = user?.token;
  const isAdmin = user?.role === "admin";
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError("");
      const url = `${API_URL}/api/orders/?page=${page}&limit=5&status=${statusFilter}`;
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      const result = await axios.get(url, { headers });
      setOrders(result.data.orders || []);
      setTotalPages(result.data.total || 1);
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) {
        setError("Access denied. Admin privileges required.");
      } else {
        setError("Failed to load orders");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const url = `${API_URL}/api/orders/${orderId}`;
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      await axios.patch(url, { status: newStatus }, { headers });
      fetchOrders();
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) {
        setError("Access denied. Admin privileges required.");
      } else {
        setError("Failed to update order status");
      }
    }
  };

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

  // Show login required if user is not logged in
  if (!isLoggedIn) {
    return (
      <div className="page-container">
        <div className="container">
          <div className="card">
            <div className="card-body p-6 text-center">
              <div className="text-4xl mb-4">🔐</div>
              <h2 className="text-xl font-bold mb-4">Login Required</h2>
              <p className="text-gray-600 mb-6">
                Please log in to access the Order Management page.
              </p>
              <a href="/login" className="btn btn-primary">
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show access denied if user is not admin
  if (!isAdmin) {
    return (
      <div className="page-container">
        <div className="container">
          <div className="card">
            <div className="card-body p-6 text-center">
              <div className="text-4xl mb-4">🚫</div>
              <h2 className="text-xl font-bold mb-4">Access Denied</h2>
              <p className="text-gray-600 mb-6">
                You need admin privileges to access the Order Management page.
              </p>
              <a href="/" className="btn btn-primary">
                Go Back Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Order Management</h2>
      
      {error && (
        <div className="alert alert-error mb-6">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex gap-4 items-center">
          <select 
            className="form-input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="btn btn-secondary" onClick={fetchOrders}>
            Filter
          </button>
        </div>
      </div>
      
      {isLoading && (
        <div className="text-center py-12">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📦</div>
          <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
          <p className="text-gray-600">No orders match your current filter.</p>
        </div>
      )}

      {!isLoading && !error && orders.length > 0 && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Email</th>
                <th>Items</th>
                <th>Total Value</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="font-mono text-sm">{order._id.slice(-8)}</td>
                  <td>{order.email}</td>
                  <td>
                    <div className="text-sm">
                      {order.items?.length || 0} items
                    </div>
                  </td>
                  <td className="font-semibold">${order.orderValue}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <select 
                      className="form-input text-sm"
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {!isLoading && !error && orders.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button 
            className="btn btn-secondary" 
            disabled={page === 1} 
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-secondary"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}