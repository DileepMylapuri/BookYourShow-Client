import React, { useState, useEffect } from "react";
import { ImageData } from "../assets/assets";

const ImagesCarousels = () => {
  const images = [ImageData.offerImg, ImageData.offers2, ImageData.offerImg];

  const [currentIndex, setCurrentIndex] = useState(1); 
  const [isTransitioning, setIsTransitioning] = useState(true);


  // Clone first & last slides
  const extendedImages = [
    images[images.length - 1],
    ...images,
    images[0],
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => prev + 1);
    setIsTransitioning(true);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => prev - 1);
    setIsTransitioning(true);
  };



  // Looping reset without flicker
  useEffect(() => {
    if (currentIndex === extendedImages.length - 1) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(1);
      }, 700);
    }
    if (currentIndex === 0) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(extendedImages.length - 2);
      }, 700);
    }
  }, [currentIndex, extendedImages.length]);

  return (
    <div className="relative w-full h-[350px] overflow-hidden">
      {/* Slides */}
      <div
        className={`flex ${isTransitioning ? "transition-transform duration-700 ease-in-out" : ""}`}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTransitionEnd={() => setIsTransitioning(true)}
      >
        {extendedImages.map((src, idx) => (
          <div key={idx} className="w-full flex-shrink-0 px-2">
            <img
              src={src}
              alt={`Carousel ${idx}`}
              className="w-full h-[300px] rounded-xl object-cover"
            />
          </div>
        ))}
      </div>

      {/* Prev Button */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black"
      >
        ❮
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black"
      >
        ❯
      </button>

      {/* Dots (inside image, bottom aligned) */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx + 1)} // +1 because of clone
            className={`w-3 h-3 rounded-full transition-colors ${
              idx + 1 === currentIndex ? "bg-white" : "bg-gray-500/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImagesCarousels;
