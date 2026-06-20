import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_BASE_URL from "../config";

export default function BookingDetails() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${id}`);
      const data = await res.json();
      setBooking(data);
    })();
  }, [id]);

  if (!booking) return <div className="p-6">Loading booking...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-900 text-white rounded">
      <h1 className="text-2xl font-bold mb-4">Your Ticket</h1>
      <div className="flex gap-4">
        <img src={`https://image.tmdb.org/t/p/w200${booking.movie.poster_path}`} alt={booking.movie.title} className="w-32 rounded" />
        <div>
          <h2 className="text-xl font-semibold">{booking.movie.title}</h2>
          <p>Theater: {booking.theater.name}</p>
          <p>Seats: {booking.seats.map(s => s.seatId).join(", ")}</p>
          <p>Amount: ₹{booking.amount.toFixed(2)}</p>
          <p>Status: <strong>{booking.status}</strong></p>
        </div>
      </div>
    </div>
  );
}
