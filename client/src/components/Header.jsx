import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
      <>
      <header className='bg-slate-700 text-white shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
          <Link to='/hotels'>
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
              <span className='text-slate-200'>Haven</span>
              <span className='text-slate-400'>Hike</span>
            </h1>
          </Link>
          <form
            onSubmit={handleSubmit}
            className='bg-white p-3 rounded-lg flex items-center'
          >
            <input
              type='text'
              placeholder='Search...'
              className='bg-transparent focus:outline-none flex justify-center w-24 sm:w-64 h-4 text-black'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button>
              <FaSearch className='text-slate-600' />
            </button>
          </form>
          <ul className='flex gap-4'>
            <Link to='/'>
              <li className='text-slate-200 hidden sm:inline hover:underline'>
                Home
              </li>
            </Link>
            <Link to='/hotels'>
              <li className='text-slate-200 hidden sm:inline hover:underline'>
                Hotels
              </li>
            </Link>
            <Link to='/about'>
              <li className='text-slate-200 hidden sm:inline hover:underline'>
                About
              </li>
            </Link>
            <Link to='/profile'>
              {currentUser ? (
                <img
                  className='rounded-full h-7 w-7 object-cover border-solid border-2 border-slate-800'
                  src={currentUser.avatar}
                  alt='profile'
                />
              ) : (
                <li className='text-slate-200 hover:underline'>Login</li>
              )}
            </Link>
          </ul>
        </div>
      </header>
      </>
  );
}