import React from "react";
import { useEffect, useState } from "react";
import { useRef } from "react";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
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
  const [limit, setLimit] = useState(10);
  const [editId, setEditId] = useState();
  const API_URL = import.meta.env.VITE_API_URL;
  
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError("Loading...");
      const url = `${API_URL}/api/products/all?page=${page}&limit=${limit}&search=${searchVal}`;
      const result = await axios.get(url);
      setProducts(result.data.products);
      setTotalPages(result.data.total);
      setError();
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, [page]);
  
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    
    try {
      const url = `${API_URL}/api/products/${id}`;
      await axios.delete(url);
      setError("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
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
      await axios.post(url, form);
      setError("Product added successfully");
      fetchProducts();
      resetForm();
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setForm({
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
      await axios.patch(url, form);
      fetchProducts();
      setEditId();
      resetForm();
      setError("Product updated successfully");
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }
  };

  const handleCancel = () => {
    setEditId();
    resetForm();
  };

  const resetForm = () => {
    setForm({
      productName: "",
      description: "",
      price: "",
      imgUrl: "",
    });
  };
  
  return (
    <div className="page-container">
      <div className="container">
        <h2 className="mb-6">Product Management</h2>
        
        {error && (
          <div className={`alert ${error.includes('successfully') ? 'alert-success' : 'alert-error'} mb-6`}>
            {error}
          </div>
        )}
        
        {/* Add/Edit Product Form */}
        <div className="card mb-8">
          <div className="card-header">
            <h3 className="text-lg">{editId ? 'Edit Product' : 'Add New Product'}</h3>
          </div>
          <div className="card-body">
            <form ref={frmRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  step="0.01"
                  className="form-input"
                  placeholder="Enter price"
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group md:col-span-2">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  className="form-input"
                  placeholder="Enter product description"
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>
              
              <div className="form-group md:col-span-2">
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
              
              <div className="md:col-span-2 flex gap-4">
                {editId ? (
                  <>
                    <button 
                      type="button"
                      onClick={handleUpdate}
                      className="btn btn-success"
                    >
                      Update Product
                    </button>
                    <button 
                      type="button"
                      onClick={handleCancel}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button 
                    type="button"
                    onClick={handleAdd}
                    className="btn btn-primary"
                  >
                    Add Product
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="card mb-6">
          <div className="card-body">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1">
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Search products..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                />
              </div>
              <button 
                onClick={fetchProducts}
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Searching...
                  </>
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Products Table */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img 
                      src={product.imgUrl || "https://via.placeholder.com/50x50"} 
                      alt={product.productName}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </td>
                  <td className="font-semibold">{product.productName}</td>
                  <td className="text-gray-600">{product.description}</td>
                  <td className="text-primary font-semibold">${product.price}</td>
                  <td>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="btn btn-secondary btn-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="btn btn-danger btn-sm"
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
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="btn btn-secondary"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="btn btn-secondary"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}