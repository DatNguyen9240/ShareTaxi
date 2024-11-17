import React, { useEffect, useState } from 'react';
import axios from '../../config/axios';
import { useParams, useLocation } from 'react-router-dom';
import './tripDetail.css';
import CircularProgress from "@mui/material/CircularProgress";

export default function TripDetail() {
    const { tripId } = useParams();
    const location = useLocation();
    const { tripType } = location.state || {};
    const [trip, setTrip] = useState({});
    const [tripTypeDescription, setTripTypeDescription] = useState('');
    const [tripUsers, setTripUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [carTrip, setCarTrip] = useState({}); // Set default carTrip to an empty object
    const [isTripFull, setIsTripFull] = useState(false); // Thêm state để kiểm tra chuyến đi đầy
    const [currentBookingsCount, setCurrentBookingsCount] = useState(0); // Thêm state để lưu số lượng đặt chỗ hiện tại
    const [maxPerson, setMaxPerson] = useState(0);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setPageLoading(false);
        }, 1000);
    }, []);

    if (!tripType) {
        return <p>Error: No trip details available.</p>;
    }

    useEffect(() => {
        const fetchTripData = async () => {
            setLoading(true);
            try {
                const [tripResponse, bookingsResponse, tripTypeResponse] = await Promise.all([
                    axios.get(`Trip/${tripId}`),
                    axios.get(`Booking/usersInTrip/${tripId}`),
                    axios.get(`TripType/${tripType}`)
                ]);

                // Fetch carTrip data and handle errors separately
                try {
                    const carTripResponse = await axios.get(`CarTrip/${tripId}`);
                    setCarTrip(carTripResponse.data);
                } catch (carTripError) {
                    console.error('Error fetching car trip data:', carTripError);
                    setCarTrip({}); // Set carTrip to an empty object if there's an error
                }

                setTrip(tripResponse.data);
                setTripUsers(bookingsResponse.data.$values || []);
                setTripTypeDescription(tripTypeResponse.data.description || 'Unknown');
                setErrorMessage('');

                // Thêm API để kiểm tra chuyến đi có đầy không
                const checkTripFullResponse = await axios.get(`Booking/checkTripFull/${tripId}`);
                setIsTripFull(checkTripFullResponse.data.isFull || false);
                setCurrentBookingsCount(checkTripFullResponse.data.currentBookingsCount || 0); // Lưu số lượng đặt chỗ hiện tại
                setMaxPerson(tripResponse.data.maxPerson || 0);
            } catch (error) {
                console.error('Error fetching data:', error);
                setErrorMessage('Error fetching trip details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTripData();
    }, [tripId, tripType]);

    const formatISODate = (isoDate) => {
        const date = new Date(isoDate);
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    };

    return (
        <div className="trip-detail-container">
            {pageLoading ? (
                <div className="loading-spinner">
                    <CircularProgress />
                </div>
            ) : (
                <>
                    <h1>Trip Details</h1>
                    {loading && <p className="loading-message">Loading trip details...</p>}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <div className="trip-info">
                        {trip.pickUpLocationName && (
                            <div className="trip-row">
                                <strong>Pick Up Location:</strong>
                                <span>{trip.pickUpLocationName}</span>
                            </div>
                        )}
                        <div className="trip-row">
                            <strong>Drop Off Location:</strong>
                            <span>{trip.dropOffLocationName || 'Unknown'}</span>
                        </div>
                        <div className="trip-row">
                            <strong>Booking Date:</strong>
                            <span>{formatISODate(trip.bookingDate)}</span>
                        </div>
                        <div className="trip-row">
                            <strong>Time:</strong>
                            <span>{trip.hourInDay}</span>
                        </div>
                        <div className="trip-row">
                            <strong>Max Persons:</strong>
                            <span>{trip.maxPerson}</span>
                        </div>
                        <div className="trip-row">
                            <strong>Min Persons:</strong>
                            <span>{trip.minPerson}</span>
                        </div>
                        <div className="trip-row">
                            <strong>Pricing:</strong>
                            <span>{trip.unitPrice ? trip.unitPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'Unknown'}</span>
                        </div>
                        <div className="trip-row">
                            <strong>Trip Full:</strong>
                            <span>{loading ? 'Loading...' : (isTripFull ? 'Yes' : 'No')}</span>
                        </div>
                        <div className="trip-row">
                            <strong>Current Bookings:</strong>
                            <span>{loading ? 'Loading...' : `${currentBookingsCount} / ${maxPerson}`}</span>
                        </div>
                        {errorMessage && (
                            <div className="error-message">{errorMessage}</div>
                        )}
                    </div>
                    <div className="trip-info">
                        <h2>Car Trip Information</h2>
                        <div className="trip-row">
                            <strong>Driver:</strong>
                            <span>{carTrip.driverName || 'No information available'}</span>
                        </div>
                        <div className="trip-row">
                            <strong>Driver Phone:</strong>
                            <span>{carTrip.driverPhone || 'No information available'}</span>
                        </div>
                        <div className="trip-row">
                            <strong>Plate Number:</strong>
                            <span>{carTrip.plateNumber || 'No information available'}</span>
                        </div>
                        <div className="trip-row">
                            <strong>Arrival Time:</strong>
                            <span>{carTrip.arrivedTime || 'No information available'}</span>
                        </div>
                    </div>
                    <h2>Trip Type Description</h2>
                    <div className="trip-description">
                        <div className="trip-row">
                            <strong>Description:</strong>
                            <span>{loading ? 'Loading...' : tripTypeDescription || 'Unknown'}</span>
                        </div>
                        <div className="trip-row">
                            <strong>Users:</strong>
                            <span>
                                {loading ? 'Loading...' : tripUsers.length > 0 ? (
                                    <ul>
                                        {tripUsers.map(user => (
                                            <li key={user.id}>{user.name}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    'No users found'
                                )}
                            </span>
                        </div>
                        <div className="trip-row">
                            <strong>Total Users:</strong>
                            <span>{loading ? 'Loading...' : tripUsers.length}</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
