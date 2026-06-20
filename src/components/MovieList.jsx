import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MovieList({ movies }) {
  const navigate = useNavigate();
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4, slidesToScroll: 2 }
      },
      {
        breakpoint: 768,
        settings: "unslick"
      }
    ]
  };

  return (
    <div className="px-6 overflow-x-hidden">
      <h1 className="text-2xl font-bold mt-6 mb-6 text-gray-200">
        Popular Movies
      </h1>

      <div className="hidden md:block">
        <Slider {...settings}>
          {movies.map((movie) => (
            <div key={movie.id} 
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="p-2">
              <div className="flex flex-col bg-zinc-900 justify-start rounded-lg overflow-hidden shadow-md hover:scale-105 hover:shadow-xl transition transform duration-300 cursor-pointer">
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-3">
                  <h2 className="font-semibold text-white text-sm truncate">
                    {movie.title}
                  </h2>
                  <div className="flex flex-row mt-1">
                    <p className="text-sm text-amber-200">{Math.round(movie.vote_average/1)}</p>
                    <Star className="w-5 h-5 text-amber-500 ml-1" />
                  </div>
                <p className="text-white text-[13px] font-bold">{movie.release_date?.split('-')[0]}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <div className="flex md:hidden space-x-4 overflow-x-auto scrollbar-hide pb-3">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="min-w-[150px] bg-gray-900 rounded-lg overflow-hidden shadow-md hover:scale-105 transition transform duration-300 cursor-pointer"
          >
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-56 object-cover"
            />
            <div className="p-2">
              <h2 className="font-semibold text-white text-xs truncate">
                {movie.title}
              </h2>
              <p className="text-white">{movie.release_date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
