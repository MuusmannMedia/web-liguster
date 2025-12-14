"use client";

import React, { useEffect, useRef, useState } from "react";

export default function LigusterLandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = useState<"neighbor" | "event">("neighbor");

  // Carousel
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 5;

  // RETTELSE HER: Vi bruger 'number', fordi window.setInterval returnerer et tal ID i browseren
  const autoPlayRef = useRef<number | null>(null);

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((p) => (p === 0 ? totalSlides - 1 : p - 1));

  const resetAutoPlay = () => {
    if (autoPlayRef.current) window.clearInterval(autoPlayRef.current);
    autoPlayRef.current = window.setInterval(nextSlide, 3500);
  };

  useEffect(() => {
    resetAutoPlay();
    return () => {
      if (autoPlayRef.current) window.clearInterval(autoPlayRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swipe
  const [touchStart, setTouchStart] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    if (autoPlayRef.current) window.clearInterval(autoPlayRef.current);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    if (touchStart - touchEnd > 50) nextSlide();
    if (touchStart - touchEnd < -50) prevSlide();
    resetAutoPlay();
  };

  // AI demo (placeholder – behold din senere)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [neighborInput, setNeighborInput] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [neighborOutput, setNeighborOutput] = useState(
    "Indtast en udfordring til venstre for at se magien ske..."
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [eventInput, setEventInput] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [eventOutput, setEventOutput] = useState(
    "Fortæl os lidt om jeres fest, så kommer vi med forslag..."
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Lokal CSS (kan flyttes til globals.css senere) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          body { font-family: Inter, sans-serif; }
          .bg-liguster-gradient { background: linear-gradient(135deg, #0e2a47 0%, #1a4d7c 100%); }
          .text-liguster { color: #1a4d7c; }
          .bg-liguster { background-color: #1a4d7c; }
          .hover-bg-liguster:hover { background-color: #0e2a47; }
          .mockup-frame {
            border: 12px solid #1f2937;
            border-radius: 2.5rem;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
            position: relative;
            background: #000;
          }
          .fade-in-up { animation: fadeInUp 0.8s ease-out; }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        `,
        }}
      />

      {/* Nav */}
      <nav className="absolute w-full z-20 top-0 start-0 border-b border-white/10">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="#" className="flex items-center space-x-3">
            {/* Sørg for at denne fil findes i din public mappe */}
            <img src="/Liguster-logo-NEG.png" className="h-10 md:h-12" alt="Liguster Logo" />
          </a>
          <button
            onClick={() => setIsLoginOpen(true)}
            type="button"
            className="text-white bg-white/20 hover:bg-white/30 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all backdrop-blur-sm border border-white/40"
          >
            <i className="fa-solid fa-right-to-bracket mr-2" /> Log ind
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-liguster-gradient relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <i className="fa-solid fa-leaf absolute text-9xl text-white top-10 left-10 transform -rotate-12" />
          <i className="fa-brands fa-apple absolute text-9xl text-white bottom-20 right-20 transform rotate-12" />
        </div>

        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 relative z-10 pt-24 md:pt-0">
          <div className="mr-auto place-self-center lg:col-span-7 fade-in-up">
            <span className="bg-blue-500/30 text-blue-100 text-xs font-medium px-2.5 py-0.5 rounded-full mb-4 inline-block border border-blue-400/50">
              Nyhed: Version 2.0 med AI-assistent
            </span>
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl text-white">
              Det digitale samlingspunkt for din forening
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-200 lg:mb-8 md:text-lg lg:text-xl">
              Liguster App samler kommunikation, dokumenter og naboskab ét sted. Få fuldt overblik over grundejerforeningen direkte fra lommen.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <a
                href="#features"
                className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 transition-colors"
              >
                Læs mere
              </a>
              <div className="flex items-center gap-4 text-white/80 text-sm mt-2 md:mt-0">
                <div className="flex items-center">
                  <i className="fa-brands fa-apple text-xl mr-2" /> iOS
                </div>
                <div className="flex items-center">
                  <i className="fa-brands fa-android text-xl mr-2" /> Android
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex justify-center items-center relative">
            <div className="relative">
              <div className="absolute top-0 right-[-40px] w-64 h-80 bg-gray-800 rounded-2xl shadow-2xl transform rotate-6 border-4 border-gray-700 flex items-center justify-center opacity-90 z-0">
                <div className="text-white text-center p-4">
                  <i className="fa-solid fa-tablet-screen-button text-4xl mb-2" />
                  <p>Tablet Optimeret</p>
                </div>
              </div>

              <div
                className="mockup-frame w-[280px] h-[580px] bg-black relative z-10 mx-auto"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="flex transition-transform duration-500 ease-in-out h-full w-full"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {[
                    "/app-01.png",
                    "/app-02.png",
                    "/app-03.png",
                    "/app-04.png",
                    "/app-05.png",
                  ].map((src, idx) => (
                    <div key={src} className="min-w-full h-full bg-black flex items-center justify-center">
                      <img src={src} className="w-full h-full object-cover" alt={`Slide ${idx + 1}`} />
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                  {[...Array(totalSlides)].map((_, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setCurrentSlide(index);
                        resetAutoPlay();
                      }}
                      className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                        index === currentSlide ? "bg-white w-5" : "bg-white/40 w-2"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features (kort) */}
      <section id="features" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Et komplet system til din forening</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Liguster er designet til at gøre bestyrelsesarbejdet nemmere og naboskabet stærkere.
            </p>
          </div>
        </div>
      </section>

      {/* Login modal (placeholder) */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm"
            onClick={() => setIsLoginOpen(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:w-full sm:max-w-md">
              <button
                onClick={() => setIsLoginOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <i className="fa-solid fa-xmark text-xl" />
              </button>

              <div className="bg-white px-4 pb-6 pt-6 sm:p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2 text-center">Log ind på Liguster</h3>
                <p className="text-sm text-gray-500 mb-6 text-center">
                  (placeholder – vi laver /login med Supabase bagefter)
                </p>

                <button
                  type="button"
                  className="w-full flex justify-center rounded-md bg-liguster px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 transition-colors"
                  onClick={() => setIsLoginOpen(false)}
                >
                  Luk
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}