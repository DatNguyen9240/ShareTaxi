import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from "./page/Home/home";
import Login from "./page/Login/login";
import SignUp from "./page/SignUp/signUp";
import Profile from './page/Profile/profile';
import Search from './page/Search/search';
import TripDetail from "./page/TripDetail/tripDetail";
import ConfirmTrip from "./page/Confirm/confirm";
import MyTrips from "./page/MyTrips/myTrips";
// Components
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ResetPassword from './components/ResetPassword/resetPassword';
import RideShare from "./components/RideShare/RideShare";
import Wallet from "./components/Wallet/wallet";
import Header from "./components/Header/Header"; // Importing the Header component
import Transaction from "./components/Transaction/Transaction";
const App = () => {
  return (
    <Router>
      <Header /> {/* Place Header here to render on all pages */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/api/reset-password/:token" element={<ResetPassword />} />
        <Route path="/search" element={<Search />} />
        <Route path="/rideShare" element={
          <ProtectedRoute>
            <RideShare />
          </ProtectedRoute>
        } />
        <Route path="/confirm" element={<ConfirmTrip />} />
        {/* Protected Routes */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile /> 
            </ProtectedRoute>
          } 
        />
        <Route path="/wallet" element={
          <ProtectedRoute>
            <Wallet />
          </ProtectedRoute>
        } />
        <Route path="/transaction" element={
          <ProtectedRoute>
            <Transaction />
          </ProtectedRoute>
        } />
        <Route path="/trip-detail/:tripId" element={
          <ProtectedRoute>
            <TripDetail />
          </ProtectedRoute>
        } />
        <Route path="/myTrips" element={
          <ProtectedRoute>
            <MyTrips />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
