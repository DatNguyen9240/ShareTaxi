// import React, { useState, useEffect, createContext } from 'react';

// // Tạo context
// const ThemContext = createContext();

// function ThemeProvider({ children }) {
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [leavingFrom, setLeavingFrom] = useState('');
//   const [goingTo, setGoingTo] = useState('');
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
//   const [locations, setLocations] = useState([]); // State for locations
//   const [areas, setAreas] = useState([]);

//   useEffect(() => {
//     const fetchLocations = async () => {
//         try {
//             const response = await axios.get('http://localhost:3000/api/locations');
//             console.log('Fetched locations:', response.data); // Log the response data
//             setLocations(response.data); 
//         } catch (error) {
//             console.error('Error fetching locations:', error);
//             alert("Failed to load locations.");
//         }
//     };

//     fetchLocations();
// }, []);

// useEffect(() => {
//     const fetchAreas = async () => {
       
//             try {
//                 const response = await axios.get('http://localhost:3000/api/areas');
//                 console.log('Fetched areas:', response.data); // Log the response data
//                 setAreas(response.data); 
//             } catch (error) {
//                 console.error('Error fetching areas:', error);
//                 alert("Failed to load areas.");
//             }
        
//     };

//     fetchAreas();
// }, []);


// const handleDateChange = (date) => {
//     setSelectedDate(date);
//     if (date) {
//         setTimeSlots(["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"]);
//     } else {
//         setTimeSlots([]);
//     }
// };

// const handleSearch = (e) => {
//     e.preventDefault();
    
//     if (leavingFrom && goingTo && selectedDate && selectedTimeSlot) {
//         navigate(`/search?leavingFrom=${leavingFrom}&goingTo=${goingTo}&date=${selectedDate.format('DD/MM/YYYY')}&timeSlot=${selectedTimeSlot}`);
//     } else {
//         alert("Please fill in all fields!");
//     }
    
// };

//   // Trả về context provider với giá trị darkMode và toggleDarkMode
//   return (
//     <ThemContext.Provider value={{ leavingFrom, goingTo, selectedDate, timeSlots }}>
//       {children}
//     </ThemContext.Provider>
//   );
// }

// export { ThemeProvider, ThemContext };
