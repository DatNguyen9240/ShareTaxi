import React, { useEffect, useState } from "react";
import axios from "../../config/axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./profile.css";
import CircularProgress from "@mui/material/CircularProgress";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    email: "",
    dayOfBirth: "",
    phoneNumber: "",
    password: "",
    dateOfBirth: "" // Should be stored as a string (YYYY-MM-DD)
  });
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("userId");

    if (!token) {
      setError("You are not logged in.");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`Profile/${token}`);
        setUserData(response.data);
        setUpdatedData({
          name: response.data.name,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber,
          password: "",
          dateOfBirth: response.data.dateOfBirth
        });
      } catch (error) {
        setError(
          error.response?.data.message || "Unable to fetch user information."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 1000);
  }, []);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    setUpdatedData({
      ...updatedData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchUserData = async () => {
    const token = localStorage.getItem("userId");
    try {
      const response = await axios.get(`Profile/${token}`);
      setUserData(response.data);
      setUpdatedData({
        name: response.data.name,
        email: response.data.email,
        phoneNumber: response.data.phone,
        password: "",
        dateOfBirth: response.data.dateOfBirth
      });
    } catch (error) {
      setError(
        error.response?.data.message || "Unable to fetch user information."
      );
    }
  };

  const validateForm = () => {
    const { name, email, phoneNumber, password, dateOfBirth } = updatedData;
  
    if (!name || !email || !phoneNumber || !dateOfBirth || !password) {
      toast.error("All fields are required.");
      return false;
    }
  
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Invalid email address.");
      return false;
    }
    if (!phoneNumber.match(/^(0[1-9]{1}[0-9]{8,9})$/)) {
      toast.error("Số điện thoại không hợp lệ.");
      return false;
    }
  
    return true;
  };
  
  const handleUpdateProfile = async () => {
    if (!validateForm()) return; // Validate before sending request
  
    try {
      const token = localStorage.getItem("userId");
      await axios.put(`User/UpdateUser${token}`, {
        name: updatedData.name,
        phoneNumber: updatedData.phoneNumber,
        password: updatedData.password,
        dateOfBirth: updatedData.dateOfBirth,
      });
      setEditMode(false);
      setError(null);
      toast.success("Profile updated successfully.");
      await fetchUserData(); // Re-fetch user data after update
    } catch (error) {
      setError(
        error.response?.data.message || "Unable to update user information."
      );
      toast.error("Unable to update user information.");
    }
  };
  
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div className="profile">
      {pageLoading ? (
        <div className="loading-spinner">
          <CircularProgress />
        </div>
      ) : (
        <>
          <ToastContainer /> {/* Toast notification container */}
          <h1>Personal Information</h1>
          {userData ? (
            <div>
              {editMode ? (
                <div>
                  <label>
                    <strong>Email:</strong> {updatedData.email}
                  </label>
                  <label>
                    <strong>Username:</strong>
                    <input
                      type="text"
                      name="name"
                      value={updatedData.name}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    <strong>Phone Number:</strong>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={updatedData.phone}
                      onChange={handleInputChange}
                    />
                  </label>

                  <label>
                    <strong>Password:</strong>
                    <input
                      type="password"
                      name="password"
                      value={updatedData.password}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    <strong>Date of Birth:</strong>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={updatedData.dateOfBirth}
                      onChange={handleInputChange}
                    />
                  </label>
                  <button id="button" onClick={handleUpdateProfile}>Save</button>
                  <button id="button" onClick={() => setEditMode(false)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <p>
                    <strong>Email:</strong> {userData.email}
                  </p>
                  <p>
                    <strong>Username:</strong> {userData.name}
                  </p>
                  <p>
                    <strong>Phone Number:</strong> {userData.phone}
                  </p>
                  {userData.dateOfBirth && (
                    <p>
                      <strong>Date of Birth:</strong> {new Date(userData.dateOfBirth).toLocaleDateString("en-GB")}
                    </p>
                  )}
                  <p>
                    <strong>Created At:</strong> {new Date(userData.createdAt).toLocaleDateString("en-GB")}
                  </p>
                  <button id="button" onClick={handleEditClick}>Edit</button>
                </div>
              )}
            </div>
          ) : (
            <div>No user information available.</div>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
