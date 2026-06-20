import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchMovieDetails } from "../servers/tmdb";
import API_BASE_URL from "../config";
import TicketModel from "./TicketModel";

export default function SeatSelect({ initialTicketCount = 1 }) {
  const rows = Array.from({ length: 10 }, (_, i) => String.fromCharCode(65 + i));
  const navigate = useNavigate();
  const { movieId } = useParams();
  const seatsPerRow = 24;
  const location = useLocation();
  const { theater, date, time } = location.state || {};

  const totalSeats = rows.length * seatsPerRow;

  const storageKey = `seatSelection_${movieId}_${theater?.name}_${date}_${time}`;

  const [selectedSeats, setSelectedSeats] = useState(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      return saved ? JSON.parse(saved).seats : [];
    } catch { return []; }
  });
  const [bookedSeats, setBookedSeats] = useState([]);
  const [movie, setMovie] = useState([]);
  const [showTktCount, setShowTktCount] = useState(false);
  const [ticketCount, setTicketCount] = useState(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      return saved ? JSON.parse(saved).count : initialTicketCount;
    } catch { return initialTicketCount; }
  });
  const [tempTicketCount, setTempTicketCount] = useState(initialTicketCount);

  // Persist selection to sessionStorage whenever it changes
  useEffect(() => {
    if (selectedSeats.length > 0) {
      sessionStorage.setItem(storageKey, JSON.stringify({ seats: selectedSeats, count: ticketCount }));
    }
  }, [selectedSeats, ticketCount, storageKey]);

  useEffect(() => {
    const getMovie = async () => {
      try {
        const movieData = await fetchMovieDetails(movieId);
        setMovie(movieData);
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    };
    getMovie();
  }, [movieId]);

  useEffect(() => {
    if (!movieId || !theater?.name || !date || !time) return;
    const fetchBookedSeats = async () => {
      try {
        const params = new URLSearchParams({
          movieId,
          theater: theater.name,
          date,
          time,
        });
        const res = await fetch(`${API_BASE_URL}/api/bookings?${params}`);
        if (!res.ok) return;
        const data = await res.json();
        setBookedSeats(data.bookedSeats || []);
      } catch (err) {
        console.error("Failed to fetch booked seats:", err);
      }
    };
    fetchBookedSeats();
  }, [movieId, theater, date, time]);

  function selectTicketCount() {
    setTempTicketCount(ticketCount);
    setShowTktCount(true);
  }

  const handleTicketModelConfirm = () => {
    setTicketCount(tempTicketCount);
    setShowTktCount(false);
    setSelectedSeats([]); // reset selection on ticket count change
  };

  // Assign seat prices based on row (customize as needed)
  const getSeatPrice = (seatId) => {
    const rowChar = seatId.charAt(0);
    if (rowChar <= "C") return 200;
    if (rowChar <= "F") return 100;
    return 50;
  };

  // Build consecutive runs of available seats in a row
  const getRunsForRow = (row) => {
    const runs = [];
    let current = [];
    for (let col = 1; col <= seatsPerRow; col++) {
      if (!bookedSeats.includes(`${row}${col}`)) {
        current.push(col);
      } else {
        if (current.length) { runs.push([...current]); current = []; }
      }
    }
    if (current.length) runs.push(current);
    return runs;
  };

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId)) return;

    const row = seatId.charAt(0);
    const clickedCol = parseInt(seatId.slice(1));

    // If already selected, deselect just this seat
    if (selectedSeats.find((s) => s.seatId === seatId)) {
      const updated = selectedSeats.filter((s) => s.seatId !== seatId);
      setSelectedSeats(updated);
      if (updated.length === 0) sessionStorage.removeItem(storageKey);
      return;
    }

    // Auto-fill ticketCount consecutive seats from the clicked position
    const runs = getRunsForRow(row);
    const clickedRun = runs.find((r) => r.includes(clickedCol));
    if (!clickedRun) return;

    const idxInRun = clickedRun.indexOf(clickedCol);
    // Shift start left only as much as needed so we get ticketCount seats
    const maxStart = Math.max(0, clickedRun.length - ticketCount);
    const startIdx = Math.min(idxInRun, maxStart);
    const picked = clickedRun.slice(startIdx, startIdx + ticketCount);

    setSelectedSeats(
      picked.map((col) => ({ seatId: `${row}${col}`, price: getSeatPrice(`${row}${col}`) }))
    );
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? `${hrs}h ` : ""}${mins}m`;
  };

  const languageMap = {
    en: "English",
    hi: "Hindi",
    te: "Telugu",
    ta: "Tamil",
    ml: "Malayalam",
    kn: "Kannada",
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const seatLabels = selectedSeats.map((s) => s.seatId).join(", ");

  const handleConfirm = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }
  const showDateTime = `${date} | ${time}`;
    navigate("/payment", {
      state: {
        movie,
        theater,
        seats: selectedSeats,
        showDateTime,
        storageKey,
      },
    });
  };

  return (
    <div className="p-6">
      {/* Movie Info */}
      <div className="flex flex-row justify-start items-center gap-2 mb-6 flex-wrap">
        <h1 className="flex flex-row text-gray-200 items-center text-3xl font-bold mb-2">
          {movie.title}
          <span className="pl-2 text-2xl font-semibold text-gray-200">
            - ({languageMap[movie.original_language] || movie.original_language})
          </span>
        </h1>
        <span className="flex flex-row justify-center items-center rounded-full text-gray-200 border px-3 py-1 text-sm font-semibold">
          Runtime: {formatRuntime(movie?.runtime)}
        </span>
        <span className="rounded-full text-gray-200 border px-3 py-1 text-sm font-semibold">
          ⭐ {movie?.vote_average ? movie.vote_average.toFixed(1) : "N/A"} / 10
        </span>
        {movie?.genres?.map((g) => (
          <span key={g.id} className="text-gray-200 rounded-full py-1 text-sm font-semibold">
            {g.name} |
          </span>
        ))}
      </div>
      <div className=" flex flex-row ml-3 text-gray-200">
        <button onClick={() => navigate(-1)} className="mb-2 text-gray-200 hover:text-blue-400 hover:underline font-semibold cursor-pointer">← Back to DateChange</button>
      </div>

      {/* Ticket Count Selector */}
      <div className="flex flex-row justify-end items-center text-center font-bold border-yellow-400">
        <p onClick={selectTicketCount} className="w-[120px] text-yellow-400 p-3 cursor-pointer">
          Ticket/{ticketCount}
        </p>
      </div>

      {/* Seat Map */}
      <div className="flex flex-col gap-2 overflow-auto max-h-[540px]">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex flex-col items-center">
            {/* Section labels */}
            {row === "A" && (
              <div className="text-gray-400 font-semibold text-[8px] mb-1">
                Premium ₹200
              </div>
            )}
            {row === "D" && (
              <div className="text-gray-400 font-semibold text-[8px] mb-1">
                Platinum ₹100
              </div>
            )}
            {row === "G" && (
              <div className="text-gray-400 font-semibold text-[8px] mb-1">
                Normal ₹50
              </div>
            )}

            {/* Row with seats */}
            <div className="flex items-center justify-center gap-2 relative">
              <div className="w-8 text-sm font-bold text-gray-700 flex-shrink-0 mr-2 flex items-center justify-center">
                {row}
              </div>

              {[...Array(seatsPerRow)].map((_, i) => {
                const seatId = `${row}${i + 1}`;
                const isBooked = bookedSeats.includes(seatId);
                const isSelected = selectedSeats.find((s) => s.seatId === seatId);

                return (
                  <div
                    key={seatId}
                    onClick={() => !isBooked && handleSeatClick(seatId)}
                    className={`w-8 h-8 flex flex-col items-center justify-center rounded border shadow-md select-none transition
                      ${
                        isBooked
                          ? "bg-gray-600 border-gray-600 text-gray-500 cursor-not-allowed opacity-60"
                          : isSelected
                          ? "bg-green-500 border-green-400 text-black cursor-pointer"
                          : "border-green-500 text-white hover:bg-green-700 cursor-pointer"
                      }`}
                    title={`${seatId} - Rs.${getSeatPrice(seatId)}`}
                  >
                    <span className="text-xs font-medium">{i + 1}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── SCREEN ── */}
      <div className="flex flex-col items-center pt-6 pb-2 select-none">
        {/* Labels */}
        <p className="text-gray-600 text-[9px] tracking-widest uppercase mb-0.5">
          all eyes this way please!
        </p>
        <p className="mb-3 text-gray-400 text-[10px] tracking-[0.4em] uppercase font-medium">
          screen
        </p>

        {/* Wide perspective trapezoid — wider at bottom (screen is below the audience) */}
        <div className="relative w-full flex justify-center" style={{ maxWidth: 900 }}>
          {/* Ambient glow above the screen bar */}
          <div
            style={{
              position: "absolute",
              top: -18,
              left: "50%",
              transform: "translateX(-50%)",
              width: "70%",
              height: 40,
              background:
                "radial-gradient(ellipse at center, rgba(186,230,253,0.55) 0%, transparent 50%)",
              filter: "blur(0px)",
              zIndex: 0,
              pointerEvents: "none",
            }}
          />
          {/* Screen bar — narrower at top, wider at bottom */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              width: "88%",
              height: 12,
              background:
                "linear-gradient(0deg, #f0f9ff 0%, #bae6fd 40%, #7dd3fc 100%)",
              clipPath: "polygon(4% 0%, 96% 0%, 98% 100%, 2% 100%)",
              boxShadow:
                "0 0 24px 6px rgba(125,211,252,0.6), 0 0 8px 2px rgba(186,230,253,0.5)",
              borderRadius: 1,
            }}
          />
        </div>
      </div>

{/* Bottom fixed container - only visible if seats selected */}

  <div className="fixed bottom-0 left-0 right-0 flex flex-col items-center space-y-4 z-50 bg-black bg-opacity-70 py-3">
    {/* Legend */}
    <div className="flex gap-6 text-white rounded-lg px-6 flex-wrap justify-center">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-green-500 rounded"></div>
        <span>Available <span className="text-green-400 font-bold">({totalSeats - bookedSeats.length - selectedSeats.length})</span></span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-green-500 rounded"></div>
        <span>Selected <span className="text-green-400 font-bold">({selectedSeats.length})</span></span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-500 rounded"></div>
        <span>Booked <span className="text-gray-400 font-bold">({bookedSeats.length})</span></span>
      </div>
    </div>

    {/* Confirm Button */}
    {selectedSeats.length > 0 && (
    <button
      onClick={handleConfirm}
      className="bg-[#bf3b42] text-white px-8 py-3 rounded cursor-pointer shadow-lg"
      title={`Seats: ${seatLabels} | Total: Rs.${totalPrice}`}
    >
      Pay ₹ {totalPrice}
    </button>
    )}
  </div>



      {/* Ticket Modal Overlay */}
      {showTktCount && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] h-[300px] relative">
            <TicketModel
              maxTickets={6}
              initialSelected={tempTicketCount}
              onSelect={(num) => setTempTicketCount(num)}
              onConfirm={handleTicketModelConfirm}
            />
            <button
              onClick={() => setShowTktCount(false)}
              className="absolute top-2 right-2 text-gray-700 font-bold hover:text-gray-900"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
