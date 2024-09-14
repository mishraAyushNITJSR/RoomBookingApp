import React from 'react'
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

export default function Home() {

  const { currentUser } = useSelector((state) => state.user);

  return (
    <>
    <div className='bg-slate-800'>
      <header className='text-white shadow-xl p-3'>
        <div className='flex justify-between items-center max-w-6xl mx-auto'>
          <Link to='#'>
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
              <span className='text-slate-200'>Haven</span>
              <span className='text-slate-400'>Hike</span>
            </h1>
          </Link>
          <ul className='flex gap-4 mt-1'>
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
                  className='rounded-full h-7 w-7 object-cover border-solid border-2 border-black'
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
      <div className='flex text-center items-center h-screen text-white' style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className='mx-auto'>
            <h1 className='text-4xl font-semibold mb-4'>HavenHike</h1>
            <p className="text-xl mb-8 "> Welcome to HavenHike! <br /> Jump right in and explore our hotels for rent.</p>
            <Link to={"/hotels"} className="bg-teal-300 p-3 text-lg text-black font-bold rounded-lg border-2 border-slate-700">View Hotels</Link>
        </div>
      </div>
      <div className="flex justify-center text-slate-300 p-4">
          <p>© 2024 HavenHike™</p>
      </div>
    </div>
    </>
  )
}
