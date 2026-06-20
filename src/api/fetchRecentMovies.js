
export const fetchRecentMovies = async () => {
  const today = new Date().toISOString().split("T")[0];
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&region=IN&sort_by=release_date.desc&release_date.lte=${today}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch recent movies");
  }
  const data = await response.json();
  return data.results;
};
