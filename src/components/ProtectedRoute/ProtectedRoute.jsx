import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('userId'); // Lấy token từ localStorage

  // Nếu không có token, điều hướng về trang đăng nhập
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Nếu có token, hiển thị trang được bảo vệ
  return children;
};

export default ProtectedRoute;
