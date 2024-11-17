import React from "react"
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import "./GoogleLogin.css"; 
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import axios from "axios";
export default function testLogin() {
  const navigate = useNavigate();

  const sendDataToBackend = async (data) => {
    try {
      const response = await axios.post('http://localhost:3000/api/google-login', {
        data
    })
      console.log('Data sent to backend:', response.data.userId);
      localStorage.setItem('userId', response.data.userId);
      navigate("/");
    } catch (error) {
      console.error('Error sending data to backend:', error);
    }
  };
  return (
    <div className="google">
        <GoogleLogin 
      onSuccess={(credentialResponse) => { 
        const credentialResponseDecoded = jwtDecode(
          credentialResponse.credential
        )
        sendDataToBackend(credentialResponseDecoded)
        navigate("/login");
      }} // Thêm dấu ngoặc đóng
      onError={() => { 
        console.log("Login Failed")
      }} 
    />
    </div>
    
  );
}