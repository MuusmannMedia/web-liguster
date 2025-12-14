
// ------------------------------------------------------------
// 2) app/page.tsx
// ------------------------------------------------------------
"use client";

import React, { useEffect, useRef, useState } from "react";

function TextRenderer({ text, italic = false }: { text: string; italic?: boolean }) {
  return <div className={`whitespace-pre-wrap ${italic ? "italic" : ""}`}>{text}</div>;
}

export default function Page() {
  // --- STATE MANAGEMENT ---
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"neighbor" | "event">("neighbor");

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 5;

  // ✅ VIGTIGT: brug ReturnType<typeof setInterval> i stedet for NodeJS.Timeout
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // AI State
  const [neighborInput, setNeighborInput] = useState("");
  const [neighborOutput, setNeighborOutput] = useState(
    "Indtast en udfordring til venstre for at se magien ske..."
  );
  const [eventInput, setEventInput] = useState("");
  const [eventOutput, setEventOutput] = useState(
    "Fortæl os lidt om jeres fest, så kommer vi med forslag..."
  );
  const [loading, setLoading] = useState(false);

  // --- CAROUSEL LOGIC ---
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));

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

  // Swipe handlers
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    if (autoPlayRef.current) window.clearInterval(autoPlayRef.current);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    if (touchStart - touchEnd > 50) nextSlide();
    if (touchStart - touchEnd < -50) prevSlide();
    resetAutoPlay();
  };

  // --- GEMINI API LOGIC ---
  // OBS: Lad være med at lægge en rigtig API key i client-kode.
  // Når du vil have det live, laver vi en /api route på serveren.
  const apiKey = "";

  const callGemini = async (prompt: string, type: "neighbor" | "event") => {
    setLoading(true);
    if (type === "neighbor") setNeighborOutput("Tænker så det knager...");
    else setEventOutput("Tænker så det knager...");

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      if (type === "neighbor") setNeighborOutput(rawText);
      else setEventOutput(rawText);
    } catch (error: any) {
      const msg = `Hov, der skete en fejl: ${error?.message ?? "Ukendt fejl"}. Prøv igen senere.`;
      if (type === "neighbor") setNeighborOutput(msg);
      else setEventOutput(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleNeighborGenerate = () => {
    if (!neighborInput) return alert("Du skal skrive en udfordring først :)");
    const prompt = `Du er en diplomatisk assistent for en dansk grundejerforening. Skriv en venlig og konstruktiv besked til en nabo baseret på: "${neighborInput}". Svaret skal være på dansk.`;
    callGemini(prompt, "neighbor");
  };

  const handleEventGenerate = () => {
    if (!eventInput) return alert("Du skal beskrive begivenheden først :)");
    const prompt = `Du er en kreativ eventplanlægger for en dansk grundejerforening. Baseret på: "${eventInput}" — kom med 3 konkrete forslag. Svaret skal være på dansk.`;
    callGemini(prompt, "event");
  };

  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen">
      {/* Custom CSS (kan flyttes til globals.css senere) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .bg-liguster-gradient { background: linear-gradient(135deg, #0e2a47 0%, #1a4d7c 100%); }
            .text-liguster { color: #1a4d7c; }
            .bg-liguster { background-color: #1a4d7c; }
            .hover-bg-liguster:hover { background-color: #0e2a47; }
            .mockup-frame { border: 12px solid #1f2937; border-radius: 2.5rem; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,.5); position: relative; background:#000; }
            .fade-in-up { animation: fadeInUp .8s ease-out; }
            @keyframes fadeInUp { from { opacity:0; transform: translateY(20px);} to {opacity:1; transform: translateY(0);} }
            .loader { border: 3px solid #f3f3f3; border-radius: 50%; border-top: 3px solid #1a4d7c; width: 20px; height: 20px; animation: spin 1s linear infinite; }
            @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
          `,
        }}
      />

      {/* Navigation */}
      <nav className="absolute w-full z-20 top-0 start-0 border-b border-white/10">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="/Liguster-logo-NEG.png" className="h-10 md:h-12" alt="Liguster Logo" />
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              onClick={() => setIsLoginOpen(true)}
              type="button"
              className="text-white bg-white/20 hover:bg-white/30 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all backdrop-blur-sm border border-white/40"
            >
              <i className="fa-solid fa-right-to-bracket mr-2" /> Log ind
            </button>
          </div>
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
                    "/Simulator Screenshot - iPhone 17 Pro Max - 2025-11-08 at 14.37.56.png",
                    "/Simulator Screenshot - iPhone 17 Pro Max - 2025-12-03 at 12.47.49.jpg",
                    "/Simulator Screenshot - iPhone 17 Pro Max - 2025-11-08 at 14.40.11.jpg",
                    "/Simulator Screenshot - iPhone 17 Pro Max - 2025-12-03 at 13.11.07.jpg",
                    "/Simulator Screenshot - iPhone 17 Pro Max - 2025-12-03 at 13.12.41.jpg",
                  ].map((src, idx) => (
                    <div key={src} className="min-w-full h-full bg-black flex items-center justify-center">
                      <img src={src} className="w-full h-full object-cover" alt={`Slide ${idx + 1}`} />
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                  {Array.from({ length: totalSlides }).map((_, index) => (
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

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            className="relative block w-[calc(100%+1.3px)] h-[60px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-gray-50"
            />
          </svg>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Et komplet system til din forening</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Liguster er designet til at gøre bestyrelsesarbejdet nemmere og naboskabet stærkere.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <i className="fa-solid fa-mobile-screen text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Native Apps</h3>
              <p className="text-gray-600">
                Oplev en lynhurtig brugerflade bygget specifikt til din telefon. Liguster findes som 100% native app til både
                <span className="font-semibold"> iOS (iPhone)</span> og <span className="font-semibold">Android</span>.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                <i className="fa-solid fa-tablet-screen-button text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Optimeret til Tablet</h3>
              <p className="text-gray-600">
                Liguster er designet med en unik brugerflade til iPad og Android tablets, der udnytter skærmpladsen til bedre overblik.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 mb-6">
                <i className="fa-solid fa-users text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Stærkt Fællesskab</h3>
              <p className="text-gray-600">
                Få nem adgang til referater, vedtægter og nabohjælp. Opret begivenheder og send push-beskeder når der er vigtigt nyt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Demo */}
      <section id="ai-demo" className="py-16 bg-gradient-to-br from-blue-50 to-white border-y border-blue-100 relative overflow-hidden">
        <div className="absolute top-10 right-10 text-yellow-400 text-6xl opacity-20 pointer-events-none">✨</div>
        <div className="absolute bottom-10 left-10 text-blue-300 text-8xl opacity-10 pointer-events-none">
          <i className="fa-solid fa-robot" />
        </div>

        <div className="max-w-screen-xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-bold tracking-wider text-sm uppercase">Nyhed</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">Liguster AI ✨</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Vi har integreret avanceret kunstig intelligens i Liguster-appen. Få hjælp til den svære nabokommunikation eller lad AI planlægge den næste vejfest.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("neighbor")}
                className={`flex-1 py-4 px-6 text-center font-semibold flex items-center justify-center gap-2 transition-colors ${
                  activeTab === "neighbor"
                    ? "text-blue-800 border-b-2 border-blue-600 bg-blue-50 hover:bg-blue-100"
                    : "text-gray-500 hover:text-blue-700 hover:bg-gray-50"
                }`}
              >
                <i className="fa-solid fa-hand-holding-heart" /> Den Digitale Mægler
              </button>
              <button
                onClick={() => setActiveTab("event")}
                className={`flex-1 py-4 px-6 text-center font-semibold flex items-center justify-center gap-2 transition-colors ${
                  activeTab === "event"
                    ? "text-blue-800 border-b-2 border-blue-600 bg-blue-50 hover:bg-blue-100"
                    : "text-gray-500 hover:text-blue-700 hover:bg-gray-50"
                }`}
              >
                <i className="fa-solid fa-champagne-glasses" /> Event Planlægger
              </button>
            </div>

            <div className="p-6 md:p-8">
              {activeTab === "neighbor" ? (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hvad er udfordringen?</label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none"
                      placeholder="F.eks.: Min nabos hæk er vokset ind over mit skur..."
                      value={neighborInput}
                      onChange={(e) => setNeighborInput(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-2">Vi bruger AI til at gøre beskeden venlig og konstruktiv.</p>
                    <button
                      onClick={handleNeighborGenerate}
                      disabled={loading}
                      className="mt-4 w-full bg-liguster hover-bg-liguster text-white font-bold py-3 px-4 rounded-lg shadow transition-colors flex items-center justify-center gap-2"
                    >
                      {loading ? <div className="loader" /> : <span>Generer Besked ✨</span>}
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 relative min-h-[200px]">
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Forslag til besked:</h4>
                    <TextRenderer text={neighborOutput} italic />
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Beskriv begivenheden</label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none"
                      placeholder="F.eks.: Sommerfest for 40 mennesker, budget på 2000 kr..."
                      value={eventInput}
                      onChange={(e) => setEventInput(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-2">Få 3 konkrete forslag til tema og aktiviteter.</p>
                    <button
                      onClick={handleEventGenerate}
                      disabled={loading}
                      className="mt-4 w-full bg-liguster hover-bg-liguster text-white font-bold py-3 px-4 rounded-lg shadow transition-colors flex items-center justify-center gap-2"
                    >
                      {loading ? <div className="loader" /> : <span>Få Idéer ✨</span>}
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 relative min-h-[200px]">
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Idéer fra AI:</h4>
                    <TextRenderer text={eventOutput} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer (kort) */}
      <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-screen-xl mx-auto px-4 text-xs text-center">
          &copy; 2025 Liguster Systemer ApS. Alle rettigheder forbeholdes.
        </div>
      </footer>

      {/* Login Modal */}
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
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="flex flex-col items-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                    <i className="fa-solid fa-user text-blue-600" />
                  </div>
                  <div className="w-full text-center">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">Log ind på Liguster</h3>
                    <p className="text-sm text-gray-500 mb-6">Indtast dine oplysninger for at tilgå foreningens data.</p>

                    <form className="space-y-4 text-left">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                          placeholder="navn@forening.dk"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Adgangskode</label>
                        <input
                          type="password"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                          placeholder="********"
                        />
                      </div>
                      <button
                        type="button"
                        className="w-full flex justify-center rounded-md bg-liguster px-3 py-2 text-sm font-semibold text-white shadow-sm hover-bg-liguster transition-colors"
                      >
                        Log ind
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 flex justify-center">
                <p className="text-xs text-gray-500">
                  Har din