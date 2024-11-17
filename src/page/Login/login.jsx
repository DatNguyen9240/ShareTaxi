import React, { useState, useEffect } from "react";
import axios from "../../config/axios"; // Change axios import method
import { Link, useNavigate, useParams } from "react-router-dom";
import GoogleLogin from "../../components/GoogleLogin/GoogleLogin";
import "./login.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  UserOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import CircularProgress from "@mui/material/CircularProgress";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedPassword = localStorage.getItem("savedPassword");


    if (savedEmail) {
      setEmail(savedEmail);
    }
    if (savedPassword) {
      setPassword(savedPassword);
    }


    const authToken = localStorage.getItem("userId");
    if (authToken) {
      navigate("/");
    }


    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("Login", {
        email,
        password,
      });


      if (response.status === 200) {
        console.log("Login successful:", response.data);
        localStorage.setItem("userId", response.data.userId);
        toast.success("Login Successfully");


        if (rememberMe) {
          localStorage.setItem("savedEmail", email);
          localStorage.setItem("savedPassword", password);
        } else {
          localStorage.removeItem("savedEmail");
          localStorage.removeItem("savedPassword");
        }


        navigate("/");
      }
    } catch (error) {
      console.error("Error during login:", error);
      if (error.response) {
        toast.error("Incorrect username or password!");
      } else {
        setError("An error occurred while connecting to the server!");
      }
    }
  };


  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("PasswordReset/reset-password", {
        email: forgotPasswordEmail,
      });


      if (response.status === 200) {
        setSuccessMessage(
          "An email has been sent for password recovery. Please check your inbox."
        );
        setForgotPasswordEmail("");
        setIsForgotPassword(false);
      }
    } catch (error) {
      console.error("Error during forgot password:", error);
      if (error.response) {
        setError(
          error.response.data.message ||
            "An error occurred while sending the password recovery email!"
        );
      } else {
        setError("An error occurred while connecting to the server!");
      }
    }
  };


  const handleResetPassword = async (e) => {
    e.preventDefault();


    if (!token) {
      setError("Token not found to reset password!");
      return;
    }


    try {
      const response = await axios.post("reset-password", {
        token: token,
        newPassword: newPasswordInput,
      });


      if (response.status === 200) {
        setSuccessMessage("Password has been successfully updated!");
        setNewPasswordInput("");
        setIsResetPassword(false);
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      setError("An error occurred while resetting the password!");
    }
  };


  return (
    <div className="login-page">
      {loading ? (
        <div className="loading-spinner">
          <CircularProgress />
        </div>
      ) : (
        <div className="login-form">
          {!isForgotPassword && !isResetPassword && <h2>Login</h2>}


          {!isForgotPassword && !isResetPassword ? (
            <>
              <form onSubmit={handleSubmit}>
                <div className="input-container-email">
                  <label htmlFor="email"></label>
                  <input
                    placeholder="Email"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <UserOutlined style={{ color: "black" }} />
                </div>
                <div className="input-container-password">
                  <label htmlFor="password"></label>
                  <input
                    placeholder="Password"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {showPassword ? (
                    <EyeOutlined onClick={() => setShowPassword(false)} />
                  ) : (
                    <EyeInvisibleOutlined onClick={() => setShowPassword(true)} />
                  )}
                </div>


                <div>
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label className="remember-button" htmlFor="remember-me">
                    Remember Me
                  </label>
                  <p
                    className="forgotpw-button"
                    onClick={() => setIsForgotPassword(true)}
                  >
                    Forgot Password?
                  </p>
                </div>
                <button type="submit">Login</button>
                <div className="or-divider">
                  <span>OR</span>
                </div>
                <GoogleLogin />
                <div className="signup-link">
                  <div>Don't have an account?</div>
                  <Link to="/signup"> Sign up now</Link>
                </div>
              </form>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </>
          ) : isForgotPassword ? (
            <div className="forgot-page">
              <h3>Forgot Password</h3>
              <form onSubmit={handleForgotPassword}>
                <div>
                  <label htmlFor="forgot-email">Enter your email:</label>
                  <input
                    placeholder="Recovery Email"
                    id="forgot-email"
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit">Send Password Reset Link</button>
              </form>
              {successMessage && (
                <p style={{ color: "green" }}>{successMessage}</p>
              )}
              {error && <p style={{ color: "red" }}>{error}</p>}
              <p
                className="back-button"
                onClick={() => setIsForgotPassword(false)}
              >
                Back to Login
              </p>
            </div>
          ) : (
            <div>
              <h3>Reset Password</h3>
              <form onSubmit={handleResetPassword}>
                <div>
                  <label htmlFor="new-password">Enter new password:</label>
                  <input
                    id="new-password"
                    type="password"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    required
                  />
                </div>
                <button type="submit">Reset Password</button>
              </form>
              {successMessage && (
                <p style={{ color: "green" }}>{successMessage}</p>
              )}
              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};


export default Login;



