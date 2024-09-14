import { useState , useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateRoom() {

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 2000,
    maxPeople: 1,
    bedrooms: 1,
    bathrooms: 1,
    ac: false,
    tv: false,
  });

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      const roomId = params.roomId;
      const res = await fetch(`/api/room/${roomId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };
    fetchRoom();
  }, []);

  const handleChange = (e) => {
      if (
        e.target.id === 'ac' ||
        e.target.id === 'tv'
      ) {
        setFormData({
          ...formData,
          [e.target.id]: e.target.checked,
        });
      }

      if (
        e.target.type === 'number' ||
        e.target.type === 'text' ||
        e.target.type === 'textarea'
      ) {
        setFormData({
          ...formData,
          [e.target.id]: e.target.value,
        });
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      setLoading(true);
      setError(false);

      const res = await fetch(`/api/room/update/${params.roomId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData
        }),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      console.log(data);
      navigate(`/hotels`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
      <>
      <h1 className='text-3xl font-semibold text-center mt-6'>
          Update a Room
      </h1>
      <main className='p-5 max-w-4xl mx-auto border-2 border-slate-800 my-6 rounded-md bg-slate-300'>
        
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
          <div className='flex flex-col gap-4 flex-1'>
                <div className='flex flex-col gap-2 flex-1'>
                        <input
                            type='text'
                            placeholder='Title'
                            className='border-2 border-neutral-600 p-3 rounded-md'
                            id='title'
                            maxLength='60'
                            minLength='5'
                            required
                            onChange={handleChange}
                            value={formData.title}
                        />

                        <textarea
                            type='text'
                            placeholder='Description'
                            className='border-2 border-neutral-600 p-3 rounded-md'
                            id='description'
                            required
                            onChange={handleChange}
                            value={formData.description}
                        />
                </div>

                <div className='flex flex-wrap gap-6'>
                    <div className='flex gap-2'>
                        <input
                          type='checkbox'
                          id='ac'
                          className='w-5'
                          onChange={handleChange}
                          checked={formData.ac}
                        />
                        <span>Air Condition</span>
                    </div>
                    <div className='flex gap-2'>
                        <input
                          type='checkbox'
                          id='tv'
                          className='w-5'
                          onChange={handleChange}
                          checked={formData.tv}
                        />
                        <span>Television</span>
                    </div>
                </div>

                <div className='flex flex-wrap gap-4'>
                    <div className='flex items-center gap-2'>
                        <input
                            type='number'
                            id='bedrooms'
                            min='1'
                            max='4'
                            required
                            className='p-2 border border-gray-600 rounded-lg'
                            onChange={handleChange}
                            value={formData.bedrooms}
                        />
                        <p className=''>Beds</p>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input
                            type='number'
                            id='bathrooms'
                            min='1'
                            max='2'
                            required
                            className='p-2 border border-gray-600 rounded-lg'
                            onChange={handleChange}
                            value={formData.bathrooms}
                        />
                        <p className=''>Baths</p>
                    </div>
                </div>
          </div>

          <div className='flex flex-col flex-1 gap-4'>
            <div className='flex flex-wrap gap-4'>
              <div className='flex items-center gap-2'>
                  <input
                      type='number'
                      id='price'
                      min='2000'
                      max='10000'
                      required
                      className='p-2 border border-gray-600 rounded-lg'
                      onChange={handleChange}
                      value={formData.price}
                  />
                  <div className='flex flex-col items-center'>
                      <p className=''>Price</p>
                      <span className='text-xs'>(₹ / day)</span>
                  </div>
              </div>

              <div className='flex items-center gap-2'>
                  <input
                      type='number'
                      id='maxPeople'
                      min='1'
                      max='4'
                      required
                      className='p-2 border border-gray-600 rounded-lg'
                      onChange={handleChange}
                      value={formData.maxPeople}
                  />
                  <p className=''>Max_People</p>
              </div>
            </div>
            <button
              disabled={loading}
              className='p-3 bg-green-700 text-white rounded-md uppercase hover:opacity-95 disabled:opacity-80'
            >
              {loading ? 'Creating...' : 'Create Room'}
            </button>
            {error && <p className='text-red-700 text-sm'>{error}</p>}
          </div>
        </form>
      </main>
      </>
  );
}