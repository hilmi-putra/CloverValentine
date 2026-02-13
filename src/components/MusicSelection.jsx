import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

const tracks = [
  {
    title: "Beautiful",
    artist: "Bazzi feat. Camila Cabello",
    src: "/music/Bazzi feat. Camila Cabello - Beautiful [Official Music Video].mp3",
    cover: "https://res.cloudinary.com/dahvjvesd/image/upload/v1770810906/beautiful_levas9.svg",
    duration: "3:00",
    gradient: "from-amber-200 to-yellow-500"
  },
  {
    title: "JoyRide",
    artist: "CORTIS (코르티스)",
    src: "/music/CORTIS (코르티스) 'JoyRide' Official MV.mp3",
    cover: "https://res.cloudinary.com/dahvjvesd/image/upload/v1770810906/joyride_rm0ock.svg",
    duration: "2:50",
    gradient: "from-blue-400 to-indigo-600"
  },
  {
    title: "Disillusioned",
    artist: "Daniel Caesar",
    src: "/music/Daniel Caesar - Disillusioned (Official Audio).mp3",
    cover: "https://res.cloudinary.com/dahvjvesd/image/upload/v1770810906/Disillusioned_m8mazk.svg",
    duration: "4:01",
    gradient: "from-neutral-700 to-neutral-900"
  },
  {
    title: "Soft",
    artist: "LANY",
    src: "/music/LANY - Soft (Official Lyric Video).mp3",
    cover: "https://res.cloudinary.com/dahvjvesd/image/upload/v1770810908/soft_wkyvmu.svg",
    duration: "2:58",
    gradient: "from-rose-100 to-teal-100"
  },
  {
    title: "Stuck",
    artist: "LANY",
    src: "/music/LANY - Stuck (Official Lyric Video).mp3",
    cover: "https://res.cloudinary.com/dahvjvesd/image/upload/v1770810907/stuck_l8nrf9.svg",
    duration: "3:03",
    gradient: "from-violet-200 to-pink-200"
  }
];

const MusicSelection = ({ onSelect }) => {
  const containerRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    // Intro animation
    const tl = gsap.timeline();
    
    tl.fromTo(containerRef.current, 
      { opacity: 0 },
      { opacity: 1, duration: 1 }
    )
    .fromTo(".header-text",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.5"
    )
    .fromTo(".track-item", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.2)" },
      "-=0.4"
    );

  }, []);

  const handleSelect = (track) => {
    // Exit animation
    gsap.to(containerRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.8,
      ease: "power2.in",
      onComplete: () => onSelect(track)
    });
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 bg-[#121212] text-white overflow-y-auto font-sans flex flex-col items-center">
      <div className="w-full max-w-4xl p-8 pt-20">
        <h1 className="header-text text-4xl font-bold mb-2 tracking-tight">Choose Your Vibe</h1>
        <p className="header-text text-gray-400 mb-10 text-sm">Select a soundtrack for our journey</p>

        <div className="grid gap-4">
          {/* Header Row */}
          <div className="header-text grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-2 text-xs uppercase text-gray-400 border-b border-gray-800 mb-2">
            <span className="w-8">#</span>
            <span>Title</span>
            <span className="hidden md:block">Duration</span>
          </div>

          {tracks.map((track, index) => (
            <div 
              key={index}
              className="track-item group relative grid grid-cols-[auto_1fr_auto] gap-4 items-center px-4 py-3 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleSelect(track)}
            >
              {/* Index / Play Icon */}
              <div className="w-8 text-gray-400 text-sm font-light relative flex items-center justify-center">
                 <span className={`absolute transition-opacity duration-200 ${hoveredIndex === index ? 'opacity-0' : 'opacity-100'}`}>
                    {index + 1}
                 </span>
                 <span className={`absolute text-white transition-opacity duration-200 ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}`}>
                    {/* SVG Play Icon */}
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                 </span>
              </div>

              {/* Title & Artist */}
              <div className="flex items-center gap-4">
                 {/* Album Art / Gradient */}
                 <div className={`w-10 h-10 flex-shrink-0 bg-gradient-to-br ${track.gradient || 'from-emerald-800 to-gray-900'} rounded shadow-sm flex items-center justify-center overflow-hidden relative`}>
                    {track.cover ? (
                        <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-[10px] text-black/30 mix-blend-overlay">♫</span>
                    )}
                 </div>
                 <div className="flex flex-col">
                    <span className={`font-medium text-base ${hoveredIndex === index ? 'text-emerald-400' : 'text-white'} transition-colors`}>{track.title}</span>
                    <span className="text-sm text-gray-400">{track.artist}</span>
                 </div>
              </div>

               {/* Duration */}
               <div className="text-sm text-gray-400 hidden md:block font-light">
                  {track.duration}
               </div>

               {/* Right Arrow for Mobile */}
                <div className="md:hidden text-gray-500">
                    →
                </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background Gradient similar to Spotify */}
      <div className="fixed top-0 left-0 w-full h-80 bg-gradient-to-b from-emerald-900/40 to-[#121212] -z-10 pointer-events-none"></div>
    </div>
  );
};


export default MusicSelection;
