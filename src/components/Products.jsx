import React from "react";
import { useEffect, useState, useContext } from "react";
import { useRef } from "react";
import axios from "axios";
import { AppContext } from "../App";

export default function Products() {
  const { user } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState();
  const frmRef = useRef();
  const [form, setForm] = useState({
    productName: "",
    description: "",
    price: "",
    imgUrl: "",
  });
  const [page, setPage] = useState(1);
  const [searchVal, setSearchVal] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(2);
  const [editId, setEditId] = useState();
  const API_URL = import.meta.env.VITE_API_URL;

  // Check if user is logged in and is admin
  const isLoggedIn = user?.token;
  const isAdmin = user?.role === "admin";
  const fetchProducts = async () => {
    try {
      setError("Loading...");
      const url = `${API_URL}/api/products/all?page=${page}&limit=${limit}&search=${searchVal}`;
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      const result = await axios.get(url, { headers });
      setProducts(result.data.products);
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
    fetchProducts();
  }, [page]);
  const handleDelete = async (id) => {
    try {
      const url = `${API_URL}/api/products/${id}`;
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      const result = await axios.delete(url, { headers });
      setError("Product Deleted Successfully");
      fetchProducts();
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
      const url = `${API_URL}/api/products`;
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      // Convert price to number
      const productData = {
        ...form,
        price: Number(form.price)
      };
      const result = await axios.post(url, productData, { headers });
      setError("Product added successfully");
      fetchProducts();
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

  const handleEdit = (product) => {
    setEditId(product._id);
    setForm({
      ...form,
      productName: product.productName,
      description: product.description,
      price: product.price,
      imgUrl: product.imgUrl,
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
      const url = `${API_URL}/api/products/${editId}`;
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      // Convert price to number
      const productData = {
        ...form,
        price: Number(form.price)
      };
      const result = await axios.patch(url, productData, { headers });
      fetchProducts();
      setEditId();
      resetForm();
      setError("Product information updated successfully");
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
      productName: "",
      description: "",
      price: "",
      imgUrl: "",
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
                Please log in to access the Product Management page.
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
                You need admin privileges to access the Product Management page.
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
    <div className="page-container">
      <div className="container">
        <div className="card">
          <div className="card-body p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Product Management</h2>
            {error && (
              <div className={`alert ${error.includes('Successfully') ? 'alert-success' : 'alert-error'} mb-4 md:mb-6`}>
                {error}
              </div>
            )}
            <div className="mb-4 md:mb-6">
              <form ref={frmRef} className="space-y-2 md:space-y-4" onSubmit={editId ? handleUpdate : handleAdd}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                  <div className="form-group">
                    <label className="form-label">Product Name</label>
                    <input
                      name="productName"
                      value={form.productName}
                      type="text"
                      className="form-input"
                      placeholder="Enter product name"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price</label>
                    <input
                      name="price"
                      value={form.price}
                      type="number"
                      className="form-input"
                      placeholder="Enter price"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    className="form-input"
                    placeholder="Enter product description"
                    onChange={handleChange}
                    rows="2"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    name="imgUrl"
                    value={form.imgUrl}
                    type="url"
                    className="form-input"
                    placeholder="Enter image URL"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex gap-2 md:gap-4">
                  {editId ? (
                    <>
                      <button type="submit" className="btn btn-primary btn-sm">
                        Update
                      </button>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={handleCancel}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button type="submit" className="btn btn-primary btn-sm">
                      Add
                    </button>
                  )}
                </div>
              </form>
            </div>
            <div className="mb-4 md:mb-6">
              <div className="flex gap-2 md:gap-4 items-center">
                <input
                  type="text"
                  className="form-input flex-1"
                  placeholder="Search products..."
                  onChange={(e) => setSearchVal(e.target.value)}
                />
                <button className="btn btn-secondary btn-sm" onClick={fetchProducts}>
                  Search
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 mb-4">
              {products && products.length > 0 ? products.map((product) => (
                <div key={product._id} className="card p-2 flex flex-col items-center border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-200">
                  <img
                    src={product.imgUrl || "https://via.placeholder.com/120x90?text=No+Image"}
                    alt={product.productName}
                    className="w-24 h-16 object-cover rounded mb-1 border"
                    style={{ maxWidth: "100%", maxHeight: "64px" }}
                    onError={e => {
                      e.target.src = "https://via.placeholder.com/120x90?text=No+Image";
                    }}
                  />
                  <div className="w-full flex-1 flex flex-col justify-between">
                    <h3 className="font-semibold text-xs mb-1 truncate" title={product.productName}>
                      {product.productName}
                    </h3>
                    <p className="text-gray-500 text-xs mb-1 line-clamp-2" style={{ minHeight: "24px" }}>
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-primary font-bold text-sm">${product.price}</span>
                    </div>
                    <div className="flex gap-1 mt-1">
                      <button
                        className="btn btn-secondary btn-xs flex-1"
                        style={{ fontSize: "0.7rem", padding: "0.2rem 0.4rem" }}
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-xs flex-1"
                        style={{ fontSize: "0.7rem", padding: "0.2rem 0.4rem" }}
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-8">
                  <div className="text-gray-500 text-lg">No products found</div>
                  {error === "Loading..." && (
                    <div className="text-gray-400 text-sm mt-2">Loading products...</div>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-center items-center gap-2 md:gap-4 mt-4">
              <button
                className="btn btn-secondary btn-sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <span className="text-gray-600 text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                className="btn btn-secondary btn-sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}