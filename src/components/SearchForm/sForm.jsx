import React, { useState, useEffect } from "react";
import Calendar from "../Container/calender/calendar";
import moment from 'moment';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import axios from '../../config/axios';
import './sForm.css';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';

export default function SForm({ leavingFrom, leavingFromArea, goingTo, goingToArea, selectedDate, selectedTimeSlot, numberOfPeople, selectedHistory }) {
    const [timeSlots, setTimeSlots] = useState([]);
    const [leavingFromState, setLeavingFrom] = useState(leavingFrom);
    const [goingToState, setGoingsTo] = useState(goingTo);
    const [selectedDateState, setSelectedDate] = useState(selectedDate ? moment(selectedDate, 'DD/MM/YYYY') : null);
    const [selectedTimeSlotState, setSelectedTimeSlot] = useState(selectedTimeSlot);
    const [numberOfPeopleState, setNumberOfPeople] = useState(numberOfPeople || 1);
    const [leavings, setLeavings] = useState([]);
    const [going, setGoings] = useState([]);
    const [filteredLeavingFrom, setFilteredLeavingFrom] = useState([]);
    const [filteredGoingTo, setFilteredGoingTo] = useState([]);
    const [leavingFromAreaState, setLeavingFromArea] = useState(leavingFromArea);
    const [goingToAreaState, setGoingsToArea] = useState(goingToArea);
    const [isTimeDisabled, setIsTimeDisabled] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const [areasList, setAreasList] = useState([]); // Renamed from 'area'
    const [previousSearch, setPreviousSearch] = useState({
        leavingFrom: leavingFrom,
        leavingFromArea: leavingFromArea,
        goingTo: goingTo,
        goingToArea: goingToArea,
        selectedDate: selectedDate,
        selectedTimeSlot: selectedTimeSlot,
        numberOfPeople: numberOfPeople || 1,
    });
    const [pageLoading, setPageLoading] = useState(false);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get('Location');
                setLeavings(response.data.$values || []);
                setGoings(response.data.$values || []);
            } catch (error) {
                console.error('Error fetching leavings:', error);
                alert("Failed to load leavings.");
            }
        };
        fetchLocations();
    }, []);

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const response = await axios.get('Area');
                setAreasList(response.data.$values || []);
            } catch (error) {
                console.error('Error fetching areas:', error);
                alert("Failed to load areas.");
            }
        };
        fetchAreas();
    }, []);

    useEffect(() => {
        if (location.pathname === '/') {
            resetForm();
        }
    }, [location]);

    useEffect(() => {
        if (selectedDateState && selectedDateState.isValid()) {
            const dayOfWeek = selectedDateState.day();
            const newTimeSlots = dayOfWeek === 0 || dayOfWeek === 6
                ? ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]
                : ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

            if (JSON.stringify(newTimeSlots) !== JSON.stringify(timeSlots)) {
                setTimeSlots(newTimeSlots);
                setIsTimeDisabled(false);
            }
        } else {
            setTimeSlots([]);
            setIsTimeDisabled(true);
        }
    }, [selectedDateState]);

    useEffect(() => {
        if (selectedHistory) {
            setLeavingFrom(selectedHistory.leavingFrom);
            setLeavingFromArea(selectedHistory.leavingFromArea);
            setGoingsTo(selectedHistory.goingTo);
            setGoingsToArea(selectedHistory.goingToArea);
            setSelectedDate(moment(selectedHistory.date, 'DD/MM/YYYY'));
            setSelectedTimeSlot(selectedHistory.timeSlot);
            setNumberOfPeople(selectedHistory.numberOfPeople);
        }
    }, [selectedHistory]);

    const resetForm = () => {
        setLeavingFrom('');
        setGoingsTo('');
        setSelectedDate(null);
        setSelectedTimeSlot('');
        setTimeSlots([]);
        setNumberOfPeople(1);
        setIsTimeDisabled(true);
    };

    useEffect(() => {
        if (leavingFromState) {
            const filtered = leavings.filter(location => location.areaId === parseInt(leavingFromState, 10));
            setFilteredLeavingFrom(filtered);
        } else {
            setFilteredLeavingFrom([]);
        }
    }, [leavingFromState, leavings]);

    useEffect(() => {
        if (goingToState) {
            const filtered = going.filter(location => location.areaId === parseInt(goingToState, 10));
            setFilteredGoingTo(filtered);
        } else {
            setFilteredGoingTo([]);
        }
    }, [goingToState, going]);

    const handleDateChange = (date) => {
        const selectedMoment = moment(date, 'DD/MM/YYYY');
        setSelectedDate(selectedMoment);
        setSelectedTimeSlot(''); // Reset time slot when date changes
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setPageLoading(true); // Bắt đầu loading

        try {
            const finalLeavingFrom = leavingFromState || previousSearch.leavingFrom;
            const finalGoingTo = goingToState || previousSearch.goingTo;

            const finalDate = selectedDateState || previousSearch.selectedDate;
            const finalTimeSlot = selectedTimeSlotState || previousSearch.selectedTimeSlot;
            const finalNumberOfPeople = numberOfPeopleState || previousSearch.numberOfPeople;
            const finalLeavingFromArea = leavingFromAreaState || previousSearch.leavingFromArea;
            const finalGoingToArea = goingToAreaState || previousSearch.goingToArea;
            
            if (!finalLeavingFrom || !finalGoingTo || !finalLeavingFromArea || !finalGoingToArea) {
                toast.error("Please select both 'Leaving from' and 'Going to'.");
                return; // Stop the function if no selection
            }

            // Thêm delay giả lập loading
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (finalLeavingFrom !== finalGoingTo) {
                const formattedTimeSlot = moment(finalTimeSlot, ["h:mm A", "h:mm"]).format("HH:mm");
                const searchUrl = `?leavingFrom=${finalLeavingFrom}&&finalLeavingFromArea=${finalLeavingFromArea}&goingTo=${finalGoingTo}&&finalGoingToArea=${finalGoingToArea}&&date=${moment(finalDate).format('DD-MM-YYYY')}&timeSlot=${formattedTimeSlot}&people=${finalNumberOfPeople}`;
                navigate(`/search${searchUrl}`);

                setPreviousSearch({
                    leavingFrom: finalLeavingFrom,
                    leavingFromArea: finalLeavingFromArea,
                    goingTo: finalGoingTo,
                    goingToArea: finalGoingToArea,
                    selectedDate: finalDate,
                    selectedTimeSlot: finalTimeSlot,
                    numberOfPeople: finalNumberOfPeople,
                });
            }
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setTimeout(() => {
                setPageLoading(false);
            }, 2000);
        }
    };

    const getOptionsMap = (areasList, leavingFromId) => {
        return areasList
            .filter(area => area.id !== leavingFromId) // Bỏ qua area có ID trùng với leavingFromId
            .map(area => ({
                value: area.id,
                label: area.name,
            }));
    };
    
    const options = leavingFromState ? getOptionsMap(areasList, parseInt(leavingFromState)) : areasList.map(area => ({
        value: area.id,
        label: area.name,
    }));
    

    return (
        <div className="search-bar">
            {pageLoading ? (
                <div className="loading-spinner">
                    <CircularProgress />
                </div>
            ) : (
                <form onSubmit={handleSearch}>
                    <div className="search-form">
                        <select
                            id="leaving-from"
                            className="form-select"
                            value={leavingFromState}
                            onChange={(e) => {
                                const newLeavingFrom = e.target.value;
                                setLeavingFrom(newLeavingFrom);
                                setLeavingFromArea('');
                                setGoingsTo('');
                                setGoingsToArea('');
                            }}
                        >
                            <option value="" disabled>Leaving from area</option>
                             {/* Map over all areas in areasList to display them */}
                            {areasList.map(area => (
                                <option key={area.id} value={area.id}>
                                    {area.name}
                                </option>
                            ))}
                        </select>

                        <select
                            id="leaving-area"
                            className={`form-select ${!leavingFromState ? 'hidden' : ''}`}
                            value={leavingFromAreaState}
                            onChange={(e) => setLeavingFromArea(e.target.value)}
                        >
                            <option value="" disabled>Leaving to location</option>
                            {filteredLeavingFrom.map(location => (
                                <option key={location.id} value={location.name}>{location.name}</option>
                            ))}
                        </select>

                        <select
                            id="goingTo"
                            className="form-select"
                            value={goingToState}
                            onChange={(e) => {
                                setGoingsTo(e.target.value);
                                setGoingsToArea('');
                            }}
                            disabled={!leavingFromAreaState}
                        >
                            <option value="" disabled>Going from area</option>
                            {options
                            .filter(option => !(
                                (parseInt(leavingFromState) === 3 && parseInt(option.value) === 2) || 
                                (parseInt(leavingFromState) === 2 && parseInt(option.value) === 3)
                            ))
                            .map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                
                        </select>

                        <select
                            id="going-to-area"
                            className={`form-select ${!goingToState ? 'hidden' : ''}`}
                            value={goingToAreaState}
                            onChange={(e) => setGoingsToArea(e.target.value)}
                            disabled={!goingToState}
                        >
                            <option value="" disabled>Going to location</option>
                            {filteredGoingTo.map(location => (
                                <option key={location.id} value={location.name}>{location.name}</option>
                            ))}
                        </select>

                        <Calendar
                            onDateChange={handleDateChange}
                            initialDate={selectedDateState ? selectedDateState.toDate() : null}
                        />

                        <select
                            id="time-slot"
                            className="form-select"
                            value={selectedTimeSlotState}
                            onChange={(e) => setSelectedTimeSlot(e.target.value)}
                            disabled={isTimeDisabled}
                        >
                            <option value="" disabled={selectedTimeSlotState === 'Invalid day'}>{selectedTimeSlotState === 'Invalid day' ? selectedTimeSlotState : "Select all time slot"}</option>
                            {timeSlots.map((slot, index) => (
                                <option key={index} value={slot}>{slot}</option>
                            ))}
                        </select>

                        <select
                            type="number"
                            value={numberOfPeopleState}
                            onChange={(e) => setNumberOfPeople(Math.max(1, e.target.value))}
                            min="1"
                            className="form-select"
                        >
                            <option value="" disabled>Number of people</option>
                            {[1, 2, 3, 4].map(value => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </select>

                        <button type="submit" id="search-button">Search</button>
                    </div>
                </form>
            )}
        </div>
    );
}