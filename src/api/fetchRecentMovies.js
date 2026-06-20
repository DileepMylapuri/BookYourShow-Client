import API_BASE_URL from "../config";

export const fetchRecentMovies = async () => {
  const response = await fetch(`${API_BASE_URL}/api/movies/recent`);
  if (!response.ok) throw new Error("Failed to fetch recent movies");
  const data = await response.json();
  return data.results;
};
