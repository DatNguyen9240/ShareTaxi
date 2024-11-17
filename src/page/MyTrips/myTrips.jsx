import React, { useEffect, useState } from 'react';
import axios from '../../config/axios';
import { useNavigate } from 'react-router-dom';
import './myTrips.css';
import { toast } from 'react-toastify';
import { Modal } from 'antd'; // Import Modal from Ant Design
import CircularProgress from "@mui/material/CircularProgress";

export default function MyTrips() {
    const [trips, setTrips] = useState([]);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [loading, setLoading] = useState(true);

    const fetchTrips = async () => {
        try {
            const response = await axios.get(`Trip/TripJoined/${userId}`);
            const tripData = response.data?.$values || [];
            
            // Sắp xếp chuyến có thể cancel lên đầu và theo ngày đặt (mới nhất lên đầu)
            tripData.sort((a, b) => {
                if (a.status === 1 && b.status !== 1) return -1; // a có thể cancel lên đầu
                if (b.status === 1 && a.status !== 1) return 1;  // b có thể cancel lên đầu
                return new Date(b.bookingDate) - new Date(a.bookingDate); // sắp xếp theo ngày đặt
            });
            
            setTrips(tripData);
        } catch (error) {
            console.error('Error fetching trips:', error);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchTrips();
        }
    }, [userId]);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    const handleCancelTrip = (tripId) => {
        Modal.confirm({
            title: 'Confirm Cancellation',
            content: 'Are you sure you want to cancel this trip?',
            onOk: async () => {
                try {
                    console.log(userId, tripId);
                    
                    // Call Refund API before leaving the trip
                    await axios.post(`Wallet/RefundOnLeaveTrip?userId=${userId}&tripId=${tripId}`);
                    console.log('Refund successful');

                    // Call outTrip API after successful refund
                    await axios.delete('Booking/outTrip', {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: { userId: userId, tripId: tripId }
                    });
                    toast.success('Trip cancelled successfully.');
                    
                    // Update the trip list
                    setTrips((prevTrips) => prevTrips.filter(trip => trip.id !== tripId));
                } catch (error) {
                    console.error('Failed to cancel trip:', error);
                    toast.error('An error occurred while canceling the trip.');
                }
            },
            onCancel() {
                console.log('Trip cancellation cancelled.');
            },
            okText: 'Yes',
            cancelText: 'No',
        });
    };

    const handleViewDetails = (trip) => {
        navigate(`/trip-detail/${trip.id}`, { state: { tripType: trip.tripTypeId } });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <div className="my-trips-container">
            {loading ? (
                <div className="loading-spinner">
                    <CircularProgress />
                </div>
            ) : (
                <>
                    <h2>My Trips</h2>
                    {trips.length > 0 ? (
                        <ul className="trip-list">
                            {trips.map((trip) => (
                                <li key={trip.id} className="trip-item">
                                    <div className="trip-details">
                                        <p><strong>Date:</strong> {formatDate(trip.bookingDate) || 'N/A'}</p>
                                        <p><strong>Pick-up:</strong> {trip.pickUpLocationName}</p>
                                        <p><strong>Drop-off:</strong> {trip.dropOffLocationName}</p>
                                        <p><strong>Price:</strong> {trip.unitPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                        <p><strong>Status:</strong> {trip.status === 0 ? 'Cancelled' : trip.status === 1 ? 'Pending' : trip.status === 2 ? 'Booked' : 'Trip Complete'}</p>
                                    </div>
                                    <div className="trip-buttons">
                                        <button onClick={() => handleViewDetails(trip)} className="view-btn">
                                            View Details
                                        </button>
                                        <button 
                                            onClick={() => handleCancelTrip(trip.id)} 
                                            className={`cancel-btn ${trip.status !== 1 ? 'disabled' : ''}`}
                                            disabled={trip.status !== 1}
                                        >
                                            Cancel Trip
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No trips found.</p>
                    )}
                </>
            )}
        </div>
    );
}
