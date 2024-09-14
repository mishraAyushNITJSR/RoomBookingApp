import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import HotelItem from "../components/HotelItem";
import { DatePicker, Space } from "antd";
import "antd/dist/reset.css";
const { RangePicker } = DatePicker;
import moment from "moment";

export default function Hotels() {

  const [offerHotels, setOfferHotels] = useState([]);
  const [rentHotels, setRentHotels] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  SwiperCore.use([Navigation]);

  useEffect(() => {

    const fetchOfferHotels = async () => {
      try {
        const res = await fetch(`/api/hotel/get?offer=true&limit=4`);
        const data = await res.json();
        setOfferHotels(data);
        fetchRentHotels();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentHotels = async () => {
      try {
        const res = await fetch(`/api/hotel/get?offer=false&limit=4`);
        const data = await res.json();
        setRentHotels(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferHotels();
  }, []);

  function filterByDate(dates) {
    // console.log(moment(dates[0].$d).format('DD-MM-YYYY'));
    // console.log(moment(dates[1].$d).format('DD-MM-YYYY'));
    setStartDate(dates[0].format("DD-MM-YYYY"));
    setEndDate(dates[1].format("DD-MM-YYYY"));
  }

  return (
    <>
      <div className="bg-slate-200">
        <div className="flex flex-col gap-6 p-14 px-3 max-w-6xl mx-auto">
          <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
            Find your next <span className="text-slate-500">perfect</span>
            <br />
            place with ease.
          </h1>
          <div className="text-gray-800 text-xs sm:text-sm">
            HavenHike is the best place to find your next perfect hotel to
            live.
            <br />
            We have a wide range of properties for you to choose from.
          </div>
          <Link
            to={"/search"}
            className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
          >
            Let's get started...
          </Link>
        </div>

        <Swiper navigation>
          {offerHotels &&
            offerHotels.length > 0 &&
            offerHotels.map((hotel) => (
              <SwiperSlide>
                <div
                  style={{
                    background: `url(${hotel.imageUrls[0]}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                  className="h-[600px] border-2 border-solid border-zinc-500"
                  key={hotel._id}
                ></div>
              </SwiperSlide>
            ))}
        </Swiper>

        <div className="">
          <div className="mt-4 flex flex-wrap justify-center h-12">
            <RangePicker
              style={{
                backgroundColor: "lightgrey",
                fontSize: "15px",
                fontWeight: "bold",
                color: "black",
                borderStyle: "solid",
                borderWidth: "2px",
                borderColor: "black",
                width: "400px",
              }}
              format="DD-MM-YYYY"
              onChange={filterByDate}
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center text-xl my-1">
          <p>Select a date for any rent booking....</p>
        </div>
        
        <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8">

          {offerHotels && offerHotels.length > 0 && (
            <div className="" >
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-800">
                  Recent offers
                </h2>
                <Link
                  className="text-md text-blue-800 hover:underline"
                  to={"/search?offer=true"}
                >
                  Show more offers
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {offerHotels.map((hotel) => (
                  <HotelItem
                    hotel={hotel}
                    key={hotel._id}
                    startDate={startDate}
                    endDate={endDate}
                  />
                ))}
              </div>
            </div>
          )}

          <hr className='border-gray-500 mt-2'></hr>

          {rentHotels && rentHotels.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-800">
                  Recent hotels for rent
                </h2>
                <Link
                  className="text-md text-blue-800 hover:underline"
                  to={"/search?offer=false"}
                >
                  Show more hotels for rent
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {rentHotels.map((hotel) => (
                  <HotelItem
                    hotel={hotel}
                    key={hotel._id}
                    startDate={startDate}
                    endDate={endDate}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

