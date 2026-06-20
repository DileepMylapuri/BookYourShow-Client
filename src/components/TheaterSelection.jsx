import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMovieDetails } from "../servers/tmdb";
import { ImageData } from "../assets/assets";

export default function TheaterSelection() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState({});
  const [selectedTheater, setSelectedTheater] = useState("Radhakrishna Theater, Penumuru");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Fetch movie details
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

    const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? `${hrs}h ` : ""}${mins}m`;
  };

  // Theater with fixed showtimes
  const theater = {
    name: "Radhakrishna Theater, Penumuru",
    showtimes: ["10:30 AM", "02:30 PM", "06:30 PM", "09:30 PM"],
    cancellable: true
  };

 const getWeekDates = () => {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const today = new Date();
    const week = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);

      const dayName = days[date.getDay()];
      const dayNum = date.getDate();
      const monthName = date.toLocaleString("default", { month: "short" }).toUpperCase();

      week.push({
        day: dayName,
        date: date.toISOString().slice(0, 10), 
        display: `${dayNum} ${monthName}`,
      });
    }

    return week;
  };

  const dates = getWeekDates();


  const languageMap = {
    hi: "Hindi", te: "Telugu", ta: "Tamil", ml: "Malayalam",
    kn: "Kannada", bn: "Bengali", mr: "Marathi", gu: "Gujarati",
    pa: "Punjabi", en: "English",
  };

  const timeToMinutes = (t) => {
    let [time, modifier] = t.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  // Filter showtimes if selected date is today (only show future times)
  const today = new Date().toISOString().slice(0, 10);
  const isTodaySelected = selectedDate === today;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const availableShowtimes = isTodaySelected
    ? theater.showtimes.filter((t) => timeToMinutes(t) >= currentMinutes)
    : theater.showtimes;

  // If no date selected, default to today
  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(today);
    }
  }, [today, selectedDate]);


  const handleNext = () => {
    if (selectedTheater && selectedDate && selectedTime) {
      navigate(`/seat-select/${movieId}`, {
        state: { 
          theater: {name: selectedTheater}, 
          date: selectedDate, 
          time: selectedTime,
          movie: movie,
          movieId: movieId, 
          languageMap: languageMap,
        },
      });
    } else {
      alert("Please select theater, date, and time");
    }
  };

  return (
  <>
    <div style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`
        }}
      className="bg-black text-gray-300 min-h-screen p-6">
      {/* Movie Header */}
      <h1 className="flex flex-row items-center text-3xl font-bold mb-2">
        {movie.title}
        <span className="pl-2 text-2xl font-semibold text-gray-300">
          - ({languageMap[movie.original_language] || movie.original_language})
        </span>
      </h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        <span className="rounded-full border px-3 py-1 text-sm font-semibold">
         Runtime: {formatRuntime(movie?.runtime)}
        </span>
        <span className="rounded-full border px-3 py-1 text-sm font-semibold">
          ⭐ {movie?.vote_average ? movie.vote_average.toFixed(1) : "N/A"} / 10 
        </span>
        {movie?.genres?.map((g) => (
          <span key={g.id} className="rounded-full border px-3 py-1 text-sm font-semibold">
            {g.name}
          </span>
        ))}
      </div>

      {/* Date Picker */}
       <div className="flex gap-3 overflow-x-auto mb-6 pb-2">
        {dates.map((d, i) => (
          <button
            key={i}
            className={`px-3 py-2 rounded font-bold text-center min-w-[70px] cursor-pointer
              ${
                d.date === today
                  ? "bg-[#dd3c50] text-white"
                  : selectedDate === d.date
                  ? "bg-[#dd3c50] text-white"
                  : "bg-zinc-700 text-gray-300"
              }
              `}
            onClick={() => {
              setSelectedDate(d.date);
              setSelectedTime(""); // reset time on date change
            }}
          >
            <div className="text-xs">{d.day}</div>
            <div className="text-base">{d.display}</div>
          </button>
        ))}
      </div>

      {/* Filters Row */}
       <div className="flex gap-3 mb-6 flex-wrap">
        <select className="border rounded px-2 py-1 text-sm w-36" disabled>
          <option>{languageMap[movie?.original_language] || "Telugu"} - 2D</option>
        </select>
        <select className="border rounded px-2 py-1 text-sm w-32" disabled>
          <option>Price Range</option>
        </select>
        <select className="border rounded px-2 py-1 text-sm w-36" disabled>
          <option>Special Formats</option>
        </select>
        <select className="border rounded px-2 py-1 text-sm w-36" disabled>
          <option>Preferred Time</option>
        </select>
      </div>

      {/* Legend bar */}
      <div className="flex gap-4 mb-6 text-xs items-center">
        <span className="text-green-700">● AVAILABLE</span>
        <span className="text-yellow-800">● FAST FILLING</span>
        <span className="border border-green-700 px-1 rounded text-green-700 font-bold">LAN</span>
        <span>SUBTITLES LANGUAGE</span>
      </div>

       {/* Theater Showtimes */}
      <div className=" rounded-lg p-4 divide-y">
        <div className="py-4 flex flex-col md:flex-row md:items-center gap-4">
          <div className="font-semibold text-base w-64">{theater.name}</div>
          <div className="flex gap-3 flex-wrap">
            {availableShowtimes.length > 0 ? (
              availableShowtimes.map((time) => (
                <button
                  key={time}
                  className={`border px-4 py-2 rounded font-mono text-sm
                    ${
                      selectedTheater === theater.name && selectedTime === time
                        ? "border-[#197b4c] bg-[#1c931e] hover:border-[#3dc466] text-[#d6e6e0]"
                        : "border-gray-300 hover:border-[#3dc466]"
                    }
                  `}
                  onClick={() => {
                    setSelectedTheater(theater.name);
                    setSelectedTime(time);
                  }}
                >
                  <div>{time}</div>
                  <div className="text-xs">STANDARD</div>
                </button>
              ))
            ) : (
              <div className="text-gray-600 italic">No shows available for the selected date/time</div>
            )}
          </div>
          <div className="text-xs text-gray-500 ml-auto">
            {theater.cancellable ? "Cancellation available" : "Non-cancellable"}
          </div>
        </div>
      </div>

      {/* Next Button */}
       <div className="flex justify-start">
        <button
          className="bg-[#e84d5f] px-6 py-2 rounded text-white mt-6 font-bold cursor-pointer"
          onClick={handleNext}
          disabled={!selectedTime}
        >
          Book Seat
        </button>
      </div>

    </div>
      <div className="flex flex-col justify-start items-start p-6">
            <a href="/" className="flex items-center text-white ml-5">
              <img
                src={ImageData.BookYourShow}
                alt="BookYourShow Logo"
                width="135"
                height="50"
                className="object-contain"
              />
            </a>
            <strong className="font-bold text-[13px] text-red-700">Note: </strong>
            <ol className="text-gray-200 text-[12px]">
              <li>Registrattions/Tickets once booked cannot be exchanged, cancelled or refunded.</li>
              <li>In case of Credit/Debit Card bookings, the Credit/Debit cards and Card Holders must be present at the ticket counter while collecting the tickets.</li>
            </ol>
            <p className="text-gray-200 text-[12px]">As safe as it gets</p>
            <p className="text-gray-200 text-[12px]">This is for selecting the screen of the visualization, to achive best experience to the theater version. Keep the clean and safe watching</p>
      </div>
    </>
  );
}
