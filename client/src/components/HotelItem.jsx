import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Modal from "react-modal";
import { FaWifi, FaChair, FaMapMarkerAlt, FaParking, FaShare } from "react-icons/fa";
import { IoIosStar } from "react-icons/io";
import { GiCctvCamera } from "react-icons/gi";


const customStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex:9999
  },
  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "lightcyan",
    padding: "20px",
    border: "2px solid black",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    maxWidth: "650px",
    width: "90%",
    maxHeight: "500px",
    height: "100%",
    overflowY: "auto",
    borderRadius: "8px",
    zIndex:10000
  },
};

Modal.setAppElement("#root");

export default function HotelItem({ hotel, startDate, endDate }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const params = useParams();

  return (
    <div className="bg-gray-200 shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-md w-full sm:w-[330px] border-solid border-2 border-zinc-600">
      <img
        src={
          hotel.imageUrls[0] || "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
        }
        alt="hotel cover"
        className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
      />
      <div className="p-3 flex flex-col gap-2 w-full">
        <p className="truncate text-lg font-semibold text-black">
          {hotel.name}
        </p>
        <div className='flex gap-3'>
          <p className='bg-cyan-600 w-full flex gap-1 max-w-[45px] text-white text-center rounded-md'>
            <span className='ml-2 text-md'>{hotel.rating}</span>
            <IoIosStar className='my-1 text-lg'/>
          </p>
          {hotel.offer && (
            <p className='bg-yellow-600 w-full max-w-[70px] uppercase text-white text-center rounded-md'>
              Offer
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <FaMapMarkerAlt className="text-lg text-green-700" />
          <p className="text-md text-black truncate w-full">
            {hotel.address}
          </p>
        </div>
        <div className="flex gap-3 mt-1">
          <Link
            onClick={openModal}
            className="bg-blue-700 text-white w-full max-w-[120px] p-1 rounded-md text-center hover:opacity-90"
            >
            View Details
          </Link>
          {(startDate && endDate) && (
            <Link
              to={`/hotel/${hotel._id}/${startDate}/${endDate}`}
              className="bg-green-700 text-white w-full max-w-[105px] p-1 rounded-md text-center hover:opacity-90"
            >
              Proceed
            </Link>
          )}
        </div>

        {/* Model */}

        <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <img
            src={hotel.imageUrls[0]}
            alt="hotel cover"
            className="rounded-lg border-solid border-black border-2 h-[255px] sm:h-[255px] w-full hover:scale-105 transition-scale duration-300"
          />
          <div className="p-1 mt-2">
              <p className="text-xl font-semibold">
                {hotel.name}
              </p>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <FaMapMarkerAlt className=" text-lg text-green-700" />
            <p className="text-lg text-black truncate w-full">
              {hotel.address}
            </p>
          </div>
          <div className='flex gap-3 mt-3'>
            <p className='bg-cyan-600 w-full flex gap-1 max-w-[45px] text-white text-center rounded-md'>
              <span className='ml-2 text-md'>{hotel.rating}</span>
              <IoIosStar className='my-1 text-lg'/>
            </p>
            {hotel.offer && (
              <p className='bg-yellow-600 w-full max-w-[240px] uppercase text-white text-center rounded-md'>
                ₹{hotel.discountPrice} off on every room
              </p>
            )}
          </div>
          <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6 mt-4'>
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
          <button
            onClick={closeModal}
            className="bg-red-600 text-white w-full max-w-[100px] p-1 rounded-md text-center hover:opacity-90 mt-4"
          >
            Close
          </button>
        </Modal>
      </div>
    </div>
  );
}
