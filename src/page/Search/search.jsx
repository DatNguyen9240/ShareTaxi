import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SForm from "../../components/SearchForm/sForm";
import Header from "../../components/Header/Header";
import "./search.css";
import moment from "moment";
import axios from "../../config/axios";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";

export default function SearchForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useState(null);
  const [tripData, setTripData] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [locationId, setLocationId] = useState(null);
  const [areaId, setAreaId] = useState(null);
  const [isTripDataFetched, setIsTripDataFetched] = useState(false);
  const [availableSlots, setAvailableSlots] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [errorMessage, setErrorMessage] = useState('');
  const [tripCapacityStatus, setTripCapacityStatus] = useState({});
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [joinedTrips, setJoinedTrips] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        setParams({
          leavingFrom: searchParams.get("leavingFrom") || "",
          leavingFromArea: searchParams.get("finalLeavingFromArea") || "",
          goingTo: searchParams.get("goingTo") || "",
          goingToArea: searchParams.get("finalGoingToArea") || "",
          date: searchParams.get("date")
            ? moment(searchParams.get("date"), "DD/MM/YYYY")
            : moment(),
          timeSlot: searchParams.get("timeSlot") || "",
          numberOfPeople: searchParams.get("people") || "",
        });
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchData();
  }, [location.search]);
  useEffect(() => {
    const checkTripCapacity = async () => {
      const capacityStatus = {};
      const capacityPromises = filteredTrips.map(async (trip) => {
        try {
          const response = await axios.get(`Booking/checkTripFull/${trip.id}`);
          capacityStatus[trip.id] = {
            isFull: response.data.isFull,
            currentBookingsCount: response.data.currentBookingsCount || 0,
          };
        } catch (error) {
          handleError(error, "Failed to check trip capacity");
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
    const fetchAvailableSlots = async () => {
      if (!params) return;
      const response = await axios.get(`Trip/search?availableSlots=1`);
      setAvailableSlots(response.data.$values || []);
      setFilteredTrips(response.data?.$values || []);
      setLoading(false);
    };
    fetchAvailableSlots();
  }, [params]);

  useEffect(() => {
    if (!params) return;

    const fetchLocationId = async () => {
      if (!params.leavingFromArea) return;
      try {
        const result = await axios.get(
          `Location/search?name=${params.leavingFromArea}`
        );
        setLocationId(result.data.$values.map((item) => item.id));
      } catch (error) {
        console.error("Error fetching location ID:", error);
      }
    };

    const fetchAreaId = async () => {
      if (!params || !params.goingToArea) return;
      try {
        const result = await axios.get(
          `Location/search?name=${params.goingToArea}`
        );
        setAreaId(result.data.$values.map((item) => item.id));
      } catch (error) {
        console.error("Error fetching area ID:", error);
      }
    };

    fetchLocationId();
    fetchAreaId();
  }, [params]);

  useEffect(() => {
    if (!locationId || !areaId || !params) return;

    const timeSlotParam =
      params.timeSlot === "Invalid date" ? "" : `&hourInDay=${params.timeSlot}`;
    const searchUrlApi = `?pickUpLocationId=${locationId}&dropOffLocationId=${areaId}&bookingDate=${params.date.format(
      "YYYY-MM-DD"
    )}${timeSlotParam}&availableSlots=${params.numberOfPeople}`;

    const fetchTripData = async () => {
      try {
        const response = await axios.get(`Trip/search${searchUrlApi}`);
        const tripDataWithSeats = await Promise.all(
          response.data.$values.map(async (trip) => {
            try {
              const seatsResponse = await axios.get(
                `Booking/usersInTrip/${trip.id}`
              );
              return {
                ...trip,
                numberOfSeats: seatsResponse.data.$values.length,
              };
            } catch (error) {
              console.error("Error fetching user count:", error);
              return { ...trip, numberOfSeats: 0 };
            } finally {
              setLoading(true);
            }
          })
        );

        setTripData(tripDataWithSeats);
        setIsTripDataFetched(true);

        if (tripDataWithSeats.length > 0) {
          const newSearch = {
            leavingFrom: params.leavingFrom,
            leavingFromArea: params.leavingFromArea,
            goingTo: params.goingTo,
            goingToArea: params.goingToArea,
            date: params.date.format("DD/MM/YYYY"),
            timeSlot: params.timeSlot,
            numberOfPeople: params.numberOfPeople,
          };

          if (newSearch.leavingFromArea && newSearch.goingToArea) {
            setSearchHistory((prevHistory) => {
              const updatedHistory = [newSearch, ...prevHistory].slice(0, 5);
              localStorage.setItem(
                "searchHistory",
                JSON.stringify(updatedHistory)
              );
              return updatedHistory;
            });
          }
        }
      } catch (error) {
        console.error("Error fetching trips:", error);
        setTripData(null);
        setIsTripDataFetched(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [locationId, areaId, params]);

  useEffect(() => {
    const storedHistory =
      JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(storedHistory);
  }, []);

  useEffect(() => {
    const fetchJoinedTrips = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(`Trip/TripJoined/${userId}`);
        setJoinedTrips(response.data?.$values?.map((trip) => trip.id) || []);
      } catch (error) {
        console.error("Error fetching joined trips:", error);
      }
    };

    fetchJoinedTrips();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 1000);
  }, []);

  const handleDateChange = (newDate) => {
    setParams((prevParams) => ({
      ...prevParams,
      date: moment(newDate, "DD/MM/YYYY"),
    }));
  };

  const handleHistoryClick = async (search) => {
    setHistoryLoading(true);

    try {
      setSelectedHistory(search);
      setParams({
        leavingFrom: search.leavingFrom,
        leavingFromArea: search.leavingFromArea,
        goingTo: search.goingTo,
        goingToArea: search.goingToArea,
        date: moment(search.date, "DD/MM/YYYY"),
        timeSlot: search.timeSlot,
        numberOfPeople: search.numberOfPeople,
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Error handling history click:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleTripClick = (trip) => {
    if (trip.numberOfSeats >= trip.maxPerson) {
      toast.error("No seats available for this trip!");
      return;
    }
    navigate("/confirm", { state: { trip } });
  };
  const handleViewDetails = (trip) => {
    navigate(`/trip-detail/${trip.id}`, {
      state: { tripType: trip.tripTypeId },
    });
  };
  const handleJoinTrip = (trip) => {
    navigate(`/confirm`, { state: { trip } });
  };
  const formatDate = (dateString) => {
    return moment(dateString).format("DD/MM/YYYY");
  };

  return (
    <div className="container-fluid mt-5 containerSearch">
      {pageLoading ? (
        <div className="loading-spinner">
          <CircularProgress />
        </div>
      ) : (
        <>
          <Header />
          <h1 style={{ marginBottom: "50px" }}>Search Results</h1>

          <>
            {params && (
              <SForm
                leavingFrom={params.leavingFrom}
                leavingFromArea={params.leavingFromArea}
                goingTo={params.goingTo}
                goingToArea={params.goingToArea}
                selectedDate={params.date.format("DD/MM/YYYY")}
                selectedTimeSlot={params.timeSlot}
                numberOfPeople={params.numberOfPeople}
                selectedHistory={selectedHistory}
                onDateChange={handleDateChange}
              />
            )}
            {isTripDataFetched && tripData && tripData.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-bordered table-hover trip-table">
                  <thead>
                    <tr>
                      <th>Departure Time</th>
                      <th>Pick Up Point</th>
                      <th>Date</th>
                      <th>Drop Off Point</th>
                      <th>Price</th>
                      <th>Number of Seats</th>
                      <th>Services</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tripData.map((trip) => {
                      const formattedDate = moment(trip.bookingDate).format(
                        "DD/MM/YYYY"
                      );
                      const formattedTime = moment(
                        trip.hourInDay,
                        "HH:mm:ss"
                      ).format("HH:mm");

                      return (
                        <tr
                          key={trip.id}
                          onClick={() => handleTripClick(trip)}
                          style={{ cursor: "pointer" }}
                        >
                          <td>{formattedTime} hours</td>
                          <td>{trip.pickUpLocationName}</td>
                          <td>{formattedDate}</td>
                          <td>{trip.dropOffLocationName}</td>
                          <td>
                            {trip.unitPrice.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </td>
                          <td>
                            {trip.numberOfSeats}/{trip.maxPerson}
                          </td>
                          <td>
                            <span className="icon">📶</span> Wifi &nbsp;
                            <span className="icon">💧</span> Water provided
                            &nbsp;
                            <span className="icon">🔌</span>Outlet
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              isTripDataFetched && (
                <p style={{ fontSize: "1.5rem", marginTop: "50px" }}>
                  No trips found.
                </p>
              )
            )}
          </>

          <div className="search-history">
            <h1>Search History</h1>
            {historyLoading ? (
              <div className="loading-spinner">
                <CircularProgress />
              </div>
            ) : (
              searchHistory
                .filter(
                  (search, index, self) =>
                    index ===
                    self.findIndex(
                      (s) =>
                        s.leavingFromArea === search.leavingFromArea &&
                        s.goingToArea === search.goingToArea
                    )
                )
                .map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryClick(search)}
                    className="btn btn-secondary mr-2 mb-2"
                  >
                    {search.leavingFromArea} → {search.goingToArea}
                  </button>
                ))
            )}
          </div>
          <div className="trips-container">
            <h1>Available Trips</h1>
            {loading && <p>Loading trips...</p>}
            {/* {errorMessage && <p className="error-message">{errorMessage}</p>} */}
            {localStorage.getItem("userId") ? (
              availableSlots && availableSlots.length > 0 ? (
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
                    {availableSlots
                      .filter((trip) => !joinedTrips.includes(trip.id))
                      .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
                      .map((trip) => (
                        <tr key={trip.id}>
                          <td>{trip.pickUpLocationName}</td>
                          <td>{trip.dropOffLocationName}</td>
                          <td>{formatDate(trip.bookingDate)}</td>
                          <td>{trip.hourInDay}</td>
                          <td>{trip.maxPerson}</td>
                          <td>{trip.minPerson}</td>
                          <td>
                            {trip.unitPrice.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }) || "Unknown"}
                          </td>
                          <td>
                            {tripCapacityStatus[trip.id]
                              ?.currentBookingsCount || "0"}
                          </td>
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
              ) : (
                <p>No trips available.</p>
              )
            ) : (
              <p>Please log in to view trips.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
