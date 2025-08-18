import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const backend = "http://localhost:3000";
const UserContext = createContext();

export function UserContextProvider({ children }) {
  const [user, setUser] = useState({ id: "", name: "", position: "" });
  const [bookedRooms, setBookedRooms] = useState([]);
  const [showRoom, setShowRoom] = useState([]);
  const [emp, setEmp] = useState([]);
  const [empRooms, setEmpRooms] = useState([]);
  useEffect(() => {
    const newUser = JSON.parse(localStorage.getItem("user"));
    setUser(newUser);
  }, []);
  // Add User
  const addUser = async (data) => {
    try {
      const res = await axios.post(`${backend}/employees`, data);
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Registered ");

    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

// Book a room
const roomBooking = async (data) => {
  try {
    const res = await axios.post(`${backend}/bookings`, data);

    // Add only the newBooking object to state
    setEmp((prev) => [...prev, res.data.newBooking]);

    toast.success(res.data.message || "Booking successful");
  } catch (err) {
   
    const errorMsg =
      err.response?.data?.message || "Failed to book the room. Try again.";
    toast.error(errorMsg);
  }
};


  //  Update booking
  const updateBooking = async (room_id, booking_id, start_time, end_time) => {
    try {
      const res = await axios.put(`${backend}/bookings`, {
        booking_id,
        room_id,
        start_time: new Date(start_time).toISOString(),
        end_time: new Date(end_time).toISOString(),
      });

      if (res.status === 200) {
        setEmpRooms((prev) =>
          prev.map((room) =>
            room.room_id === room_id
              ? {
                  ...room,
                  bookings: room.bookings.map((b) =>
                    b.booking_id === booking_id
                      ? { ...b, start_time, end_time }
                      : b
                  ),
                }
              : room
          )
        );
      }
      toast.success("updated successfully")
    } catch (err) {
       const errorMsg =
      err.response?.data?.message || "Failed to book the room. Try again.";
    toast.error(errorMsg);
    }
  };

  //  Delete booking
  const deleteBooking = async (booking_id) => {
    try {
      const res = await axios.delete(`${backend}/bookings`, {
        data: { booking_id },
      });

      if (res.status === 200) {
        setEmpRooms((prev) =>
          prev.map((room) => ({
            ...room,
            bookings: room.bookings.filter((b) => b.booking_id !== booking_id),
          }))
        );
      }
      toast.success('Deleted successfully ')
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  // Fetch Rooms
  const fetcRooms = async () => {
    try {
      const res = await axios.get(`${backend}/get-room`);
      setShowRoom(res.data.rooms);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  //  Fetch Employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${backend}/get-employee`);
      setEmp(res.data.rooms); // ⚠️ confirm API response key
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  //  Fetch all booked rooms
  const fetchBookedRoom = async () => {
    try {
      const res = await axios.get(`${backend}/bookings/rooms`);
      setBookedRooms(res.data || []);
    } catch (err) {
      console.error("Error fetching booked rooms:", err.message);
      setBookedRooms([]);
    }
  };

  //  Fetch my bookings
  const fetchMyBookings = async (employeeId) => {
    try {
      const res = await axios.get(`${backend}/bookings/rooms/${employeeId}`);
      setEmpRooms(res.data);
      return res.data;
    } catch (err) {
      console.error("Error fetching my bookings:", err);
      setEmpRooms([]);
      return [];
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        bookedRooms,
        setBookedRooms,
        addUser,
        roomBooking,
        updateBooking,
        deleteBooking,
        showRoom,
        fetchBookedRoom,
        fetchEmployees,
        fetcRooms,
        emp,
        fetchMyBookings,
        empRooms,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
}
