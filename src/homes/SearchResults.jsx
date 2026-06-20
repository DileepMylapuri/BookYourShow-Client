import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMovies } from "../servers/tmdb";
import MovieList from "../components/MovieList";

const SkeletonGrid = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} className="bg-zinc-900 rounded-lg overflow-hidden animate-pulse">
        <div className="w-full h-64 bg-zinc-700" />
        <div className="p-2 space-y-2">
          <div className="h-3 bg-zinc-700 rounded w-3/4" />
          <div className="h-3 bg-zinc-700 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

const SearchResults = () => {
  const { query } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const data = await fetchMovies(query);
        setMovies(data ?? []);
      } catch (error) {
        console.error(error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query]);

  return (
    <div className="p-4 bg-black min-h-screen">
      <h2 className="text-white text-2xl mb-6 font-bold">
        Search results for <span className="text-pink-400">"{query}"</span>
      </h2>

      {loading ? (
        <SkeletonGrid />
      ) : movies.length > 0 ? (
        <MovieList movies={movies} />
      ) : (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
          <span className="text-5xl">🎬</span>
          <p className="text-gray-300 text-lg font-semibold">No results found</p>
          <p className="text-gray-500 text-sm">Try a different movie name</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
