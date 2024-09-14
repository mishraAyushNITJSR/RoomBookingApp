import React from 'react'
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Booking() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [bookings, setBookings] = useState([]);
    const params = useParams();
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchBookingByUserId = async () => {
          try {
            setLoading(true);
            const res = await fetch(`/api/booking/getbookingbyuserid/${params.bookUserId}`);
            const data = await res.json();
            console.log(data);
            if (data.success === false) {
              setError(true);
              setLoading(false);
              return;
            }
            setBookings(data);
            setLoading(false);
            setError(false);
          } catch (error) {
            setError(true);
            setLoading(false);
          }
        };
        fetchBookingByUserId();
    }, []);

    return (
        <div>
            <div className='flex-2'>
            <h1 className='text-3xl font-semibold p-2 text-black mt-1 text-center'>
              Your Bookings....
            </h1>
            <hr className='border-gray-400 mt-2'></hr>
            <div className='p-2 mt-4 flex flex-wrap gap-4 justify-center'>
              {!loading && bookings.length === 0 && (
                <p className='text-xl text-slate-700'>No booking found!</p>
              )}
              {loading && (
                <p className='text-xl text-slate-700 text-center w-full'>
                  Loading...
                </p>
              )}
              
              {!loading &&
                bookings &&
                bookings.map((booking) => (
                    <div className='bg-gray-200 shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px] border-solid border-2 border-zinc-500'>
                      <div className='p-3 flex flex-col gap-2 w-full'>
                        
                        <p className='text-lg font-semibold text-black'>
                          {booking.hotelName}
                        </p>

                        <hr className='border-gray-400'></hr>
                        
                        <p className='text-sm text-black'>
                            <span className='font-semibold text-black'>CheckIn Date - </span>
                            {booking.checkInDate}
                        </p>

                        <p className='text-sm text-black'>
                            <span className='font-semibold text-black'>CheckOut Date - </span>
                            {booking.checkOutDate}
                        </p>

                        <p className='text-sm text-black'>
                            <span className='font-semibold text-black'>Room Title - </span>
                            {booking.roomTitle[0]} , {booking.roomTitle[1]} , {booking.roomTitle[2]} , {booking.roomTitle[3]}
                        </p>

                        <p className='text-sm text-black'>
                            <span className='font-semibold text-black'>Total Room Booked - </span>
                            {(booking.roomNumbers).length}
                        </p>

                        <p className='text-sm text-black'>
                            <span className='font-semibold text-black'>Total Amount - </span>
                            {(booking.totalAmount)*((booking.roomNumbers).length)}
                        </p>

                        <p className='text-sm text-black'>
                            <span className='font-semibold text-black'>Booked by - </span>
                            {booking.bookingUserName}
                        </p>

                        <p className='text-sm text-black'>
                            <span className='font-semibold text-black'>Status - </span>
                            {booking.status}
                        </p>
          
                      </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
    )
}
