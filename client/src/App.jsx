import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Hotels from './pages/Hotels';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import CreateHotel from './pages/admin/CreateHotel';
import CreateRoom from './pages/admin/CreateRoom';
import UpdateHotel from './pages/admin/UpdateHotel';
import UpdateRoom from './pages/admin/UpdateRoom';
import HotelDetails from './pages/HotelDetails';
import Search from './pages/Search';
import Booking from './pages/Booking';
import GetHotels from './pages/admin/GetHotels';
import GetRooms from './pages/admin/GetRooms';
import GetUsers from './pages/admin/GetUsers';
import Home from './pages/Home';

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);

  useEffect(() => {
    setShowFooter(location.pathname !== '/');
    setShowHeader(location.pathname !== '/');
  }, [location.pathname]);

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/hotels' element={<Hotels />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/about' element={<About />} />
        <Route path='/search' element={<Search />} />
        <Route path='/hotel/:hotelId/:startDate/:endDate' element={<HotelDetails/>} />

        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-hotel' element={<CreateHotel />} />
          <Route path='/create-room' element={<CreateRoom />} />
          <Route path='/get-hotels' element={<GetHotels />} />
          <Route path='/get-rooms' element={<GetRooms />} />
          <Route path='/get-users' element={<GetUsers />} />
          <Route path='/update-hotel/:hotelId' element={<UpdateHotel />} />
          <Route path='/update-room/:roomId' element={<UpdateRoom />} />
          <Route path='/bookings/:bookUserId' element={<Booking />} />
        </Route>
      </Routes>
      {showFooter && <Footer />}
    </>
  );
}

