import React, { useEffect, useState } from 'react';
import axios from '../../config/axios';
import './RideShare.css';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import SearchFormPart from '../SearchFormPart/searchFormPart';
import { useLocation } from 'react-router-dom';
import CircularProgress from "@mui/material/CircularProgress";

const Trips = () => {
    const [trips, setTrips] = useState([]);
    const [tripCapacityStatus, setTripCapacityStatus] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [filteredTrips, setFilteredTrips] = useState([]);
    const location = useLocation();
    const [params, setParams] = useState({});
    const navigate = useNavigate();
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('userId');
        if (!token) {
            setErrorMessage('You are not logged in.');
            setLoading(false);
            return;
        }
        setUserId(token);
    }, []);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        setParams({
            pickUpLocationId: searchParams.get('pickUpLocationId'),
            leavingFromArea: searchParams.get('leavingFromArea'),
            dropOffLocationId: searchParams.get('dropOffLocationId'),
            goingToArea: searchParams.get('goingToArea'),
            bookingDate: searchParams.get('bookingDate'),
            timeSlot: searchParams.get('hourInDay'),
            numberOfPeople: searchParams.get('availableSlots'),
        });
    }, [location.search]);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await axios.get('Trip/availableTrips');
                const allTrips = response.data?.$values || [];

                // Check for each trip if the user has already joined
                const userInTripPromises = allTrips.map(async (trip) => {
                    try {
                        const response = await axios.get(`Booking/usersInTrip/${trip.id}`);
                        const usersInTrip = response.data?.$values?.map(user => user.id) || [];
                        return { trip, isUserInTrip: usersInTrip.includes(parseInt(userId)) };
                    } catch (error) {
                        handleError(error, 'Failed to check if user is in trip');
                        return { trip, isUserInTrip: false };
                    }
                });

                const tripsWithUserCheck = await Promise.all(userInTripPromises);
                
                // Filter trips based on parameters if they are provided
                const filtered = tripsWithUserCheck
                    .filter(({ isUserInTrip }) => !isUserInTrip)
                    .map(({ trip }) => trip)
                    .filter(trip => {
                        const matchesPickUpLocationId = params.pickUpLocationId === '1' ? trip.pickUpLocationName.includes('Vinhome') :
                            params.pickUpLocationId === '2' ? trip.pickUpLocationName.includes('NHVSV') :
                            params.pickUpLocationId === '3' ? trip.pickUpLocationName.includes('ÐH FPT') : true;
                        const matchesDropOffLocationId = params.dropOffLocationId === '1' ? trip.dropOffLocationName.includes('Vinhome') :
                            params.dropOffLocationId === '2' ? trip.dropOffLocationName.includes('NHVSV') :
                            params.dropOffLocationId === '3' ? trip.dropOffLocationName.includes('ÐH FPT') : true;
                        const matchesLeavingFrom = params.leavingFromArea ? trip.pickUpLocationName.includes(params.leavingFromArea) : true;
                        const matchesGoingTo = params.goingToArea ? trip.dropOffLocationName.includes(params.goingToArea) : true;
                        const matchesBookingDate = params.bookingDate ? trip.bookingDate.includes(params.bookingDate) : true;
                        const matchesTimeSlot = params.timeSlot ? trip.hourInDay.includes(params.timeSlot) : true;
                        const matchesNumberOfPeople = params.numberOfPeople ? trip.maxPerson >= parseInt(params.numberOfPeople) : true;
                        return matchesDropOffLocationId && matchesPickUpLocationId && matchesLeavingFrom && matchesGoingTo && matchesBookingDate && matchesTimeSlot && matchesNumberOfPeople;
                    })
                    .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));

                setTrips(allTrips);
                setFilteredTrips(filtered);
            } catch (error) {
                handleError(error, 'Failed to load trips');
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchTrips();
    }, [userId, params]);

    useEffect(() => {
        const checkTripCapacity = async () => {
            const capacityStatus = {};
            const capacityPromises = filteredTrips.map(async (trip) => {
                try {
                    const response = await axios.get(`Booking/checkTripFull/${trip.id}`);
                    capacityStatus[trip.id] = {
                        isFull: response.data.isFull,
                        currentBookingsCount: response.data.currentBookingsCount || 0
                    };
                } catch (error) {
                    handleError(error, 'Failed to check trip capacity');
                }
            });

            await Promise.all(capacityPromises);
            setTripCapacityStatus(capacityStatus);
        };

        if (filteredTrips.length > 0) {
            checkTripCapacity();
        }
    }, [filteredTrips]);

    useEffect(() => {
        setTimeout(() => {
            setPageLoading(false);
        }, 1000);
    }, []);

    const handleError = (error, defaultMessage) => {
        console.error(error);
        toast.error(error.response?.data?.message || 'Unable to connect to the server!');
        const message = `${defaultMessage}: ${error.response?.data?.message || error.message}`;
        setErrorMessage(message);
    };

    const formatDate = (date) => moment(date).format('DD/MM/YYYY');

    const handleJoinTrip = (trip) => {
        navigate(`/confirm`, { state: { trip } });
    };

    const handleViewDetails = (trip) => {
        navigate(`/trip-detail/${trip.id}`, { state: { tripType: trip.tripTypeId } });
    };

    return (
        <div className="trips-container">
            {pageLoading ? (
                <div className="loading-spinner">
                    <CircularProgress />
                </div>
            ) : (
                <>
                    <h1>Available Trips</h1>
                    <SearchFormPart />

                    {loading && <p>Loading trips...</p>}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    {filteredTrips.length === 0 && !loading ? (
                        <p>No trips available.</p>
                    ) : (
                        <table className="trips-table">
                            <thead>
                                <tr>
                                    <th>Pick Up Location</th>
                                    <th>Drop Off Location</th>
                                    <th>Booking Date</th>
                                    <th>Time</th>
                                    <th>Max Persons</th>
                                    <th>Min Persons</th>
                                    <th>Price per Person</th>
                                    <th>Number of Persons on Trip</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTrips.map((trip) => (
                                    <tr key={trip.id}>
                                        <td>{trip.pickUpLocationName}</td>
                                        <td>{trip.dropOffLocationName}</td>
                                        <td>{formatDate(trip.bookingDate)}</td>
                                        <td>{trip.hourInDay}</td>
                                        <td>{trip.maxPerson}</td>
                                        <td>{trip.minPerson}</td>
                                        <td>{trip.unitPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || 'Unknown'}</td>
                                        <td>{tripCapacityStatus[trip.id]?.currentBookingsCount || '0'}</td>
                                        <td>
                                            <button 
                                                className="join-button" 
                                                onClick={() => handleJoinTrip(trip)} 
                                                disabled={tripCapacityStatus[trip.id]?.isFull}
                                            >
                                                Join
                                            </button>
                                            <button 
                                                className="view-details-button" 
                                                onClick={() => handleViewDetails(trip)}
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}
        </div>
    );
};

export default Trips;
