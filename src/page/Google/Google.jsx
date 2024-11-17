import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import "./testLogin.css"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function TestLogin() {
  const navigate = useNavigate();

  const sendDataToBackend = async (data) => {
    try {
      const response = await axios.post('http://localhost:3000/api/google-login', data)
      console.log('Data sent to backend:', response.data.userId);

      // Store userId in localStorage if available
      if (response.data.userId) {
        console.log(response.data.userId);
        
        localStorage.setItem('userId', response.data.userId);
      }

      // Navigate to the home page
      navigate("/");
    } catch (error) {
      console.error('Error sending data to backend:', error);
    }
  };

  return (
    <div className="google">
      <GoogleLogin 
        onSuccess={(credentialResponse) => { 
          const data = { credential: credentialResponse.credential };
          
          // Send data to backend
          sendDataToBackend(data);
        }}
        onError={() => { 
          console.log("Login Failed");
        }} 
      />
    </div>
  );
}
