import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import Swal from "sweetalert2";

export default function GetUsers() {

    const { currentUser, loading, error } = useSelector((state) => state.user);
    const [showUsersError, setShowUsersError] = useState(false);
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        const handleShowUsers = async () => {
            try {
              setShowUsersError(false);
              const res = await fetch(`/api/admin/getusers`);
              const data = await res.json();
              if (data.success === false) {
                setShowUsersError(true);
                return;
              }
              console.log(data);
              setAllUsers(data);
            } catch (error) {
                setShowUsersError(true);
            }
        };
        handleShowUsers();
    },[]);

    const handleDeleteUser = async (userId) => {

        const response = await fetch(`/api/user/${userId}`);
        const result = await response.json();
        if (result.isAdmin){
            Swal.fire("Oops!", "Admin cannot be deleted!", "warning");
            return;
        }
        try {
          const res = await fetch(`/api/admin/user/delete/${userId}`, {
            method: 'DELETE',
          });
          const data = await res.json();
          if (data.success === false) {
            console.log(data.message);
            return;
          }
          setAllUsers((prev) =>
            prev.filter((user) => user._id !== userId)
          );
        } catch (error) {
            console.log(error.message);
        }
      };

    return (
        <>
            <h1 className='text-center my-4 text-3xl font-semibold'>All Users...</h1>
            <div className='p-4 max-w-2xl mx-auto border-2 border-slate-600 bg-slate-300 rounded-md mb-4'>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white">
                <table className="w-full text-center rtl:text-right text-slate-600">
                    <thead className="text-sm text-black uppercase">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Username
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Admin
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Delete
                            </th>
                        </tr>
                    </thead>
                    {allUsers && allUsers.length > 0 && (
                    <tbody className='text-md'>
                        {allUsers.map((user) => (
                        <tr key={user._id} className="border-2">
                            <th className="px-6 py-4">
                                {user.username}
                            </th>
                            <td className="px-6 py-4">
                                {user.email}
                            </td>
                            <td className="px-6 py-4">
                                {user.isAdmin ? 'true' : 'false'}
                            </td>
                            <td className="px-6 py-4">
                                <button onClick={()=>handleDeleteUser(user._id)} className="font-medium text-red-600 hover:underline">Delete</button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    )}
                </table>
            </div>
            </div>
        </>
    );
} 