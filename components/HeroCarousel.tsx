'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const carouselImages = [
  {
    url: '/auroimgs/fred-c-drone-photos_43068849880_o.jpg',
    title: 'Matrimandir',
    description: 'The soul of Auroville - A place for concentration'
  },
  {
    url: '/auroimgs/greenbelt.jpg',
    title: 'Green Belt',
    description: 'Connecting with nature through outdoor activities'
  },
  {
    url: '/auroimgs/residentialzone.jpg',
    title: 'Residential Zone',
    description: 'Living spaces in harmony with nature'
  },
  {
    url: '/auroimgs/unique architecture.jpg',
    title: 'Unique Architecture',
    description: 'Innovative and sustainable design'
  },
  {
    url: '/auroimgs/botanicalgarden.jpg',
    title: 'Botanical Gardens',
    description: 'Preserving biodiversity'
  },
  {
    url: '/auroimgs/townhallperma.jpg',
    title: 'Permaculture Gardens',
    description: 'Sustainable food systems'
  }
];

export default function HeroCarousel() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      nextImage();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentImageIndex]);

  const nextImage = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
      setTimeout(() => setIsTransitioning(false), 500); // Transition duration
    }
  };

  const prevImage = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
      setTimeout(() => setIsTransitioning(false), 500); // Transition duration
    }
  };

  const goToImage = (index: number) => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentImageIndex(index);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  return (
    <div className="relative h-screen">
      {/* Logo Header */}
      <div className="absolute top-6 left-0 z-20 p-4">
        <img
          src="/logodark.png" // Assuming logo is in public folder
          alt="Auroville Logo"
          className="h-12 w-auto"
        />
      </div>

      {carouselImages.map((image, index) => (
        <div
          key={image.url}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image.url}
            alt={image.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30">
            {/* Content within Overlay */}
            <div className="container mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 md:mb-6 mt-12">
                {image.title}
              </h1>
              <p className="text-lg md:text-2xl text-white/90 mb-6 md:mb-8">
                {image.description}
              </p>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <Link
                  href="/login" // Use Next.js Link href
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors" // Use orange-500 and hover:orange-600
                >
                  Community Portal
                </Link>
                <a
                  href="#learn-more" // Standard anchor link for within-page navigation
                  className="px-6 py-3 bg-white/10 text-white rounded-lg text-lg font-semibold hover:bg-white/20 transition-colors"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Carousel Controls */}
      <button
        onClick={prevImage}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-black/20 hover:bg-black/30 transition-colors z-10"
        disabled={isTransitioning}
        aria-label="Previous image"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </button>
      <button
        onClick={nextImage}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-black/20 hover:bg-black/30 transition-colors z-10"
        disabled={isTransitioning}
        aria-label="Next image"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </button>

      {/* Carousel Indicators */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentImageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to image ${index + 1}`}
            disabled={isTransitioning}
          />
        ))}
      </div>
    </div>
  );
}
