import React, { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { AppContext } from "../App";

export default function Login() {
  const { user, setUser } = useContext(AppContext);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const Navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  
  const handleSubmit = async () => {
    if (!user.email || !user.password) {
      setError("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const url = `${API_URL}/api/users/login`;
      const result = await axios.post(url, user);
      setUser(result.data);
      Navigate("/");
    } catch (err) {
      console.log(err);
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="page-container">
      <div className="container">
        <div className="form-container fade-in">
          <h2 className="text-center mb-6">Welcome Back</h2>
          
          {error && (
            <div className="alert alert-error mb-6">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>
          
          <button 
            className="btn btn-primary w-full mb-6"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
          
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary">
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}