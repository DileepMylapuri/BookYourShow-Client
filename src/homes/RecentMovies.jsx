import React, { useEffect, useState } from "react";
import { fetchRecentMovies } from "../servers/tmdb";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

// TMDB Genre Mapping (Indian + Global)
const GENRES = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
  
  10756: "Tollywood",
  10757: "Bollywood",
  10758: "Kollywood",
  10759: "Sandalwood",
  10760: "Mollywood"
};

const SkeletonCard = () => (
  <div className="bg-zinc-900 rounded-lg overflow-hidden animate-pulse">
    <div className="w-full h-72 bg-zinc-700" />
    <div className="p-2 space-y-2">
      <div className="h-3 bg-zinc-700 rounded w-3/4" />
      <div className="h-3 bg-zinc-700 rounded w-1/2" />
      <div className="h-3 bg-zinc-700 rounded w-2/3" />
    </div>
  </div>
);

const RecentMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getMovies = async () => {
      try {
        const data = await fetchRecentMovies();
        setMovies(data ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getMovies();
  }, []);

  return (
    <>
      <h1 className="font-bold text-3xl text-white p-5">Recent Movies ⇩</h1>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
      {loading
        ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
        : movies.map((movie) => (
        <div
          key={movie.id}
          onClick={() => navigate(`/movie/${movie.id}`)}
          className="cursor-pointer transform hover:scale-103 transition-transform duration-300 ease-in-out bg-zinc-900 rounded-lg shadow-md overflow-hidden"
        >
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-72 object-cover"
          />
          <div className="p-2">
            <h3 className="text-white text-sm font-semibold">{movie.title}</h3>
          <div className="flex flex-row mt-1">
              <p className="text-sm text-amber-200">Rating: {Math.round(movie.vote_average/1)}</p>
              <Star className="w-5 h-5 text-amber-500" />
          </div>
              <p className="flex flex-row items-end text-white text-[13px] font-bold">Votes: {movie.vote_count}</p>
            <p className="text-gray-300 text-xs mt-1">
              {movie.genre_ids.map((id) => GENRES[id]).join(", ") || "Unknown"}
            </p>
          </div>
        </div>
      ))}
    </div>
    </>
  );
};

export default RecentMovies;