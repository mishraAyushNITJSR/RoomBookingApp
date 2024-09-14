import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { FaBath, FaBed } from 'react-icons/fa';
import { TbAirConditioning } from "react-icons/tb";
import { PiTelevisionFill } from "react-icons/pi";
import Modal from "react-modal";
import Swal from "sweetalert2";

const customStyles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999
    },
    content: {
        position: "absolute",
        top: "50%", // 50%
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "lightcyan",
        padding: "20px",
        border: "2px solid black",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        maxWidth: "550px",
        width: "90%", // 90%
        maxHeight: "450px", // 80vh
        height: "100%",
        overflowY: "auto",
        borderRadius: "8px",
        zIndex: 10000
    },
};

Modal.setAppElement("#root");

export default function Reserve({ setOpen, hotel, startDate='', endDate='' }) {

    const [hotelRoom, setHotelRoom] = useState([]);
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [allDates, setAllDates] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const { currentUser } = useSelector((state) => state.user);


    useEffect(() => {
        const fetchRoom = async () => {
          try {
            setLoading(true);
            const res = await fetch(`/api/hotel/room/${hotel._id}`);
            const data = await res.json();
            if (data.success === false) {
                setError(true);
                setLoading(false);
                return;
            }
            setHotelRoom(data);
            setLoading(false);
            setError(false);
          } catch (error) {
            setError(true);
            setLoading(false);
          }
        };
        fetchRoom();
      },[]);


    const closeModal = () => {
        setOpen(false);
    };

    const params = useParams();
    
    const formatDate = (dateString) => {
        const parts = dateString.split('-'); // Assuming date format is DD-MM-YYYY
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return null; // Invalid date format
    };
    
    const formattedStartDate = startDate ? formatDate(startDate) : null;
    const formattedEndDate = endDate ? formatDate(endDate) : null;

    const getDatesInRange = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
    
        const date = new Date(start.getTime());
    
        const dates = [];
    
        while (date <= end) {
          dates.push(new Date(date).getTime());
          date.setDate(date.getDate() + 1);
        }
        return dates;
    };
    useEffect(() => {
        if (formattedStartDate && formattedEndDate) {
            const dateRange = getDatesInRange(formattedStartDate, formattedEndDate);
            setAllDates(dateRange);
        }
    }, [formattedStartDate, formattedEndDate]);

    const isAvailable = (roomNumber) => {
        const isFound = roomNumber.unavailableDates.some((date) =>
        allDates.includes(new Date(date).getTime())
    );
        return !isFound;
    };

    const handleSelect = (e) => {
        const checked = e.target.checked;
        const value = e.target.value;
        setSelectedRooms(
        checked
            ? [...selectedRooms, value]
            : selectedRooms.filter((item) => item !== value)
        );
    };
    // console.log(selectedRooms);
    // console.log(selectedRooms[0]);

    const navigate = useNavigate();

const handleClick = async () => {
    if (selectedRooms.length == 0){
        setOpen(false);
        Swal.fire("Oops!", "Please select a room no. to reserve!", "warning");
        return;
    }
    const reserveRooms = [];
    hotelRoom.forEach(room => {
        let shouldContinue = true;
    
        room.roomNumbers.forEach(roomNumber => {
            selectedRooms.forEach(selectedItem => {
                if (roomNumber._id === selectedItem) {
                    reserveRooms.push(room.title);
                    shouldContinue = false;
                    return;
                }
            });
    
            if (!shouldContinue) return;
        });
    });
    let uniqueRooms = [...new Set(reserveRooms)];
    // console.log(uniqueArray);
    
    const bookingDetails = {
        hotelName : hotel.name,
        hotelId : hotel._id,
        bookingUserName : currentUser.username,
        bookingUserId : currentUser._id,
        checkInDate : startDate,
        checkOutDate : endDate,
        totalAmount : 4000,
        roomTitle : uniqueRooms,
        roomNumbers : selectedRooms
    }
        try {
            await Promise.all(
                selectedRooms.map(async (id) => {
                    const response = await fetch(`/api/room/availability/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ dates: allDates }),
                    });
                    const data = await response.json();
                    console.log(data);
                    return data;
                })
            );
            const result = await fetch(`/api/booking/create`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingDetails),
              });
            setOpen(false);
            Swal.fire("Congratulations!", "Your room has been booked successfully! Click OK to see the bookings....", "success").then(result=>{
                window.location.href=`/bookings/${currentUser._id}`;
            });
        } catch (err) {
            Swal.fire("Error!", "Something went wrong!", "error");
            console.error(err);
        }
    };

    return (
        <Modal
            isOpen={setOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
        >
            
        <h2 className='text-xl font-semibold text-center my-2 uppercase'>Select Your Rooms :</h2>
        {hotelRoom.map((item) => (
            <div className="flex flex-wrap p-3" key={item._id}>
                <div className="flex flex-col flex-1">
                    <div className="text-md">
                        <span className="font-semibold">Title : </span> 
                        <span className="text-lg">{item.title}</span>
                    </div>
                    <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                        <li className='flex items-center gap-1 whitespace-nowrap '>
                            <TbAirConditioning className='text-sm' />
                            {item.ac ? 'AC' : 'Non AC'}
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap '>
                            <PiTelevisionFill className='text-sm' />
                            {item.tv ? 'TV' : 'No TV'}
                        </li>
                    </ul>
                    <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                        <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaBed className='text-sm' />
                            {item.bedrooms > 1
                            ? `${item.bedrooms} beds `
                            : `${item.bedrooms} bed `}
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaBath className='text-sm' />
                            {item.bathrooms > 1
                            ? `${item.bathrooms} baths `
                            : `${item.bathrooms} bath `}
                        </li>
                    </ul>
                    <div className="text-md ">
                        <span className="font-semibold">Price : </span> 
                        <span className="">₹{item.price}</span>
                    </div>
                    <div className="text-md ">
                        <span className="font-semibold">Max_People : </span> 
                        <span className="">{item.maxPeople}</span>
                    </div>
                    <div className="text-md ">
                        <span className="font-semibold">Description : </span> 
                        <span className="">{item.description}</span>
                    </div>
                    
                </div>

                <div className="flex flex-wrap gap-3">
                    {item.roomNumbers.map((roomNumber) => (
                        <div className="flex flex-col mt-1 gap-1">
                            <label className="text-sm">{roomNumber.number}</label>
                            <input
                                type="checkbox"
                                value={roomNumber._id}
                                onChange={handleSelect}
                                disabled={!isAvailable(roomNumber)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        ))}
        <div className="flex flex-wrap gap-4 mt-3 justify-between">
            <button onClick={closeModal} className="bg-red-600 text-white w-full max-w-[80px] p-1 rounded-md text-center hover:opacity-90">
                Close
            </button>
            
            <button onClick={handleClick} className="bg-green-600 text-white w-full max-w-[130px] p-1 rounded-md text-center hover:opacity-90">
                Reserve Now!
            </button>
        </div>
        </Modal>
    );
}
