import { useEffect, useState } from "react";

export default function MovieTrailer({ movieId }) {
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.REACT_APP_API_KEY}`
        );
        const data = await res.json();

        // Find a YouTube trailer
        const trailer = data.results.find(
          (vid) => vid.site === "YouTube" && vid.type === "Trailer"
        );
        if (trailer) {
          setTrailerKey(trailer.key);
        }
      } catch (error) {
        console.error("Error fetching trailer:", error);
      }
    };

    fetchTrailer();
  }, [movieId]);

  return (
    <div className="w-full flex justify-start mt-4">
      {trailerKey ? (
        <iframe
          width="800"
          height="450"
          src={`https://www.youtube.com/embed/${trailerKey}`}
          title="Movie Trailer"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <p className="text-gray-400">No trailer available</p>
      )}
    </div>
  );
}
