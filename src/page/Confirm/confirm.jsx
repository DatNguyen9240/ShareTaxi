import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import { FaPlug, FaWifi, FaToilet, FaSnowflake, FaCouch, FaMugHot } from 'react-icons/fa';
import './confirm.css';
import { toast } from 'react-toastify';
import { Modal } from 'antd';

export default function ConfirmTrip() {
    const location = useLocation();
    const navigate = useNavigate();
    const trip = location.state?.trip;
    const [loading, setLoading] = useState(false);

    if (!trip) {
        return <p>No trip data available for confirmation.</p>;
    }

    const token = localStorage.getItem('userId');

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleJoinTrip = async () => {
        if (!token) return;
        setLoading(true);
        try {
            // Thực hiện yêu cầu tham gia chuyến đi
            const joinResponse = await axios.post('Booking/joinTrip', { userId: token, tripId: trip.id });
            console.log('Successfully joined trip:', joinResponse.data);

            // Thực hiện yêu cầu thanh toán
            const paymentResponse = await axios.post(`Wallet/PayForTrip?tripId=${trip.id}`);
            console.log('Payment successful:', paymentResponse.data);

            navigate('/myTrips'); 
            toast.success(`${trip.unitPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} has been deducted from your wallet.`);
        } catch (error) {
            console.error('Error occurred:', error);
            if (error.response && error.response.status === 400) { // Xử lý lỗi 400
                toast.error(error.response.data.message || 'An error occurred while processing your payment.');
                await axios.delete('Booking/outTrip', {
                    headers: { 'Content-Type': 'application/json' },
                    data: { userId: token, tripId: trip.id }
                });
                console.log('Removed from trip due to insufficient funds.');
            } else {
                toast.error('An error occurred while joining the trip.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = () => {
        Modal.confirm({
            title: 'Confirm Your Trip',
            content: 'Are you sure you want to confirm this trip?',
            onOk() {
                handleJoinTrip();
            },
            onCancel() {
                console.log('Trip confirmation cancelled.');
            },
            okText: 'Yes',
            cancelText: 'No',
        });
    };

    return (
        <div className="confirm-container">
            <div className="left-section">
                <h2>{formatDate(trip.bookingDate)}</h2>
                <div className="trip-info">
                    <p><strong>{trip.hourInDay} o'clock</strong> - {trip.pickUpLocationName}</p>
                    <p><strong>Drop-off Location:</strong> {trip.dropOffLocationName}</p>
                </div>
                <div className="services">
                    <p>Services</p>
                    <ul>
                        <li><FaSnowflake /> Air conditioning</li>
                        <li><FaCouch /> Comfortable seats</li>
                        <li><FaMugHot /> Complimentary water</li>
                        <li><FaWifi /> In-car WiFi</li>
                        <li><FaPlug /> USB charging ports</li>
                    </ul>
                </div>
            </div>
            <div className="right-section">
                <h3>Confirm Trip</h3>
                <div className="summary">
                    <p><strong>{formatDate(trip.bookingDate)}</strong></p>
                    <p><strong>Pick-up Location:</strong> {trip.pickUpLocationName}</p>
                    <p><strong>Drop-off Location:</strong> {trip.dropOffLocationName}</p>
                    <p><strong>Price:</strong> {trip.unitPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                </div>
                <button onClick={handleConfirm} className="confirm-btn" disabled={!token || loading}>
                    {loading ? 'Processing...' : 'Confirm'}
                </button>
            </div>
        </div>
    );
}
