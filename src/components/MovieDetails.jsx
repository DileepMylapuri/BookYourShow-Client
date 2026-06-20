import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMovieDetails } from "../servers/tmdb";
import MovieTrailer from "./MovieTrailer";
import { fetchMovieCredits, fetchMovieReviews } from "../servers/tmdb";
import { useAuth } from "./AuthContent";

export default function MovieDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [reviews, setReviews] = useState([]);
  const [expandedReview, setExpandedReview] = useState(null);
  const handleBookTickets = (movieId) => {
    if (user) {
    navigate(`/theater-selection/${movieId}`);
  } else {
    navigate("/register");
  }
  };

  const languageMap = {
    hi: "Hindi", te: "Telugu", ta: "Tamil", ml: "Malayalam",
    kn: "Kannada", bn: "Bengali", mr: "Marathi", gu: "Gujarati",
    pa: "Punjabi", en: "English",
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? `${hrs}h ` : ""}${mins}m`;
  };

  useEffect(() => {
    const getMovieData = async () => {
      try {
        const movieData = await fetchMovieDetails(id);
        setMovie(movieData);

        // Fetch credits
        const creditsData = await fetchMovieCredits(id);
        setCredits(creditsData);

        // Fetch reviews
        const reviewsData = await fetchMovieReviews(id);
        setReviews(reviewsData.results || []);


      } catch (error) {
        console.error(error);
      }
    };
    getMovieData();
  }, [id]);

  if (!movie) return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <>
      {/* Movie Header & Trailer */}
      <div
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`
        }}
        className="p-6 text-white bg-cover bg-center">
        <button onClick={() => navigate(-1)} className="mb-4 text-gray-200 hover:text-blue-400 hover:underline font-bold cursor-pointer">← Back to list</button>

        <div className="ml-7 flex flex-col md:flex-row gap-6">
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-64 rounded-lg shadow-lg" />
          <div>
            <h1 className="text-4xl font-bold mb-2 ml-3">{movie.title}</h1>
           <div className="flex flex-row justify-start items-center ml-3 font-semibold"> 
              <p className="flex items-center pl-2 mb-2 bg-zinc-800 h-[60px] rounded-2xl p-4">
                ⭐ {movie.vote_average.toFixed(1)} / 10 
                <span className="pl-3">({movie.vote_count}Votes)</span>
                <span className="bg-gray-100 text-black font-bold text-sm items-end ml-10 p-2 rounded-2xl cursor-pointer">Rate now</span>
            </p> 
           </div>
            <div className="flex flex-row font-semibold"> 
              <p className="mb-2 ml-3">{movie.genres.map(g => g.name).join(", ")}</p>
                <span className="ml-3">|</span> 
              <p className="mb-2 ml-3">{formatRuntime(movie.runtime)}</p>
               <span className="ml-3">|</span>
              <p className="mb-2 ml-3">{movie.release_date}</p> 
            </div>
            <p className="flex flex-1 flex-row justify-center items-center text-center rounded-4xl mb-2 ml-3 font-semibold bg-white p-1 text-black w-[100%] ">{languageMap[movie.original_language] || movie.original_language}</p>
            <p className="mb-2 ml-3 font-semibold">Popularity: {movie.popularity.toFixed(0)}</p>
            <div className="mt-4 ml-3"><MovieTrailer movieId={id} /></div>
            <button onClick={() => handleBookTickets(movie.id)} className="ml-3 bg-[#dd2251] cursor-pointer mt-4 font-semibold hover:bg-[#f03f6c] px-4 py-2 rounded text-white">Book Tickets</button>
          </div>
        </div>
      </div>

      {/* About Movie */}
      <div className="flex flex-col md:flex-col md:ml-10 gap-6 p-3">
        <h1 className="font-bold text-4xl text-white md:w-1/4">About Movie</h1>
        <p className="text-white md:w-3/4">{movie.overview}</p>
        <hr className="shadow-sm shadow-white"/>
      </div>

      {/* Cast & Crew */}
      <div className="p-3">
        <h2 className="text-3xl font-bold text-white mb-4 ml-10">Cast</h2>
       <div className="flex overflow-x-auto space-x-6 pb-4 ml-10">
          {credits.cast && credits.cast.length > 0 ? (
            credits.cast.slice(0, 10).map((person) => (
              <div
                key={person.cast_id}
                className="flex-shrink-0 flex flex-col items-center w-24">
                <img
                  className="w-25 h-25 rounded-full object-cover mb-2"
                  src={
                    person.profile_path
                      ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                      : "https://via.placeholder.com/200x200"
                  }
                  alt={person.name}/>
                <p className="text-sm font-bold text-white text-center">{person.name}</p>
                <p className="text-xs text-gray-300 text-center">{person.character}</p>
              </div>
            ))
          ) : (
            <p className="text-white">No cast available.</p>
          )}
        </div>


        <h2 className="text-3xl font-bold text-white mt-6 mb-4 ml-10">Crew</h2>
        <div className="flex overflow-x-auto space-x-6 pb-4 ml-10">
          {credits.crew && credits.crew.length > 0 ? (
            credits.crew.slice(0, 10).map((person) => (
              <div
                key={person.credit_id}
                className="flex-shrink-0 flex flex-col items-center w-24">
                <img
                  className="w-24 h-24 rounded-full object-cover mb-2"
                  src={
                    person.profile_path
                      ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                      : "https://via.placeholder.com/200x200"
                  }
                  alt={person.name}/>
                <p className="text-sm font-bold text-white text-center">{person.name}</p>
                <p className="text-xs text-gray-300 text-center">{person.job}</p>
              </div>
            ))
          ) : (
            <p className="text-white">No Crew available.</p>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="p-3 ml-10 mb-24">
        <h2 className="text-3xl font-bold text-gray-300 mb-4">Reviews</h2>
        {reviews.length > 0 ? (
          <div className="flex flex-col space-y-4 pb-4 max-w-4xl">
            {reviews.map((review) => {
              const isLong = review.content.length > 300;
              const isExpanded = expandedReview === review.id;
              const avatarUrl = review.author_details.avatar_path
                ? review.author_details.avatar_path.startsWith("/https")
                  ? review.author_details.avatar_path.slice(1)
                  : `https://image.tmdb.org/t/p/w45${review.author_details.avatar_path}`
                : null;
              return (
                <div key={review.id} className="p-4 bg-zinc-800 rounded-xl border border-zinc-700">
                  <div className="flex items-center gap-3 mb-2">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={review.author} className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-pink-700 flex items-center justify-center text-white font-bold text-sm">
                        {review.author.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-white font-semibold text-sm">{review.author}</p>
                      {review.author_details.rating && (
                        <p className="text-yellow-400 text-xs">{"⭐".repeat(Math.round(review.author_details.rating / 2))} {review.author_details.rating}/10</p>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {isLong && !isExpanded
                      ? review.content.slice(0, 300) + "…"
                      : review.content}
                  </p>
                  {isLong && (
                    <button
                      onClick={() => setExpandedReview(isExpanded ? null : review.id)}
                      className="text-pink-400 text-xs mt-2 hover:underline cursor-pointer"
                    >
                      {isExpanded ? "Show less" : "Read more"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400">No reviews available.</p>
        )}
      </div>
    </>
  );
}
