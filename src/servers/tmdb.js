import API_BASE_URL from "../config";
const BASE_URL = API_BASE_URL;

export const fetchMovies = async (query) => {
  const endpoint = query
    ? `${BASE_URL}/api/search?q=${encodeURIComponent(query)}`
    : `${BASE_URL}/api/movies`;

  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`Failed to fetch movies: ${response.statusText}`);
  const data = await response.json();
  return data.results;
};

export const fetchMovieDetails = async (movieId) => {
  const response = await fetch(`${BASE_URL}/api/movie/${movieId}`);
  if (!response.ok) throw new Error("Failed to fetch movie details");
  return await response.json();
};

export const fetchRecommendedMovies = async (movieId) => {
  const response = await fetch(`${BASE_URL}/api/movie/${movieId}/recommendations`);
  if (!response.ok) throw new Error("Failed to fetch recommendations");
  const data = await response.json();
  return data.results;
};

const API_KEY = "a0b38cda0897a0a53b1623adb1f6f0b6";
export const fetchRecentMovies = async () => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&region=IN&page=1`
    );
    const data = await response.json();
    return data.results ?? [];
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};

export const fetchMovieCredits = async (movieId) => {
  const response = await fetch(`${BASE_URL}/api/movie/${movieId}/credits`);
  if (!response.ok) throw new Error("Failed to fetch credits");
  return response.json();
};

export const fetchMovieReviews = async (movieId) => {
  const response = await fetch(`${BASE_URL}/api/movie/${movieId}/reviews`);
  if (!response.ok) throw new Error("Failed to fetch reviews");
  return response.json();
};
