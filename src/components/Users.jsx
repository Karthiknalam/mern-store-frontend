import React from "react";
import { useEffect, useState, useContext } from "react";
import { useRef } from "react";
import axios from "axios";
import { AppContext } from "../App";

export default function Users() {
  const { user } = useContext(AppContext);
  const isLoggedIn = user?.token;
  const isAdmin = user?.role === "admin";
  const [users, setUsers] = useState([]);
  const [error, setError] = useState();
  const frmRef = useRef();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });
  const [page, setPage] = useState(1);
  const [searchVal, setSearchVal] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(2);
  const [editId, setEditId] = useState();
  const API_URL = import.meta.env.VITE_API_URL;
  const fetchUsers = async () => {
    try {
      setError("Loading...");
      const url = `${API_URL}/api/users/?page=${page}&limit=${limit}&search=${searchVal}`;
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      const result = await axios.get(url, { headers });
      setUsers(result.data.users);
      setTotalPages(result.data.total);
      setError("");
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) {
        setError("Access denied. Admin privileges required.");
      } else {
        setError("Something went wrong");
      }
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [page]);
  const handleDelete = async (id) => {
    try {
      const url = `${API_URL}/api/users/${id}`;
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      const result = await axios.delete(url, { headers });
      setError("User Deleted Successfully");
      fetchUsers();
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) {
        setError("Access denied. Admin privileges required.");
      } else {
        setError("Something went wrong");
      }
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const frm = frmRef.current;
    if (!frm.checkValidity()) {
      frm.reportValidity();
      return;
    }
    try {
      const url = `${API_URL}/api/users`;
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      const result = await axios.post(url, form, { headers });
      setError("User added successfully");
      fetchUsers();
      resetForm();
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) {
        setError("Access denied. Admin privileges required.");
      } else {
        setError("Something went wrong");
      }
    }
  };

  const handleEdit = (user) => {
    setEditId(user._id);
    setForm({
      ...form,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      role: user.role,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const frm = frmRef.current;
    if (!frm.checkValidity()) {
      frm.reportValidity();
      return;
    }
    try {
      const url = `${API_URL}/api/users/${editId}`;
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      const result = await axios.patch(url, form, { headers });
      fetchUsers();
      setEditId();
      resetForm();
      setError("User information updated successfully");
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) {
        setError("Access denied. Admin privileges required.");
      } else {
        setError("Something went wrong");
      }
    }
  };

  const handleCancel = () => {
    setEditId();
    resetForm();
  };

  const resetForm = () => {
    setForm({
      ...form,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
    });
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
                Please log in to access the User Management page.
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
                You need admin privileges to access the User Management page.
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
      <h2 className="text-xl font-bold mb-6">User Management</h2>
      
      {error && (
        <div className={`alert ${error.includes('Successfully') ? 'alert-success' : 'alert-error'} mb-6`}>
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <form ref={frmRef} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                name="firstName"
                value={form.firstName}
                type="text"
                className="form-input"
                placeholder="Enter first name"
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                name="lastName"
                value={form.lastName}
                type="text"
                className="form-input"
                placeholder="Enter last name"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                name="email"
                value={form.email}
                type="email"
                className="form-input"
                placeholder="Enter email address"
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                name="password"
                value={form.password}
                type="password"
                className="form-input"
                placeholder="Enter password"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              name="role"
              value={form.role}
              className="form-input"
              required
              onChange={handleChange}
            >
              <option value="">--Select Role--</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-4">
            {editId ? (
              <>
                <button type="button" className="btn btn-primary" onClick={handleUpdate}>
                  Update User
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              </>
            ) : (
              <button type="button" className="btn btn-primary" onClick={handleAdd}>
                Add User
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="mb-6">
        <div className="flex gap-4 items-center">
          <input 
            type="text" 
            className="form-input flex-1"
            placeholder="Search users..."
            onChange={(e) => setSearchVal(e.target.value)} 
          />
          <button className="btn btn-secondary" onClick={() => fetchUsers()}>
            Search
          </button>
        </div>
      </div>
      
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email Address</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button 
                      className="btn btn-sm btn-secondary" 
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-danger" 
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
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
    </div>
  );
}