import React, { useState } from "react";
import { ImageData } from "../assets/assets";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContent";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogin = () => { navigate("/register"); window.scrollTo(0, 0); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      navigate(`/search/${encodeURIComponent(input.trim())}`);
      setInput("");
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <header className="bg-black shadow-md sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center p-4">
          {/* Logo */}
          <a href="/" className="flex items-center text-white ml-2">
            <img src={ImageData.BookYourShow} alt="BookYourShow Logo" width="120" height="44" className="object-contain" />
          </a>

          {/* Desktop Search */}
          <form onSubmit={handleSubmit} className="hidden md:flex flex-grow mx-6 items-center">
            <input
              value={input}
              type="text"
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search movies, events, plays..."
              className="w-[65%] px-5 ml-6 py-2 rounded-l-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-pink-600 placeholder-gray-500"
            />
            <button type="submit" className="px-4 py-2 cursor-pointer bg-pink-600 hover:bg-pink-700 text-white rounded-r-lg font-semibold transition">
              Search
            </button>
          </form>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  className="w-10 h-10 cursor-pointer rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-bold shadow"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {user.username.charAt(0).toUpperCase()}
                </button>
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-52 z-50 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="px-4 py-3 bg-gradient-to-r from-pink-50 to-rose-50 border-b">
                      <p className="text-gray-800 font-bold">{user.username}</p>
                      <p className="text-gray-400 text-xs truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { navigate("/my-bookings"); setIsOpen(false); }}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer text-sm font-medium"
                    >
                      🎟️ My Bookings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 cursor-pointer text-red-500 hover:bg-red-50 flex items-center gap-2 text-sm font-medium border-t"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white py-2 px-5 font-bold cursor-pointer rounded-lg transition"
              >
                Sign In
                <svg fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white p-1" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-zinc-950 border-t border-zinc-800 px-4 pb-4 pt-3 flex flex-col gap-3">
            {/* Mobile Search */}
            <form onSubmit={handleSubmit} className="flex">
              <input
                value={input}
                type="text"
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search movies..."
                className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-pink-600 placeholder-gray-500 text-sm"
              />
              <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded-r-lg text-sm font-semibold cursor-pointer">
                Go
              </button>
            </form>

            {user ? (
              <>
                <div className="flex items-center gap-3 px-1 py-2 border-b border-zinc-800">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-bold text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{user.username}</p>
                    <p className="text-gray-400 text-xs">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => { navigate("/my-bookings"); setIsMobileMenuOpen(false); }}
                  className="text-left text-gray-200 hover:text-white py-2 px-1 text-sm font-medium flex items-center gap-2 cursor-pointer"
                >
                  🎟️ My Bookings
                </button>
                <button
                  onClick={handleLogout}
                  className="text-left text-red-400 hover:text-red-300 py-2 px-1 text-sm font-medium flex items-center gap-2 cursor-pointer"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => { handleLogin(); setIsMobileMenuOpen(false); }}
                className="w-full bg-pink-600 text-white py-2.5 rounded-lg font-bold cursor-pointer hover:bg-pink-700 transition"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
