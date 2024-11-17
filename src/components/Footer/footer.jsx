import React from "react";
import "./footer.css";
export default function footer() {
  const navigateToFacebook = () => {
    window.open("https://web.facebook.com/phuc.nguen.39142/", "_blank"); // Mở trang Facebook trong tab mới
  };


  // Hàm xử lý điều hướng đến Instagram
  const navigateToInstagram = () => {
    window.open("https://www.instagram.com/n.v.phuc04/", "_blank"); // Mở trang Instagram trong tab mới
  };
  return (
    <div className="containerFooter">
      <div className="footer">
        <div>
          <p>Email: phucnguyen5640@gmail.com</p>
          <p>Phone number: 0868355460</p>
          <p>Address: S501 Vinhome Grand Park </p>
        </div>
        <div className="social-media"  style={{marginLeft: '-700px', display: 'flex', gap: '10px'}}>
        
            <button className="facebook-btn" onClick={navigateToFacebook}>
              <span>f</span>
            </button>
          
            <button className="instagram-btn" onClick={navigateToInstagram}>
              <span>📷</span>
            </button>
        </div>
        <div className="logo">BlaBlaCar, 2024 ©</div>
      </div>
    </div>
  );
}



