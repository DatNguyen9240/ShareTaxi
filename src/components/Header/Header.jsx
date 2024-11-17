import React, { useState, useEffect, useRef } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userId");
    setIsLoggedIn(!!token);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    const token = localStorage.getItem("userId");
    setIsLoggedIn(!!token);
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header>
      <div className="logo">
        <Link to="/">
          <img
            src="https://www.blablacar.co.uk/favicon.ico"
            alt="BlaBlaCar Logo"
            width={50}
          />
          <span>BlaBlaCar</span>
        </Link>
      </div>

      <div className="actions">
        <Link to="/search" className="search">
          <span className="search-icon">🔍</span> Search
        </Link>
    
          <>
            {localStorage.getItem("userId") && (
              <>
                <Link to="/transaction" className="publish-ride">
                  <span className="plus-icon">💸</span> Transaction
                </Link>
                <Link to="/rideShare" className="publish-ride">
                  <span className="plus-icon">➕</span> Available Trips
                </Link>
              </>
            )}
          </>
   
        <div className="user-icon" onClick={toggleDropdown} ref={dropdownRef}>
          <img
            src="https://www.w3schools.com/howto/img_avatar.png"
            alt="User Avatar"
          />
          <span className="dropdown-arrow">▼</span>
          {showDropdown && (
            <div className="dropdown-content">
              {isLoggedIn ? (
                <>
                  <a onClick={() => navigate("/profile")}>Profile</a>
                  <a onClick={() => navigate("/wallet")}>Wallet</a>
                  <a onClick={() => navigate("/myTrips")}>My Trips</a>
                  <a onClick={handleLogout}>Logout</a>
                </>
              ) : (
                <>
                  <a onClick={() => navigate("/login")}>Login</a>
                  <a onClick={() => navigate("/signUp")}>Sign Up</a>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
