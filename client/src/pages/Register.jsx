import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/login');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  return (
      <>
      <h1 className='text-3xl text-center font-semibold mt-6'>Register</h1>
      <div className='max-w-lg mx-auto my-6 border-2 border-slate-800 rounded-md bg-slate-300'>
        <div style={{borderBottom: '2px solid black'}}>
          <img src="https://images.unsplash.com/photo-1628624747186-a941c476b7ef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
        </div>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 p-5 mt-3'>
          <input
            type='text'
            placeholder='username'
            className='border-2 border-neutral-600 p-3 rounded-md my-1'
            id='username'
            required
            onChange={handleChange}
          />
          <input
            type='email'
            placeholder='email'
            className='border-2 border-neutral-600 p-3 rounded-md my-1'
            id='email'
            required
            onChange={handleChange}
          />
          <input
            type='password'
            placeholder='password'
            className='border-2 border-neutral-600 p-3 rounded-md my-1'
            id='password'
            required
            onChange={handleChange}
          />

          <button
            disabled={loading}
            className='bg-green-600 border-2 border-neutral-600 text-white p-3 rounded-md uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Loading...' : 'Register'}
          </button>
        </form>
        <div className='flex gap-2 mx-5 mb-4'>
          <p>Having an account?</p>
          <Link to={'/login'}>
            <span className='text-blue-600'>Login</span>
          </Link>
        </div>
        {error && <p className='text-red-500 mt-5'>{error}</p>}
      </div>
      </>
  );
}