'use client'; // Required for hooks like useState, useEffect

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Using framer-motion for animations

// Define the type for a carousel item
interface CarouselItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string; // Placeholder for image/icon path
}

// Sample data for the carousel
const carouselItems: CarouselItem[] = [
  {
    id: 1,
    title: 'Feature One',
    description: 'Discover the amazing benefits of Feature One.',
    imageUrl: '/icons/feature1.svg', // Example path
  },
  {
    id: 2,
    title: 'Feature Two',
    description: 'Unlock new possibilities with Feature Two.',
    imageUrl: '/icons/feature2.svg', // Example path
  },
  {
    id: 3,
    title: 'Feature Three',
    description: 'Experience seamless integration with Feature Three.',
    imageUrl: '/icons/feature3.svg', // Example path
  },
];

const InnovativeCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Basic auto-scroll functionality (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto my-12 overflow-hidden rounded-lg shadow-xl bg-white dark:bg-gray-800">
      <div className="relative h-64 md:h-80 flex items-center justify-center">
        {/* Display current item with animation */}
        <motion.div
          key={currentIndex} // Key change triggers animation
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
        >
          {/* Placeholder for image/icon */}
          <img
            src={carouselItems[currentIndex].imageUrl}
            alt={carouselItems[currentIndex].title}
            className="w-16 h-16 mb-4 text-teal-500" // Basic styling
          />
          <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
            {carouselItems[currentIndex].title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {carouselItems[currentIndex].description}
          </p>
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition duration-300 z-10"
        aria-label="Previous slide"
      >
        &#10094; {/* Left arrow */}
      </button>
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition duration-300 z-10"
        aria-label="Next slide"
      >
        &#10095; {/* Right arrow */}
      </button>

      {/* Indicators (optional) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'
            } hover:bg-teal-400 transition duration-300`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default InnovativeCarousel;
