import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Trạng thái cho việc gửi yêu cầu
  const navigate = useNavigate();
  const { token } = useParams();

  // Log token to see if it's retrieved correctly
  console.log("Token:", token);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      setIsLoading(true); // Bắt đầu quá trình tải
      const response = await axios.post('http://localhost:3000/api/reset-password', {
        token: token,
        newPassword: newPassword,
      });

      if (response.status === 200) {
        setSuccessMessage('Mật khẩu đã được cập nhật thành công!');
        setError('');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Lỗi khi đặt lại mật khẩu!');
      } else {
        setError('Lỗi khi kết nối đến server!');
      }
    } finally {
      setIsLoading(false); // Kết thúc quá trình tải
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div>
      <h2>Đặt lại mật khẩu</h2>
      <form onSubmit={handleResetPassword}>
        <div>
          <label htmlFor="new-password">Mật khẩu mới:</label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirm-password">Xác nhận mật khẩu:</label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>Đổi mật khẩu</button> {/* Disable button khi đang gửi yêu cầu */}
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {isLoading && <p>Đang xử lý...</p>} {/* Thông báo đang xử lý */}
    </div>
  );
};

export default ResetPassword;
