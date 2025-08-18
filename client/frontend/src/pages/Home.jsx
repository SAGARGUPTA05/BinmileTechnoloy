import React, { useEffect, useState } from "react";
import { useUserContext } from "../context/context";
import { useNavigate } from "react-router-dom";
import img from '../assets/download.jpg'
function Home() {
  const { user,setUser,addUser,fetcRooms } = useUserContext();


   const navigate=useNavigate()
   useEffect(() => {
    if (user?.name) {
      fetcRooms();
    }
  }, [user, fetcRooms]);


  const [formData, setFormData] = useState({
    name: "",
    position: "",
    join_date: "",
  });
  
  const handleBooking=()=>{
      navigate("/book-room")
  }
  const handleRegister = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.position) return;
    setUser({
      name: formData.name,
      position: formData.position,
      join_date: formData.join_date,
    });
    addUser(formData);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 text-gray-900 flex flex-col items-center py-10 font-sans">
      {user?.name ? (
        <>
          {/* User Info */}
          <div className="bg-white shadow-lg rounded-2xl p-6 w-96 text-center border border-gray-200">
            <h1 className="text-2xl font-semibold mb-2">
              Hello, {user.name} 
            </h1>
            <p className="text-gray-600">Position: {user.position}</p>
              
          </div>

          {/* showRoomSection */}
          <h2 className="text-2xl font-semibold mt-10 mb-4">Book Room</h2>
           <div className="rounded-lg p-4 shadow-lg bg-white w-96">
      {/* Room Image */}
      <img
        src={ img}
        alt={'room'}
        className="w-full h-40 object-cover rounded-md mb-3"
      />
      
      {/* Book Button */}
      <button
        onClick={() => handleBooking()}
        className="w-full bg-black hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md transition"
      >
        Book Now
      </button>
    </div>
          
        </>
      ) : (
        // Registration Form
        <div className="bg-white p-8 rounded-2xl shadow-lg w-96 border border-gray-200">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Register to Continue
          </h1>
          <form className="flex flex-col space-y-4" onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Your Name"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Your Position"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
            />
            <input
              type="date"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={formData.join_date}
              onChange={(e) =>
                setFormData({ ...formData, join_date: e.target.value })
              }
            />

            <button
              type="submit"
              className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-all"
            >
              Register
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Home;
