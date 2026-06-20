import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContent";
import API_BASE_URL from "../config";

export default function MyBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.email) {
      navigate("/register");
      return;
    }
    const fetchBookings = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/my-bookings?email=${encodeURIComponent(user.email)}`
        );
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user, navigate]);

  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-gray-400 hover:text-white text-sm cursor-pointer"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-1">My Bookings</h1>
      <p className="text-gray-400 text-sm mb-8">{user?.email}</p>

      {loading && (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-zinc-900 rounded-xl p-4 flex gap-4 animate-pulse">
              <div className="w-16 h-22 bg-zinc-700 rounded-lg flex-shrink-0" style={{ height: 88 }} />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-zinc-700 rounded w-2/3" />
                <div className="h-3 bg-zinc-700 rounded w-1/2" />
                <div className="h-3 bg-zinc-700 rounded w-1/3" />
                <div className="flex gap-1 mt-2">
                  {[1,2,3].map(j => <div key={j} className="h-5 w-10 bg-zinc-700 rounded-full" />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-900/40 border border-red-700 rounded-xl p-6 text-center">
          <p className="text-red-300 font-semibold">Failed to load bookings</p>
          <p className="text-red-400 text-sm mt-1">{error}</p>
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <span className="text-6xl">🎟️</span>
          <p className="text-xl font-semibold text-gray-300">No bookings yet</p>
          <p className="text-gray-500 text-sm">Your confirmed tickets will appear here</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-pink-600 rounded-xl text-white font-semibold hover:bg-pink-700 transition cursor-pointer"
          >
            Browse Movies
          </button>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="flex flex-col gap-4">
          {bookings.map((booking, idx) => (
            <div
              key={idx}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col sm:flex-row"
            >
              {/* Poster */}
              <div className="sm:w-28 flex-shrink-0">
                {booking.posterPath ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${booking.posterPath}`}
                    alt={booking.movieTitle}
                    className="w-full h-36 sm:h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-36 sm:h-full bg-zinc-800 flex items-center justify-center text-4xl">
                    🎬
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 p-4 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-bold text-lg leading-tight">{booking.movieTitle || "Movie"}</h2>
                    <span className="text-xs bg-green-900/50 text-green-400 border border-green-800 px-2 py-0.5 rounded-full flex-shrink-0">
                      Confirmed
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{booking.theater}</p>
                  <p className="text-gray-400 text-sm">
                    {booking.date} &nbsp;·&nbsp; {booking.time}
                  </p>
                </div>

                {/* Seat chips */}
                <div className="flex flex-wrap gap-1">
                  {(booking.seats || []).map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 bg-pink-900/40 border border-pink-800 text-pink-300 text-xs rounded-full font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                  <span className="text-xs text-gray-500">
                    Booked on {formatDate(booking.bookedAt)}
                  </span>
                  {booking.totalAmount > 0 && (
                    <span className="text-pink-400 font-bold text-sm">
                      ₹{Number(booking.totalAmount).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
