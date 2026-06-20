import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { fetchMovies } from './servers/tmdb';
import { AuthProvider } from "./components/AuthContent";
import Footer from "./components/Footer";

const MovieList = lazy(() => import('./components/MovieList'));
const Navbar = lazy(() => import('./components/Navbar'));
const ImagesCarousels = lazy(() => import("./homes/ImagesCarousels"));
const RecentMovies = lazy(() => import("./homes/RecentMovies"));
const MovieDetails = lazy(() => import("./components/MovieDetails"));
const SearchResults = lazy(() => import("./homes/SearchResults"));
const SeatSelect = lazy( ()=> import("./components/SeatSelect"));
const  PaymentPage = lazy(()=>import("./components/PaymentPage"));
// const  PaymentSuccess = lazy(()=>import("./components/PaymentSuccess"));
const  RegisterPage = lazy(() => import("./components/RegisterPage"));
const TheaterSelection = lazy(() => import("./components/TheaterSelection"));
const MyBookings = lazy(() => import("./components/MyBookings"));

// import ParticleExplosion from "./components/ParticleEmitter";


const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMovies(searchQuery)
      .then(setMovies)
      .catch(err => console.error(err));
  }, [searchQuery]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <AuthProvider>
    <BrowserRouter>

      <div className="bg-black min-h-screen pb-10">
        {/* <ParticleExplosion /> */}
        <Navbar onSearch={setSearchQuery} />  
        <Routes>
          <Route path="/" 
            element={
              <>
                <ImagesCarousels />
                <RecentMovies />
                <MovieList movies={movies} />
              </>
            } />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/search/:query" element={<SearchResults />} />
          <Route path="/theater-selection/:movieId" element={<TheaterSelection />} />
          <Route path="/seat-select/:movieId" element={<SeatSelect />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          {/* <Route path="/paymentsuccess" element={<PaymentSuccess />} /> */}
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  </AuthProvider>
  </Suspense>
  );
};

export default App;
