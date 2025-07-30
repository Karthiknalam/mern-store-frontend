import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../App";

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [formData, setFormData] = useState({});
  const { user, setUser } = useContext(AppContext);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchProfile = async () => {
    try {
      const url = `${API_URL}/api/users/${user.id}/profile`;
      const result = await axios.get(url);
      setProfile(result.data);
      setFormData({
        firstName: result.data.firstName || "",
        lastName: result.data.lastName || "",
        email: result.data.email || "",
        password: ""
      });
    } catch (err) {
      console.log(err);
      setError("Failed to load profile");
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }

      const url = `${API_URL}/api/users/${user.id}/profile`;
      const result = await axios.patch(url, updateData);
      
      setProfile(result.data);
      setSuccess("Profile updated successfully!");
      
      // Update user context if email changed
      if (updateData.email && updateData.email !== user.email) {
        setUser({ ...user, email: updateData.email });
      }
    } catch (err) {
      console.log(err);
      setError("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user?.token) {
    return (
      <div className="page-container">
        <div className="container">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">Profile</h2>
            <div className="card p-8">
              <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
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
        <div className="card">
          <div className="card-body p-6">
            <h2 className="text-2xl font-bold mb-6">My Profile</h2>
            
            {error && (
              <div className="alert alert-error mb-6">
                {error}
              </div>
            )}
            
            {success && (
              <div className="alert alert-success mb-6">
                {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName || ""}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName || ""}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">New Password (leave blank to keep current)</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password || ""}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter new password"
                />
              </div>
              
              <div className="flex gap-4">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      Updating...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Role:</span>
                  <span className={`badge ml-2 ${profile.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                    {profile.role || 'user'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Member since:</span>
                  <span className="ml-2">
                    {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}