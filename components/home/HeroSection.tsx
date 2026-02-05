"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buildAPIURL } from "@/lib/utils";

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const [bannerSlides, setBannerSlides] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // 1. Fetch Banners
        const bannersRes = await fetch(buildAPIURL("/api/v1/banners/public/banners"));
        const bannersData = await bannersRes.json();

        if (bannersData.success && Array.isArray(bannersData.data)) {
          const slides = bannersData.data
            .filter((banner: any) => (banner.type || "").toLowerCase() === "primary banner")
            .sort((a: any, b: any) => (a.priority ?? 0) - (b.priority ?? 0))
            .map((banner: any) => ({
              id: banner._id,
              image: banner.image,
              href: banner.url || '/games',
              title: banner.title,
              external: banner.url && String(banner.url).startsWith('http')
            }));
          setBannerSlides(slides);
        }

      } catch (error) {
        console.error("Failed to fetch banners:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    // Pause autoplay when user is interacting

    if (bannerSlides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [bannerSlides.length, isInteracting]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handlePrevious = () => {
    if (bannerSlides.length === 0) return;
    goToSlide((currentSlide - 1 + bannerSlides.length) % bannerSlides.length);
  };

  const handleNext = () => {
    if (bannerSlides.length === 0) return;
    goToSlide((currentSlide + 1) % bannerSlides.length);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsInteracting(true);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsInteracting(false);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }

    setTouchStart(0);
    setTouchEnd(0);

    // Resume autoplay after 2 seconds
    setTimeout(() => setIsInteracting(false), 2000);
  };

  // Mouse drag handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default drag behavior
    setIsInteracting(true);
    setTouchStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (touchStart) {
      e.preventDefault();
      setTouchEnd(e.clientX);
    }
  };

  const handleMouseUp = () => {
    if (!touchStart || !touchEnd) {
      setIsInteracting(false);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }

    setTouchStart(0);
    setTouchEnd(0);

    // Resume autoplay after 2 seconds
    setTimeout(() => setIsInteracting(false), 2000);
  };

  return (
    <section className="bg-goblin-bg py-6 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 3D Depth Carousel - Banner Ratio */}
        <div className="relative overflow-hidden px-0 sm:px-8 md:px-16 lg:px-24 xl:px-32">
          <div
            ref={carouselRef}
            className="relative w-full h-[200px] sm:h-[250px] md:h-[280px] lg:h-[320px] xl:h-[360px] perspective-1000 cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Show nothing or skeleton if no banners */}
            {bannerSlides.length === 0 && !loading && (
              <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl">
                <p className="text-gray-400">No banners available</p>
              </div>
            )}

            {/* Background Banners - Layered with depth */}
            {bannerSlides.length > 0 && bannerSlides.map((banner, index) => {
              const isActive = index === currentSlide;
              const isPrev = index === (currentSlide - 1 + bannerSlides.length) % bannerSlides.length;
              const isNext = index === (currentSlide + 1) % bannerSlides.length;

              let transform = 'translateX(100%) translateZ(0px)';
              let zIndex = 1;
              let opacity = 0;
              let scale = 0.75;
              let blur = 'blur(4px)';

              if (isActive) {
                transform = 'translateX(0%) translateZ(0px)';
                zIndex = 30;
                opacity = 1;
                scale = 1;
                blur = 'blur(0px)';
              } else if (isPrev) {
                transform = 'translateX(-70%) translateZ(-120px)';
                zIndex = 20;
                opacity = 0.35;
                scale = 0.75;
                blur = 'blur(3px)';
              } else if (isNext) {
                transform = 'translateX(70%) translateZ(-120px)';
                zIndex = 20;
                opacity = 0.35;
                scale = 0.75;
                blur = 'blur(3px)';
              }

              return (
                <div
                  key={banner.id}
                  className="absolute inset-0 transition-all duration-500 ease-out pointer-events-none"
                  style={{
                    transform: `${transform} scale(${scale})`,
                    zIndex,
                    opacity,
                    filter: blur,
                  }}
                >
                  <Link
                    href={banner.href}
                    {...((banner as any).external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={`block w-full h-full ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                  >
                    <div className="relative w-full h-full rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl bg-goblin-bg-card select-none">
                      <Image
                        src={banner.image}
                        alt={`Banner ${index + 1}`}
                        fill
                        className="object-cover object-center pointer-events-none"
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                        draggable={false}
                        style={{ objectPosition: 'center' }}
                      />
                      {!isActive && (
                        <div className="absolute inset-0 bg-black/40" />
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}

            {/* Navigation Arrows - Smaller, Less Intrusive */}
            <button
              onClick={handlePrevious}
              className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 z-40"
              aria-label="Previous banner"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 z-40"
              aria-label="Next banner"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Modern Carousel Indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {bannerSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${index === currentSlide
                  ? 'w-8 bg-[#4ecdc4]'
                  : 'w-1.5 bg-gray-600 hover:bg-gray-500'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

