import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useUserContext } from "../context/context";

export default function MyBookings() {
  const { user, empRooms, fetchMyBookings, updateBooking, deleteBooking } =
    useUserContext();

  const [editedBookings, setEditedBookings] = useState({});

  useEffect(() => {
    if (user?.id) {
      fetchMyBookings(user.id);
    }
  }, [user,empRooms]);

  const handleDateChange = (bookingId, field, value) => {
    setEditedBookings((prev) => ({
      ...prev,
      [bookingId]: {
        ...prev[bookingId],
        [field]: value,
      },
    }));
  };

  const handleUpdate = (roomId, bookingId) => {
    const { start_time, end_time } = editedBookings[bookingId] || {};
    if (start_time && end_time) {
      updateBooking(roomId, bookingId, start_time, end_time);
    }
  };

  const handleDelete = (bookingId) => {
    deleteBooking(bookingId);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">My Bookings</h1>

      {!empRooms || empRooms.length === 0 ? (
        <p className="text-gray-500">No bookings yet.</p>
      ) : (
        <div className="space-y-6">
          {empRooms.map((room) => (
            <div
              key={room.room_id}
              className="border bg-white border-gray-300 p-4 rounded-lg"
            >
              <h2 className="font-semibold text-lg mb-3">{room.room_name}</h2>

              {room.bookings.map((b) => {
                const edited = editedBookings[b.booking_id] || {
                  start_time: new Date(
                    Math.max(
                      new Date(b.start_time).getTime(),
                      Date.now() + 60 * 1000
                    )
                  ), // 1 min ahead of now
                  end_time: new Date(b.end_time),
                };

                return (
                  <div
                    key={b.booking_id}
                    className="border border-gray-200 p-3 rounded-lg flex justify-between items-center mb-3"
                  >
                    <div>
                      <p className="text-sm text-gray-700">
                        {new Date(b.start_time).toLocaleString()} –{" "}
                        {new Date(b.end_time).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <DatePicker
                        selected={edited.start_time}
                        onChange={(date) =>
                          handleDateChange(b.booking_id, "start_time", date)
                        }
                        showTimeSelect
                        dateFormat="Pp"
                        className="border border-gray-300 p-2 rounded-lg"
                        minDate={new Date()}
                        minTime={new Date(new Date().setSeconds(0, 0))}
                        maxTime={new Date(new Date().setHours(23, 59, 59, 999))}
                      />
                      <DatePicker
                        selected={edited.end_time}
                        onChange={(date) =>
                          handleDateChange(b.booking_id, "end_time", date)
                        }
                        showTimeSelect
                        dateFormat="Pp"
                        className="border border-gray-300 p-2 rounded-lg"
                      />

                      <button
                        onClick={() => handleUpdate(room.room_id, b.booking_id)}
                        className="bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-900"
                      >
                        Update
                      </button>

                      <button
                        onClick={() => handleDelete(b.booking_id)}
                        className="bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-900"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
