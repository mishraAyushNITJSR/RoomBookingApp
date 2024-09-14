import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function GetRooms() {

    const { currentUser, loading, error } = useSelector((state) => state.user);
    const [showRoomsError, setShowRoomsError] = useState(false);
    const [allRooms, setAllRooms] = useState([]);

    useEffect(() => {
        const handleShowRooms = async () => {
            try {
              setShowRoomsError(false);
              const res = await fetch(`/api/admin/getrooms`);
              const data = await res.json();
              if (data.success === false) {
                setShowRoomsError(true);
                return;
              }
            //   console.log(data);
              setAllRooms(data);
            } catch (error) {
                setShowRoomsError(true);
            }
        };
        handleShowRooms();
    },[]);

    return (
        <>
        <h1 className='text-center my-4 text-3xl font-semibold'>All Rooms...</h1>
        <div className='p-4 max-w-2xl mx-auto border-2 border-slate-600 bg-slate-300 rounded-md mb-4'>
            {allRooms && allRooms.length > 0 && (
                <div className='flex flex-col gap-4'>
                    {allRooms.map((room) => (
                    <div key={room._id} className='border-2 border-neutral-600 rounded-md p-3 bg-white'>
                        <div className='flex flex-col text-lg'>
                            <div className='text-black font-semibold truncate flex-1'>
                                Title - {room.title}
                            </div>
                            <div className='text-black truncate flex-1'>
                                {room.bedrooms > 1 ? `${room.bedrooms} Beds` : `${room.bedrooms} Bed`} , {room.bathrooms > 1 ? `${room.bathrooms} Baths` : `${room.bathrooms} Bath`}
                            </div>
                            <div className='text-black truncate flex-1'>
                                {room.ac ? 'AC' : 'No AC'} , {room.tv ? 'TV' : 'No TV'}
                            </div>
                            <div className='text-slate-700 truncate flex-1'>
                                <span className='text-black'>Max_People - </span>
                                {room.maxPeople}
                            </div>
                            <div className='text-slate-700 truncate flex-1'>
                                <span className='text-black'>Price - </span>
                                ₹{room.price} / room
                            </div>
                            <div className='text-slate-700 truncate flex flex-wrap'>
                                <span className='text-black'>Room No. - </span>
                                {room.roomNumbers.map((roomNumber) => (
                                    <label>{roomNumber.number},</label>
                                ))}
                            </div>
                        </div>

                        <div className='flex flex-wrap justify-between item-center mt-2'>
                            <Link to={`/update-room/${room._id}`}>
                                <button className='text-white bg-green-600 w-14 p-1 rounded-md uppercase'>Edit</button>
                            </Link>
                        </div>
                    </div>
                    ))}
                </div>
            )}
        </div>
        </>
    );
} 