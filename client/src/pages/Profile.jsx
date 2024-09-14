import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    if(currentUser.isAdmin){
      Swal.fire("Oops!", "Admin cannot be deleted!", "warning");
      return;
    }
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`/api/auth/logout`);
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  return (
      <>
      {currentUser.isAdmin ? (
        <h1 className='text-3xl font-semibold text-center mt-6'>Admin Profile</h1>
      ) : (
        <h1 className='text-3xl font-semibold text-center mt-6'>User Profile</h1>
      )}
      <div className='p-4 max-w-lg mx-auto border-2 border-slate-800 rounded-md my-6 bg-slate-300'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type='file'
            ref={fileRef}
            hidden
            accept='image/*'
          />
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt='profile'
            className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-4 border-solid border-2 border-black'
          />
          <p className='text-sm self-center'>
            {fileUploadError ? (
              <span className='text-red-700'>
                Error Image upload (image must be less than 2 mb)
              </span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className='text-green-700'>Image successfully uploaded!</span>
            ) : (
              ''
            )}
          </p>
          <input
            type='text'
            placeholder='username'
            defaultValue={currentUser.username}
            id='username'
            className='border-2 border-neutral-600 p-3 rounded-md'
            onChange={handleChange}
          />
          <input
            type='email'
            placeholder='email'
            id='email'
            defaultValue={currentUser.email}
            className='border-2 border-neutral-600 p-3 rounded-md'
            onChange={handleChange}
          />
          <input
            type='password'
            placeholder='password'
            onChange={handleChange}
            id='password'
            className='border-2 border-neutral-600 p-3 rounded-md'
          />
          <div className='flex justify-between'>
            <span
              onClick={handleDeleteUser}
              className='bg-red-600 text-white text-lg rounded-md w-36 h-10 text-center p-1 cursor-pointer hover:opacity-95 disabled:opacity-80'
            >
              Delete Account
            </span>
            <span onClick={handleSignOut} className='bg-sky-600 text-white text-lg rounded-md w-20 h-10 text-center p-1 cursor-pointer hover:opacity-95 disabled:opacity-80'
            >
              Logout
            </span>
          </div>
          <button
            disabled={loading}
            className='bg-green-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Loading...' : 'Update Profile'}
          </button>

          <div className='flex flex-col font-semibold'>
            <p className='text-green-700 text-lg '>
              {updateSuccess ? 'User is Updated Successfully!' : ''}
            </p>
            <p className='text-red-700 text-lg'>{error ? error : ''}</p>
          </div>

          {currentUser && !currentUser.isAdmin && (
            <Link
              className='bg-fuchsia-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
              to={`/bookings/${currentUser._id}`}
            >
              My Bookings
            </Link>
          )}
          
          {currentUser && currentUser.isAdmin && (
            <Link
              className='bg-blue-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
              to={'/create-hotel'}
            >
              Create Hotel
            </Link>
          )}
          
          {currentUser && currentUser.isAdmin && (
            <Link
              className='bg-purple-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
              to={'/create-room'}
            >
              Create Room
            </Link>
          )}
          {currentUser && currentUser.isAdmin && (
            <Link
              className='bg-sky-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
              to={'/get-users'}
            >
              Get All Users
            </Link>
          )}
          {currentUser && currentUser.isAdmin && (
            <Link
              className='bg-fuchsia-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
              to={'/get-hotels'}
            >
              Get All Hotels
            </Link>
          )}
          {currentUser && currentUser.isAdmin && (
            <Link
              className='bg-violet-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
              to={'/get-rooms'}
            >
              Get All Rooms
            </Link>
          )}
        </form>
      </div>
      </>
  );
}
