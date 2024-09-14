import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { FaWifi, FaChair, FaMapMarkerAlt, FaParking, FaShare } from 'react-icons/fa';
import { GiCctvCamera } from "react-icons/gi";
import { IoIosStar } from "react-icons/io";
import Contact from '../components/Contact';
import Reserve from "../components/Reserve";
import { DatePicker, Space } from 'antd';
import 'antd/dist/reset.css';
const { RangePicker } = DatePicker;
import moment from "moment";
import Swal from "sweetalert2";

export default function HotelDetails() {

  SwiperCore.use([Navigation]);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const startDate = params.startDate;
  const endDate = params.endDate;
  const fromDate = moment(startDate, "DD-MM-YYYY");
  const toDate = moment(endDate, "DD-MM-YYYY");
  const totalDays = moment.duration(toDate.diff(fromDate)).asDays() + 1;

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/hotel/get/${params.hotelId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setHotel(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchHotel();
  }, [params.hotelId]);

  const handleClick = () => {
    if (currentUser) {
      if((startDate == 'undefined' || endDate == 'undefined')){
        Swal.fire("Oops!", "Please select a valid date range!", "warning");
        return;
      }
      else if(currentUser.isAdmin){
        Swal.fire("Oops!", "Admin cannot book the room!", "warning");
        return;
      }
      else{
        setOpenModal(true);
      }
    }
    else{
      navigate('/login');
      return;
    }
  }

  const handleContact = () => {
    if (currentUser) {
      if(currentUser.isAdmin){
        Swal.fire("Oops!", "You itself a Admin!", "warning");
        return;
      }
      else{
        setContact(true);
      }
    }
    else{
      navigate('/login');
      return;
    }
  }

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Something went wrong!</p>
      )}
      {hotel && !loading && !error && (
        <div>
          <Swiper navigation>
            {hotel.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-4 mt-2 gap-4'>
            <p className='text-2xl font-semibold'>
              {hotel.name}
            </p>
            <p className='flex items-center gap-2 text-slate-600 text-md'>
              <FaMapMarkerAlt className='text-green-700 ' />
              {hotel.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-cyan-600 w-full flex gap-1 max-w-[55px] text-white text-center p-1 rounded-md'>
                <span className='ml-2 text-lg'>{hotel.rating}</span>
                <IoIosStar className='my-1 text-xl'/>
              </p>
              {hotel.offer && (
                <p className='bg-yellow-600 w-full max-w-[250px] uppercase text-white text-center p-1 rounded-md'>
                  ₹{hotel.discountPrice} off on every room
                </p>
              )}
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {hotel.description}
            </p>

            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <GiCctvCamera className='text-lg' />
                {hotel.cctv ? 'CCTV' : 'No CCTV'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaWifi className='text-lg'/>
                {hotel.wifi ? 'WIFI' : 'No WIFI'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {hotel.parking ? 'Parking Spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {hotel.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>

            <div className='text-slate-800 flex flex-wrap gap-2'>
              <span className='font-semibold text-black'>CheckIn Date - </span>
                {startDate}
              <span className='font-semibold text-black'>CheckOut Date - </span>
                {endDate}
            </div>

            <div className='text-slate-800 flex flex-col gap-3'>
              <p className='text-slate-800 flex flex-wrap gap-2'>
                <span className='font-semibold text-black'>Total Days : </span>
                  {totalDays}
              </p>
              <p className='text-slate-800'>
                <span className='font-semibold text-black'>Created by - </span>
                <span>Admin</span>
              </p>
            </div>

              <button onClick={handleClick} className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'>
                Check Rooms Availability
              </button>

            {openModal && <Reserve 
                setOpen={setOpenModal}
                hotel={hotel}
                startDate={startDate}
                endDate={endDate}
            />}

            {!contact && (
              <button
                onClick={handleContact}
                className='bg-blue-600 text-white rounded-lg uppercase hover:opacity-95 p-3'
              >
                Contact Admin
              </button>
            )}
            {contact && <Contact hotel={hotel} />}
          </div>
        </div>
      )}
    </main>
  );
}