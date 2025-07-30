import "./Register.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [user, setUser] = useState({});
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const Navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  
  const handleSubmit = async () => {
    if (!user.firstName || !user.lastName || !user.email || !user.password) {
      setError("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const url = `${API_URL}/api/users/register`;
      const result = await axios.post(url, user);
      setError("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        Navigate("/login");
      }, 2000);
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="page-container">
      <div className="container">
        <div className="form-container fade-in">
          <h2 className="text-center mb-6">Create Account</h2>
          
          {error && (
            <div className={`alert ${error.includes('successfully') ? 'alert-success' : 'alert-error'} mb-6`}>
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your first name"
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your last name"
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email address"
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
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
          
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Already have an account?{" "}
              <Link to="/login" className="text-primary">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}