import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  VolumeX,
  Volume2,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles,
  Eye,
  X,
  Share2,
} from "lucide-react";

export default function App() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // 0 = Cover, 1 = Welcome & Calendar, 2 = Functions, 3 = RSVP
  const [isOpeningCover, setIsOpeningCover] = useState(false);
  const [particles, setParticles] = useState([]);
  const [showCardModal, setShowCardModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const audioRef = useRef(null);

  // Generate floating flower petals and golden sparkles
  useEffect(() => {
    const petalColors = [
      { fill: "#FFF9F0", stroke: "#E6D7C3", type: "jasmine" }, // Jasmine / White floral
      { fill: "#FBBF24", stroke: "#D97706", type: "marigold" }, // Marigold gold
      { fill: "#F472B6", stroke: "#DB2777", type: "rose" }, // Pink rose petal
      { fill: "#FDE047", stroke: "#CA8A04", type: "sparkle" }, // Golden sparkle
    ];

    const generated = Array.from({ length: 36 }).map((_, i) => {
      const chosen = petalColors[i % petalColors.length];
      return {
        id: i,
        size: Math.random() * 12 + 10, // 10px to 22px
        left: Math.random() * 100,
        delay: Math.random() * -18,
        duration: Math.random() * 8 + 10, // 10s to 18s
        rotation: Math.random() * 360,
        opacity: Math.random() * 0.4 + 0.5,
        ...chosen,
      };
    });
    setParticles(generated);
  }, []);

  // Audio handler with user gesture fallback
  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current
          .play()
          .then(() => {
            setMusicPlaying(true);
            document.removeEventListener("click", playAudio);
            document.removeEventListener("touchstart", playAudio);
          })
          .catch((err) => {
            console.log("Autoplay prevented:", err);
          });
      }
    };

    playAudio();
    document.addEventListener("click", playAudio);
    document.addEventListener("touchstart", playAudio);

    return () => {
      document.removeEventListener("click", playAudio);
      document.removeEventListener("touchstart", playAudio);
    };
  }, []);

  // WhatsApp RSVP details
  const whatsappNumber = "917994263529";
  const messageYes =
    "Namaskaram! I am pleased to confirm my presence for Sooraj & Akhila's Wedding on 22nd November 2026. Looking forward to blessing the couple!";
  const messageNo =
    "Namaskaram! I regret that I will be unable to attend Sooraj & Akhila's wedding. Heartiest congratulations and best wishes to the couple!";

  // Countdown to Muhoortham: Nov 22, 2026 at 10:30 AM IST
  useEffect(() => {
    const weddingDate = new Date("2026-11-22T10:30:00");
    const updateCountdown = () => {
      const now = new Date();
      const difference = weddingDate - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showCardModal) return;
      if (e.key === "ArrowRight") {
        if (currentPage === 0) handleOpenCover();
        else nextPage();
      } else if (e.key === "ArrowLeft") {
        prevPage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, showCardModal]);

  const handleOpenCover = () => {
    setIsOpeningCover(true);
    setTimeout(() => {
      setCurrentPage(1);
      setIsOpeningCover(false);
    }, 1100);
  };

  const toggleMusic = (e) => {
    e?.stopPropagation();
    if (audioRef.current) {
      if (musicPlaying) {
        audioRef.current.pause();
        setMusicPlaying(false);
      } else {
        audioRef.current.play().then(() => setMusicPlaying(true));
      }
    }
  };

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, 3));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  // Google Maps navigation handler
  const handleNavigateTemple = () => {
    const templeLocation = encodeURIComponent(
      "Podippur Sree Madeva Temple, Poovathumchola, Kozhikode, Kerala"
    );
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${templeLocation}`,
      "_blank"
    );
  };

  // Share invite link handler
  const handleShare = async () => {
    const shareData = {
      title: "Wedding Invitation | Sooraj & Akhila",
      text: "With great joy, you are warmly invited to the wedding of Sooraj & Akhila on Sunday, 22nd November 2026!",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled or failed", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Touch and Drag swipe tracking
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (isOpeningCover || showCardModal) return;
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;

    if (Math.abs(deltaX) > 45 && Math.abs(deltaY) < 90) {
      if (deltaX < 0) {
        if (currentPage === 0) handleOpenCover();
        else nextPage();
      } else {
        prevPage();
      }
    }
  };

  const handleMouseDown = (e) => {
    if (e.target.closest("button") || e.target.closest("a") || showCardModal) return;
    touchStartX.current = e.clientX;
    touchStartY.current = e.clientY;
    isDragging.current = true;
  };

  const handleMouseUp = (e) => {
    if (!isDragging.current || isOpeningCover || showCardModal) return;
    isDragging.current = false;
    const deltaX = touchStartX.current - e.clientX;
    const deltaY = touchStartY.current - e.clientY;

    if (Math.abs(deltaX) > 45 && Math.abs(deltaY) < 90) {
      if (deltaX < 0) {
        if (currentPage === 0) handleOpenCover();
        else nextPage();
      } else {
        prevPage();
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#2D3B2D] font-sans selection:bg-[#EADBBE] relative overflow-x-hidden">
      {/* Background Audio */}
      <audio
        ref={audioRef}
        src="/wedding-song.mp3"
        loop
        preload="auto"
        onError={(e) => console.log("Audio Error:", e)}
      />

      {/* Floating Petals & Golden Sparkles */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute top-[-30px] animate-petal-fall"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              transform: `rotate(${p.rotation}deg)`,
            }}
          >
            {p.type === "sparkle" ? (
              <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-sm">
                <path
                  d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9Z"
                  fill={p.fill}
                  opacity="0.85"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 30 30" className="w-full h-full drop-shadow-sm">
                <path
                  d="M15,2 C22,6 27,15 25,23 C20,27 10,27 5,23 C3,15 8,6 15,2 Z"
                  fill={p.fill}
                  stroke={p.stroke}
                  strokeWidth="0.8"
                />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Main Interactive Stage */}
      <div
        className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-5 relative overflow-hidden bg-gradient-to-b from-[#FAF7F0] via-[#F4EFEB] to-[#FAF7F0]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {/* Subtle Rotating Golden Mandala Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-10 overflow-hidden">
          <svg
            className="w-[180vw] h-[180vw] md:w-[90vh] md:h-[90vh] text-[#C5A04F] stroke-current fill-none animate-spin"
            style={{ animationDuration: "180s" }}
            strokeWidth="0.6"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="46" />
            <circle cx="50" cy="50" r="39" />
            <circle cx="50" cy="50" r="28" />
            <polygon points="50,4 62,38 96,50 62,62 50,96 38,62 4,50 38,38" />
            <polygon
              points="50,4 62,38 96,50 62,62 50,96 38,62 4,50 38,38"
              transform="rotate(45 50 50)"
            />
            <path
              d="M50,20 C55,30 65,35 65,50 C65,65 55,70 50,80 C45,70 35,65 35,50 C35,35 45,30 50,20 Z"
              strokeWidth="0.5"
            />
          </svg>
        </div>

        {/* Top Floating Controls */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            aria-label="Share Invitation"
            className="bg-white/90 text-[#3D4F38] p-2.5 rounded-full shadow-md border border-[#C5A04F]/30 hover:scale-105 transition-all flex items-center justify-center cursor-pointer backdrop-blur-sm"
          >
            <Share2 size={18} />
          </button>

          {/* Audio Visualizer Button */}
          <button
            onClick={toggleMusic}
            aria-label="Toggle Music"
            className="bg-[#2D3B2D] text-[#FAF7F0] p-2.5 rounded-full shadow-lg border border-[#C5A04F]/40 hover:scale-105 transition-all flex items-center justify-center cursor-pointer"
            style={{ width: "42px", height: "42px" }}
          >
            {musicPlaying ? (
              <div className="flex items-end gap-[2.5px] h-3.5 w-3.5 justify-center">
                <span className="w-[2px] bg-[#FAF7F0] rounded-full animate-bar-1 h-full"></span>
                <span className="w-[2px] bg-[#FAF7F0] rounded-full animate-bar-2 h-full"></span>
                <span className="w-[2px] bg-[#FAF7F0] rounded-full animate-bar-3 h-full"></span>
              </div>
            ) : (
              <VolumeX size={18} />
            )}
          </button>
        </div>

        {/* Copied Link Toast */}
        {copiedLink && (
          <div className="fixed top-16 right-4 z-50 bg-[#2D3B2D] text-white text-xs font-semibold py-1.5 px-3 rounded-full shadow-lg border border-[#C5A04F]/40 animate-fade-in">
            Link copied to clipboard!
          </div>
        )}

        {/* Book Container with 3D Perspective */}
        <div className="max-w-[420px] w-full relative z-10 flex flex-col justify-between min-h-[580px] sm:min-h-[620px] h-[82vh] max-h-[720px] book-perspective">
          {/* Main Book Surface */}
          <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl border border-[#C5A04F]/35 paper-page z-10 overflow-hidden flex flex-col">
            {/* Elegant Corner Filigree Accents */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#C5A04F]/50 rounded-tl-md pointer-events-none z-35"></div>
            <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#C5A04F]/50 rounded-tr-md pointer-events-none z-35"></div>
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#C5A04F]/50 rounded-bl-md pointer-events-none z-35"></div>
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#C5A04F]/50 rounded-br-md pointer-events-none z-35"></div>

            {/* Header: Page Navigation Indicator */}
            <div className="absolute top-4 left-5 right-5 flex justify-between items-center border-b border-[#C5A04F]/25 pb-2.5 z-35 pointer-events-none">
              <span className="text-[10px] tracking-[0.22em] font-sans font-bold text-[#8A9681] uppercase flex items-center gap-1.5">
                <Sparkles size={11} className="text-[#C5A04F]" />
                Wedding Invitation
              </span>
              <span className="text-xs font-sans font-bold text-[#C5A04F] bg-[#FAF7F0] px-2 py-0.5 rounded-full border border-[#C5A04F]/20">
                Page {currentPage === 0 ? 1 : currentPage} of 3
              </span>
            </div>

            {/* Page Content Layers Stack */}
            <div className="absolute inset-0 z-10">
              {/* ========================================================= */}
              {/* PAGE 3: RSVP, Wishes & Card View (Bottom Layer) */}
              {/* ========================================================= */}
              <div
                className="absolute inset-0 flex flex-col justify-between bg-white p-5 pt-14 pb-16 book-page-layer book-page-closed"
                style={{ zIndex: 10 }}
              >
                <div className="text-center space-y-3 my-auto">
                  <div>
                    <span className="uppercase tracking-[0.25em] text-[10px] text-[#C5A04F] font-bold font-sans">
                      RSVP
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-[#2D3B2D] mt-0.5">
                      Will You Attend?
                    </h3>
                    <div className="w-12 h-0.5 bg-[#C5A04F]/50 mx-auto mt-1.5"></div>
                  </div>

                  <p className="text-[#3B4830] font-sans font-medium text-xs max-w-xs mx-auto leading-relaxed">
                    Kindly let us know if you can join our celebration. Your
                    presence and blessings will make our special day truly
                    memorable.
                  </p>

                  {/* WhatsApp RSVP Buttons */}
                  <div className="flex flex-col gap-2.5 py-1 max-w-xs mx-auto w-full">
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                        messageYes
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:scale-[1.02] transition-all font-sans"
                    >
                      <CheckCircle2 size={16} />
                      Yes, Will Attend with Joy
                    </a>

                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                        messageNo
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-white text-[#2D3B2D] hover:bg-[#FAF7F0] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold border border-[#2D3B2D]/40 shadow-sm hover:scale-[1.02] transition-all font-sans"
                    >
                      <XCircle size={16} />
                      Unable to Attend
                    </a>

                    {/* View Original Invitation Card Button */}
                    <button
                      onClick={() => setShowCardModal(true)}
                      className="flex items-center justify-center gap-2 bg-[#FAF7F0] hover:bg-[#F4EFEB] text-[#C5A04F] py-2.5 px-4 rounded-xl text-xs font-bold border border-[#C5A04F]/40 shadow-sm transition-all cursor-pointer font-sans"
                    >
                      <Eye size={15} />
                      View Original Invitation Card
                    </button>
                  </div>

                  {/* Traditional Closing Blessing */}
                  <div className="pt-2 border-t border-[#C5A04F]/20 max-w-xs mx-auto">
                    <p className="text-xs font-serif text-[#C5A04F] tracking-wide font-medium">
                      ॥ शुभ विवाह • Mangalyam Thanthunanena ॥
                    </p>
                    <p className="text-[10px] text-[#7A8871] font-sans font-semibold mt-1">
                      "Your presence is our greatest gift."
                    </p>
                    <div className="mt-1">
                      <span className="text-xl font-display font-bold text-[#2D3B2D] tracking-wider">
                        SOORAJ & AKHILA
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================================= */}
              {/* PAGE 2: Auspicious Functions & Venues (Middle Layer) */}
              {/* ========================================================= */}
              <div
                className={`absolute inset-0 flex flex-col justify-between bg-white p-5 pt-13 pb-16 book-page-layer ${
                  currentPage >= 3 ? "book-page-open" : "book-page-closed"
                }`}
                style={{ zIndex: 20 }}
              >
                <div className="space-y-2.5 my-auto">
                  <div className="text-center">
                    <span className="uppercase tracking-[0.2em] text-[9px] text-[#C5A04F] font-bold">
                      Auspicious Occasion
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#2D3B2D]">
                      Wedding Events
                    </h3>
                  </div>

                  {/* Event 1: Muhoortham */}
                  <div className="bg-[#FAF7F0] p-3 rounded-2xl border border-[#C5A04F]/30 shadow-xs relative overflow-hidden">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="bg-[#2D3B2D] text-[#FAF7F0] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Main Ceremony
                      </span>
                      <span className="text-[11px] font-bold text-[#C5A04F] font-serif">
                        MUHOORTHAM
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-[#2D3B2D]">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-[#C5A04F] shrink-0" />
                        <span className="font-semibold">
                          Sunday, 22nd November 2026
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-[#C5A04F] shrink-0" />
                        <span className="font-semibold">
                          10:30 AM to 11:30 AM
                        </span>
                      </div>
                      <div className="flex items-start gap-2 pt-0.5">
                        <MapPin size={14} className="text-[#C5A04F] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-[11px]">
                            Podippur Sree Madeva Temple
                          </p>
                          <p className="text-[10px] text-[#6B7862] leading-tight">
                            Poovathumchola, Kozhikode, Kerala
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons for Ceremony */}
                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#C5A04F]/20">
                      <button
                        onClick={handleNavigateTemple}
                        className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#2D3B2D] hover:bg-[#3D4F38] text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        <MapPin size={12} /> Navigate Map
                      </button>
                      <a
                        href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Sooraj+%26+Akhila+Wedding+Muhoortham&dates=20261122T050000Z/20261122T060000Z&details=With+great+joy%2C+you+are+warmly+invited+to+attend+the+Muhoortham+ceremony+of+Sooraj+%26+Akhila+at+Podippur+Sree+Madeva+Temple%2C+Poovathumchola.&location=Podippur+Sree+Madeva+Temple%2C+Poovathumchola%2C+Kozhikode%2C+Kerala"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-1.5 px-2 border border-[#C5A04F]/60 text-[#2D3B2D] hover:bg-[#F4EFEB] text-[10px] font-bold rounded-lg transition-colors"
                      >
                        <Calendar size={12} /> Add Calendar
                      </a>
                    </div>
                  </div>

                  {/* Event 2: Reception */}
                  <div className="bg-[#FAF7F0] p-3 rounded-2xl border border-[#C5A04F]/30 shadow-xs relative">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="bg-[#C5A04F] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Celebration
                      </span>
                      <span className="text-[11px] font-bold text-[#2D3B2D] font-serif">
                        WEDDING RECEPTION
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-[#2D3B2D]">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-[#C5A04F] shrink-0" />
                        <span className="font-semibold">
                          Tuesday, 24th November 2026
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-[#C5A04F] shrink-0" />
                        <span className="font-semibold">
                          5:00 PM to 8:00 PM
                        </span>
                      </div>
                      <div className="flex items-start gap-2 pt-0.5">
                        <MapPin size={14} className="text-[#C5A04F] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-[11px]">At Our Residence</p>
                          <p className="text-[9px] text-[#6B7862] leading-tight">
                            Warmly invite you to join us for dinner and blessings
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-[#C5A04F]/20 text-center">
                      <a
                        href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Sooraj+%26+Akhila+Wedding+Reception&dates=20261124T113000Z/20261124T143000Z&details=With+great+joy%2C+we+warmly+invite+you+to+attend+our+Wedding+Reception+on+Tuesday%2C+24th+November+2026+from+5%3A00+PM+to+8%3A00+PM.&location=At+our+residence"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 border border-[#C5A04F]/60 text-[#2D3B2D] hover:bg-[#F4EFEB] text-[10px] font-bold rounded-lg transition-colors w-full"
                      >
                        <Calendar size={12} /> Add Reception to Calendar
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================================= */}
              {/* PAGE 1: Welcome, Couple & Mini Calendar (Top Inside Layer) */}
              {/* ========================================================= */}
              <div
                className={`absolute inset-0 flex flex-col justify-between bg-white p-4 sm:p-5 pt-13 pb-16 book-page-layer ${
                  currentPage >= 2 ? "book-page-open" : "book-page-closed"
                }`}
                style={{ zIndex: 30 }}
              >
                <div className="text-center space-y-2.5 my-auto">
                  {/* Auspicious Hindu Blessing */}
                  <div className="space-y-0.5">
                    <p className="text-base sm:text-lg text-[#C5A04F] font-serif tracking-widest font-bold">
                      ॥ श्री गणेशाय नमः ॥
                    </p>
                    <p className="text-[8px] uppercase tracking-[0.2em] text-[#8A9681] font-bold">
                      Om Shree Ganeshaya Namaha
                    </p>
                  </div>

                  {/* Save the Date script */}
                  <div>
                    <span className="font-cursive text-2xl sm:text-3xl text-[#C5A04F] block -mb-1">
                      save the date
                    </span>
                    <h2 className="font-display font-bold text-xl sm:text-2xl tracking-[0.15em] text-[#2D3B2D]">
                      SOORAJ & AKHILA
                    </h2>
                    {/* Golden decorative divider */}
                    <div className="flex items-center justify-center gap-2 my-1">
                      <div className="w-8 h-[1px] bg-[#C5A04F]/40"></div>
                      <Heart size={10} className="text-[#C5A04F] fill-[#C5A04F]" />
                      <div className="w-8 h-[1px] bg-[#C5A04F]/40"></div>
                    </div>
                  </div>

                  {/* Calendar Widget Replica of the Invitation Card */}
                  <div className="bg-[#FAF7F0] rounded-xl p-2 sm:p-2.5 border border-[#C5A04F]/30 max-w-[280px] mx-auto shadow-xs">
                    <p className="text-[9px] font-bold tracking-[0.25em] text-[#2D3B2D] uppercase mb-1">
                      NOVEMBER 2026
                    </p>

                    {/* Days Header */}
                    <div className="grid grid-cols-7 text-[8px] font-bold text-[#8A9681] mb-1">
                      <span>S</span>
                      <span>M</span>
                      <span>T</span>
                      <span>W</span>
                      <span>T</span>
                      <span>F</span>
                      <span>S</span>
                    </div>

                    {/* Calendar Grid matching the card */}
                    <div className="grid grid-cols-7 gap-y-1 text-[9px] font-semibold text-[#2D3B2D]">
                      {/* Row 1 */}
                      <span></span>
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5</span>
                      <span>7</span>

                      {/* Row 2 */}
                      <span>8</span>
                      <span>9</span>
                      <span>10</span>
                      <span>11</span>
                      <span>12</span>
                      <span>13</span>
                      <span>14</span>

                      {/* Row 3 */}
                      <span>15</span>
                      <span>16</span>
                      <span>17</span>
                      <span>18</span>
                      <span>19</span>
                      <span>20</span>
                      <span>21</span>

                      {/* Row 4 - with 22 Highlighted Heart! */}
                      <span className="relative flex items-center justify-center">
                        <span className="absolute inset-0 bg-[#F472B6]/40 rounded-full scale-125 animate-pulse"></span>
                        <span className="relative font-bold text-[#DB2777] z-10">
                          22
                        </span>
                      </span>
                      <span>23</span>
                      <span className="relative flex items-center justify-center">
                        <span className="absolute inset-0 border border-[#C5A04F] rounded-full scale-110"></span>
                        <span className="relative text-[#C5A04F] font-bold z-10">
                          24
                        </span>
                      </span>
                      <span>25</span>
                      <span>26</span>
                      <span>27</span>
                      <span>28</span>

                      {/* Row 5 */}
                      <span>29</span>
                      <span>30</span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>

                    <div className="flex items-center justify-center gap-3 mt-1.5 pt-1 border-t border-[#C5A04F]/20 text-[8px]">
                      <span className="flex items-center gap-1 text-[#DB2777] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DB2777]"></span>
                        Nov 22: Muhoortham
                      </span>
                      <span className="flex items-center gap-1 text-[#C5A04F] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A04F]"></span>
                        Nov 24: Reception
                      </span>
                    </div>
                  </div>

                  {/* Countdown Timer */}
                  <div className="pt-1">
                    <p className="text-[8px] tracking-[0.2em] text-[#C5A04F] font-bold uppercase mb-1">
                      Countdown to Muhoortham
                    </p>
                    <div className="grid grid-cols-4 gap-1.5 max-w-[260px] mx-auto">
                      {[
                        { val: timeLeft.days, label: "Days" },
                        { val: timeLeft.hours, label: "Hours" },
                        { val: timeLeft.minutes, label: "Mins" },
                        { val: timeLeft.seconds, label: "Secs" },
                      ].map((t, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center p-1.5 bg-[#FAF7F0] rounded-xl border border-[#C5A04F]/30 shadow-xs"
                        >
                          <span className="text-sm font-bold font-sans text-[#2D3B2D]">
                            {String(t.val).padStart(2, "0")}
                          </span>
                          <span className="text-[7px] font-sans text-[#8A9681] font-bold uppercase">
                            {t.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Navigation Controls (Visible on Pages 1, 2, 3) */}
            <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center border-t border-[#C5A04F]/25 pt-2.5 z-35">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className={`flex items-center gap-1 text-[#2D3B2D] font-sans font-bold text-xs uppercase tracking-wider transition-opacity cursor-pointer ${
                  currentPage === 0
                    ? "opacity-20 pointer-events-none"
                    : "hover:text-[#C5A04F]"
                }`}
              >
                <ChevronLeft size={16} /> Back
              </button>

              {/* Page dots indicator */}
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map((dot) => (
                  <button
                    key={dot}
                    onClick={() => setCurrentPage(dot)}
                    aria-label={`Go to page ${dot}`}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      currentPage === dot
                        ? "w-5 bg-[#C5A04F]"
                        : "w-1.5 bg-[#C5A04F]/30 hover:bg-[#C5A04F]/60"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage === 3 || currentPage === 0}
                className={`flex items-center gap-1 text-[#2D3B2D] font-sans font-bold text-xs uppercase tracking-wider transition-opacity cursor-pointer ${
                  currentPage === 3 || currentPage === 0
                    ? "opacity-20 pointer-events-none"
                    : "hover:text-[#C5A04F]"
                }`}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* COVER PAGE (Page 0 Overlay) */}
          {/* ========================================================= */}
          {currentPage === 0 && (
            <div
              onClick={handleOpenCover}
              className={`absolute inset-0 bg-[#FAF7F0] rounded-3xl shadow-2xl z-20 overflow-hidden border-2 border-[#C5A04F]/40 book-cover-wrapper flex flex-col justify-between p-4 cursor-pointer group ${
                isOpeningCover ? "book-cover-open" : ""
              }`}
              style={{
                backgroundImage: "url('/sooraj-akhila-card.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Golden Frame Border Overlay */}
              <div className="absolute inset-2 border border-[#C5A04F]/40 rounded-2xl pointer-events-none"></div>

              {/* Top Hint Bar */}
              <div className="flex justify-between items-center z-10">
                <span className="text-[9px] uppercase tracking-widest font-bold text-[#2D3B2D] bg-[#FAF7F0]/90 px-2.5 py-1 rounded-full border border-[#C5A04F]/30 backdrop-blur-xs">
                  Auspicious Invite
                </span>
                <span className="text-[9px] font-bold text-[#2D3B2D] bg-[#FAF7F0]/90 px-2 py-1 rounded-full border border-[#C5A04F]/30 backdrop-blur-xs">
                  2026
                </span>
              </div>

              {/* Bottom Interactive Invitation Banner */}
              <div className="z-10 text-center mb-1">
                <div className="inline-flex items-center gap-2 bg-[#2D3B2D]/95 text-[#FAF7F0] border border-[#C5A04F]/60 py-2.5 px-5 rounded-full shadow-xl transform group-hover:scale-105 transition-all">
                  <Sparkles size={14} className="text-[#C5A04F] animate-spin" style={{ animationDuration: "6s" }} />
                  <span className="text-xs uppercase tracking-[0.18em] font-bold">
                    Tap to Open Invitation
                  </span>
                  <ChevronRight size={14} className="text-[#C5A04F]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Controls / Hint footer */}
        <div className="mt-4 text-center text-xs text-[#7A8871] font-sans relative z-10 flex flex-col items-center gap-1">
          <p className="flex items-center gap-1.5">
            <span>Swipe or click Next to explore</span>
            <span>•</span>
            <button
              onClick={() => setShowCardModal(true)}
              className="text-[#C5A04F] underline hover:text-[#2D3B2D] font-semibold cursor-pointer"
            >
              View Full Card
            </button>
          </p>
          <p className="text-[10px] tracking-widest opacity-60">
            SOORAJ & AKHILA • NOVEMBER 2026
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* FULL CARD LIGHTBOX MODAL */}
      {/* ========================================================= */}
      {showCardModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
          onClick={() => setShowCardModal(false)}
        >
          <div
            className="relative max-w-lg w-full max-h-[90vh] bg-[#FAF7F0] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3.5 border-b border-[#C5A04F]/30 bg-white">
              <h4 className="font-serif font-bold text-sm text-[#2D3B2D] flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#C5A04F]" />
                Wedding Invitation Card
              </h4>
              <button
                onClick={() => setShowCardModal(false)}
                className="text-gray-500 hover:text-black p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Image Display */}
            <div className="overflow-y-auto p-2 flex items-center justify-center bg-[#FAF7F0]">
              <img
                src="/sooraj-akhila-card.webp"
                alt="Sooraj & Akhila Wedding Invitation Card"
                className="w-full h-auto rounded-lg shadow-md border border-[#C5A04F]/20 object-contain max-h-[75vh]"
              />
            </div>

            {/* Modal Actions */}
            <div className="p-3 border-t border-[#C5A04F]/30 bg-white flex justify-between items-center text-xs">
              <span className="text-[#6B7862] font-semibold">
                Sooraj & Akhila
              </span>
              <a
                href="/sooraj-akhila-card.webp"
                download="Sooraj_Akhila_Wedding_Invitation.jpg"
                className="bg-[#2D3B2D] hover:bg-[#3D4F38] text-white px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors"
              >
                Save Image
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
