import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HotelItem from '../components/HotelItem';
import { DatePicker, Space } from "antd";
import "antd/dist/reset.css";
const { RangePicker } = DatePicker;
import moment from "moment";

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    parking: false,
    furnished: false,
    offer: false,
    cctv: false,
    wifi: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const cctvFromUrl = urlParams.get('cctv');
    const wifiFromUrl = urlParams.get('wifi');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      cctvFromUrl ||
      wifiFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        cctv: cctvFromUrl === 'true' ? true : false,
        wifi: wifiFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchHotels = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/hotel/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setHotels(data);
      setLoading(false);
    };

    fetchHotels();
  }, [location.search]);

  const handleChange = (e) => {

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'cctv' ||
      e.target.id === 'wifi' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';

      const order = e.target.value.split('_')[1] || 'desc';

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('cctv', sidebardata.cctv);
    urlParams.set('wifi', sidebardata.wifi);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfHotels = hotels.length;
    const startIndex = numberOfHotels;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/hotel/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setHotels([...hotels, ...data]);
  };

  function filterByDate(dates) {
    // console.log(moment(dates[0].$d).format('DD-MM-YYYY'));
    // console.log(moment(dates[1].$d).format('DD-MM-YYYY'));
    setStartDate(dates[0].format("DD-MM-YYYY"));
    setEndDate(dates[1].format("DD-MM-YYYY"));

  }

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Search Term:
            </label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Type:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Amenities:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='cctv'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.cctv}
              />
              <span>CCTV</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='wifi'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.wifi}
              />
              <span>WIFI</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id='sort_order'
              className='border border-slate-800 rounded-lg p-3'
            >
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Search
          </button>
        </form>
      </div>
      
      <div className='flex-1'>
        <div className="">
          <div className="mt-2 flex flex-wrap justify-center h-12">
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
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
          hotel results:
        </h1>
        <div className='p-2 mt-2 flex flex-wrap gap-4 justify-center'>
          {!loading && hotels.length === 0 && (
            <p className='text-xl text-slate-700'>No hotel found!</p>
          )}
          {loading && (
            <p className='text-xl text-slate-700 text-center w-full'>
              Loading...
            </p>
          )}

          {!loading &&
            hotels &&
            hotels.map((hotel) => (
              <HotelItem key={hotel._id} hotel={hotel} startDate={startDate} endDate={endDate}/>
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className='text-green-700 hover:underline p-7 text-center w-full'
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}