import { useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateHotel() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    currentBooking: [],
    name: '',
    description: '',
    address: '',
    discountPrice: 0,
    rating: 1,
    offer: false,
    parking: false,
    furnished: false,
    cctv: false,
    wifi: false,
  });
  
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // console.log(formData);
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/room`);
        const data = await res.json();
        if (data.success === false) {
            setError(true);
            setLoading(false);
            return;
        }
        setAllRooms(data);
        // console.log(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchRooms();
  },[]);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per hotel');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleSelect = (event) => {
    const value = Array.from(event.target.selectedOptions).map(option => option.value);
    setSelectedRooms(value);
    // console.log(value);
  };
  // console.log(selectedRooms);

  const handleChange = (e) => {

    if (
      e.target.id === 'offer' ||
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'cctv' ||
      e.target.id === 'wifi'
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
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/hotel/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
          rooms: selectedRooms,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/hotel/${data._id}/${undefined}/${undefined}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
      <>
      <h1 className='text-3xl font-semibold text-center mt-6'>
          Create a Hotel
      </h1>
      <main className='p-5 max-w-4xl mx-auto border-2 border-slate-800 my-6 rounded-md bg-slate-300'>
        
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
          <div className='flex flex-col gap-4 flex-1'>
            <input
              type='text'
              placeholder='Name'
              className='border-2 border-neutral-600 p-3 rounded-md'
              id='name'
              maxLength='60'
              minLength='5'
              required
              onChange={handleChange}
              value={formData.name}
            />
            <input
              type='text'
              placeholder='Address'
              className='border-2 border-neutral-600 p-3 rounded-md'
              id='address'
              required
              onChange={handleChange}
              value={formData.address}
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
            <div className='flex flex-wrap gap-6'>
              <div className='flex gap-2'>
                <input
                  type='checkbox'
                  id='cctv'
                  className='w-5'
                  onChange={handleChange}
                  checked={formData.cctv}
                />
                <span>CCTV</span>
              </div>
              <div className='flex gap-2'>
                <input
                  type='checkbox'
                  id='wifi'
                  className='w-5'
                  onChange={handleChange}
                  checked={formData.wifi}
                />
                <span>WIFI</span>
              </div>
              <div className='flex gap-2'>
                <input
                  type='checkbox'
                  id='parking'
                  className='w-5'
                  onChange={handleChange}
                  checked={formData.parking}
                />
                <span>Parking Spot</span>
              </div>
              <div className='flex gap-2'>
                <input
                  type='checkbox'
                  id='furnished'
                  className='w-5'
                  onChange={handleChange}
                  checked={formData.furnished}
                />
                <span>Furnished</span>
              </div>
              <div className='flex gap-2'>
                <input
                  type='checkbox'
                  id='offer'
                  className='w-5'
                  onChange={handleChange}
                  checked={formData.offer}
                />
                <span>Offer</span>
              </div>
            </div>
            <div className='flex flex-wrap gap-6'>
              <div className='flex items-center gap-2'>
                  <input
                    type='number'
                    id='rating'
                    min='1'
                    max='5'
                    required
                    className='p-2 border border-gray-600 rounded-3xl'
                    onChange={handleChange}
                    value={formData.rating}
                  />
                  <div className='flex flex-col items-center mb-2'>
                    <p>Rating</p>
                      <span className='text-xs'>(1-5) </span>
                  </div>
              </div>
              {formData.offer && (
                <div className='flex items-center gap-2'>
                  <input
                    type='number'
                    id='discountPrice'
                    min='0'
                    max='1000'
                    required
                    className='p-3 border border-gray-600 rounded-lg'
                    onChange={handleChange}
                    value={formData.discountPrice}
                  />
                  <div className='flex flex-col items-center mb-2'>
                    <p>Discounted price</p>
                    <span className='text-xs'>(₹ / room) </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='flex flex-col flex-1 gap-4'>
            <div className='flex flex-col gap-2'>
                <p className=''>Select the Rooms</p>
                <select
                    className='border-2 border-neutral-600 p-3 rounded-md'
                    id='selectedRooms'
                    multiple
                    onChange={handleSelect}
                >
                    {loading
                        ? "loading"
                        : allRooms &&
                        allRooms.map((room) => (
                        <option key={room._id} value={room._id}>{room.title}</option>
                    ))}
                </select>
            </div>
            <p className='font-semibold'>
              Images:
              <span className='font-normal text-gray-700 ml-2'>
                The first image will be the cover (max 6)
              </span>
            </p>
            <div className='flex gap-4'>
              <input
                onChange={(e) => setFiles(e.target.files)}
                className='p-3 border-2 border-neutral-600 bg-white rounded-md w-full'
                type='file'
                id='images'
                accept='image/*'
                multiple
              />
              <button
                type='button'
                disabled={uploading}
                onClick={handleImageSubmit}
                className='p-3 text-green-700 border border-green-700 rounded-md bg-white uppercase hover:shadow-lg disabled:opacity-80'
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            <p className='text-red-700 text-sm'>
              {imageUploadError && imageUploadError}
            </p>
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div
                  key={url}
                  className='flex justify-between p-3 border-2 border-neutral-600 bg-white rounded-md items-center'
                >
                  <img
                    src={url}
                    alt='hotel image'
                    className='w-20 h-20 object-contain'
                  />
                  <button
                    type='button'
                    onClick={() => handleRemoveImage(index)}
                    className='p-3 text-red-600 rounded-lg uppercase hover:opacity-75'
                  >
                    Delete
                  </button>
                </div>
              ))}
            <button
              disabled={loading || uploading}
              className='p-3 bg-green-700 text-white rounded-md uppercase hover:opacity-95 disabled:opacity-80'
            >
              {loading ? 'Creating...' : 'Create Hotel'}
            </button>
            {error && <p className='text-red-700 text-sm'>{error}</p>}
          </div>
        </form>
      </main>
      </>
  );
}