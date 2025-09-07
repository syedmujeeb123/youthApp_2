import { useEffect, useState } from "react";
import DotIndicators from "./DotIndicators";

function Carousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide using useEffect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Slide every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [images.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full max-w-full overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index}`}
            className="w-full h-[100vh] object-cover shrink-0"
          />
        ))}
      </div>

      <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex mt-20">
        <DotIndicators
          count={images.length}
          currentIndex={currentIndex}
          onDotClick={setCurrentIndex}
        />
      </div>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 bg-black bg-opacity-50 text-white w-12 h-12 text-4xl rounded-full hover:bg-green-500 flex items-center justify-center transform -translate-y-1/2"
      >
        <span className="flex items-center justify-center h-full w-full pb-2">
          ‹
        </span>
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 bg-black bg-opacity-50 text-white w-12 h-12 text-4xl rounded-full hover:bg-green-500 flex items-center justify-center transform -translate-y-1/2"
      >
        <span className="flex items-center justify-center h-full w-full pb-2">
          ›
        </span>
      </button>
    </div>
  );
}

export default Carousel;
