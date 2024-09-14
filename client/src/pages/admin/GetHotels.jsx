import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function GetHotels() {

    const { currentUser, loading, error } = useSelector((state) => state.user);
    const [showHotelsError, setShowHotelsError] = useState(false);
    const [allHotels, setAllHotels] = useState([]);
    useEffect(() => {
        const handleShowHotels = async () => {
            try {
              setShowHotelsError(false);
              const res = await fetch(`/api/admin/gethotels`);
              const data = await res.json();
              if (data.success === false) {
                setShowHotelsError(true);
                return;
              }
            //   console.log(data);
              setAllHotels(data);
            } catch (error) {
                setShowHotelsError(true);
            }
        };
        handleShowHotels();
    },[]);

    const handleHotelDelete = async (hotelId) => {
        try {
          const res = await fetch(`/api/hotel/delete/${hotelId}`, {
            method: 'DELETE',
          });
          const data = await res.json();
          if (data.success === false) {
            console.log(data.message);
            return;
          }
          console.log(data.message);
          setAllHotels((prev) =>
            prev.filter((hotel) => hotel._id !== hotelId)
          );
        } catch (error) {
          console.log(error.message);
        }
    };

    return (
        <>
        <h1 className='text-center my-4 text-3xl font-semibold'>All Hotels...</h1>
        <div className='p-4 max-w-xl mx-auto border-2 border-slate-600 bg-slate-300 rounded-md mb-4'>
            {allHotels && allHotels.length > 0 && (
                <div className='flex flex-col gap-4'>
                    {allHotels.map((hotel) => (
                    <div
                        key={hotel._id}
                        className='border-2 border-neutral-600 rounded-md p-3 flex justify-between items-center gap-4 bg-white'
                    >
                        <Link to={`/hotel/${hotel._id}/${undefined}/${undefined}`}>
                        <img
                            src={hotel.imageUrls[0]}
                            alt='hotel cover'
                            className='h-18 w-24 object-contain'
                        />
                        </Link>
                        <Link
                            className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                            to={`/hotel/${hotel._id}/${undefined}/${undefined}`}
                        >
                            <p>{hotel.name}</p>
                        </Link>

                        <div className='flex flex-col item-center'>
                            <button
                                onClick={() => handleHotelDelete(hotel._id)}
                                className='text-red-700 uppercase'
                            >
                                Delete
                            </button>
                        <Link to={`/update-hotel/${hotel._id}`}>
                            <button className='text-green-700 uppercase'>Edit</button>
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
