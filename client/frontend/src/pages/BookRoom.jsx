import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useUserContext } from "../context/context";

export default function BookRoom() {
  const {
    roomBooking,
    bookedRooms,
    emp,
    showRoom,
    fetchEmployees,
    fetcRooms,
    fetchBookedRoom,
    fetchMyBookings,
    user,
  } = useUserContext();

  const start = new Date();
  start.setMinutes(start.getMinutes() + 1);

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [startTime, setStartTime] = useState(start);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    fetchEmployees(); // employees
    fetcRooms(); // rooms
    fetchBookedRoom(); // all booked rooms
    if (user?.id) fetchMyBookings(user.id); // fetch my bookings if logged in
  }, [user]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedEmployee || !selectedRoom || !startTime || !endTime) {
      setStatus("Please fill all fields");
      return;
    }

    try {
      await roomBooking({
        room_id: selectedRoom,
        employee_id: selectedEmployee,
        start_time: startTime,
        end_time: endTime,
      });

      fetchBookedRoom(); // refresh all bookings
      if (user?.id) fetchMyBookings(user.id); // refresh my bookings
    } catch (err) {

    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-12 px-4">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-3xl p-8 border border-gray-200">
        <h1 className="text-3xl font-semibold mb-6 text-gray-900">
          📅 Book a Room
        </h1>

        <form onSubmit={handleBooking} className="space-y-5">
          {/* Employee Dropdown */}
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-xl bg-gray-50 text-gray-800"
          >
            <option value="">Select Employee</option>
            {emp.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>

          {/* Room Dropdown */}
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-xl bg-gray-50 text-gray-800"
          >
            <option value="">Select Room</option>
            {showRoom.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>

          {/* Date Pickers */}
          <div className="flex gap-4">
            <DatePicker
              selected={startTime}
              onChange={(date) => setStartTime(date)}
              showTimeSelect
              dateFormat="Pp"
              placeholderText="Start Time"
              className="w-full border border-gray-300 p-3 rounded-xl"
            />
            <DatePicker
              selected={endTime}
              onChange={(date) => setEndTime(date)}
              showTimeSelect
              dateFormat="Pp"
              placeholderText="End Time"
              className="w-full border border-gray-300 p-3 rounded-xl"
            />
          </div>

          {/* Book Button */}
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-900 transition-all"
          >
            Book Room
          </button>

          
        </form>

        {/* All Booked Rooms */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            🗓 All Booked Rooms
          </h2>
          {bookedRooms.length > 0 ? (
            bookedRooms.map((room) => (
              <div
                key={room.room_id}
                className="mb-6 p-4 border border-gray-200 rounded-xl bg-gray-50"
              >
                <h3 className="font-semibold text-lg">{room.room_name}</h3>
                {room.bookings.length > 0 ? (
                  <ul className="mt-2 space-y-1">
                    {room.bookings.map((slot) => (
                      <li
                        key={slot.booking_id}
                        className="text-sm text-gray-700"
                      >
                        {slot.booked_by} —{" "}
                        {new Date(slot.start_time).toLocaleString()} to{" "}
                        {new Date(slot.end_time).toLocaleString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No bookings for this room
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No booked rooms found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
