import React, { useState, useEffect } from "react";
import axios from "../../config/axios";
import { Link, useNavigate } from "react-router-dom";
import "./signUp.css";
import {
  LockOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";

const SignUp = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    birthday: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (formValues.password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    if (formValues.password !== formValues.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Check email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formValues.email)) {
      toast.error("Invalid email!");
      return;
    }

    // Check phone number format
    if (!formValues.phone.match(/^(0[1-9]{1}[0-9]{8,9})$/)) { // Update regex to validate Vietnamese phone number
      toast.error("Invalid phone number!");
      return;
    }

    // Validate birthday
    const birthday = formValues.birthday;
    if (!birthday) {
      toast.error("Invalid date of birth!");
      return;
    }

    try {
      const response = await axios.post("User/SignUp", {
        name: formValues.name,
        email: formValues.email,
        phoneNumber: formValues.phone,
        dateOfBirth: formValues.birthday,
        password: formValues.password,
      });

      if (response.status === 200) {
        setSuccessMessage("Registration successful!");
        toast.success("Registration successful!");
        navigate("/login"); // Navigate to login page
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "An error occurred!");
    }
  };

  return (
    <div className="signup-page">
      {loading ? (
        <div className="loading-spinner">
          <CircularProgress />
        </div>
      ) : (
        <div className="signup-form">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
              <UserOutlined style={{ color: "black" }} />
            </div>

            <div className="input-container">
              <input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
              <MailOutlined style={{ color: "black" }} />
            </div>

            <div className="input-container">
              <input
                type="text"
                name="phone"
                value={formValues.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
              <PhoneOutlined style={{ color: "black" }} />
            </div>

            <div className="input-container">
              <input
                type="password"
                name="password"
                value={formValues.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
              <LockOutlined style={{ color: "black" }} />
            </div>

            <div className="input-container">
              <input
                type="password"
                name="confirmPassword"
                value={formValues.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
              />
              <LockOutlined style={{ color: "black" }} />
            </div>

            <div className="input-container">
              <input
                type="date"
                name="birthday"
                value={formValues.birthday}
                onChange={handleChange}
                required
              />
              <CalendarOutlined style={{ color: "black" }} />
            </div>

            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}

            <button type="submit">Sign Up</button>
          </form>
          <div className="login-link">
            <Link to="/login">Already have an account? Log in</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
