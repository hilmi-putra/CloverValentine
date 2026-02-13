import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ShaderBackground from './ShaderBackground';

// Reusing Static Clover SVG Component
const StaticClover = ({ className, style }) => (
    <div className={className} style={style}>
        <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible drop-shadow-lg">
            <defs>
                <linearGradient id="leafGradientStatic" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#86efac" />
                    <stop offset="100%" stopColor="#15803d" />
                </linearGradient>
            </defs>
            {/* Stem */}
            <path 
                d="M 100 100 Q 120 180 180 200" 
                fill="none" 
                stroke="#14532d" 
                strokeWidth="4" 
                strokeLinecap="round"
            />
            {/* Leaves Group */}
            <g transform="translate(100, 100)">
                 {/* Top Left */}
                 <path d="M 0 0 C -40 -30 -80 -60 -50 -80 C -30 -95 -5 -65 0 -55 C 5 -65 30 -95 50 -80 C 80 -60 40 -30 0 0" fill="url(#leafGradientStatic)" transform="rotate(-90)" />
                 {/* Top Right */}
                 <path d="M 0 0 C -40 -30 -80 -60 -50 -80 C -30 -95 -5 -65 0 -55 C 5 -65 30 -95 50 -80 C 80 -60 40 -30 0 0" fill="url(#leafGradientStatic)" transform="rotate(0)" />
                 {/* Bottom Right */}
                 <path d="M 0 0 C -40 -30 -80 -60 -50 -80 C -30 -95 -5 -65 0 -55 C 5 -65 30 -95 50 -80 C 80 -60 40 -30 0 0" fill="url(#leafGradientStatic)" transform="rotate(90)" />
                 {/* Bottom Left */}
                 <path d="M 0 0 C -40 -30 -80 -60 -50 -80 C -30 -95 -5 -65 0 -55 C 5 -65 30 -95 50 -80 C 80 -60 40 -30 0 0" fill="url(#leafGradientStatic)" transform="rotate(180)" />
            </g>
            {/* Center Dot */}
            <circle cx="100" cy="100" r="12" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
        </svg>
    </div>
);

const Hero = () => {
  const containerRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // 1. Entrance: Card pops in
    tl.fromTo(cardRef.current,
      { y: 100, opacity: 0, scale: 0.9, rotation: -5 },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1, 
        rotation: -2, // End at the slight tilt design
        duration: 1.5, 
        ease: "elastic.out(1, 0.75)" 
      }
    );

    // 2. Elements Inside Stagger In
    const q = gsap.utils.selector(cardRef.current);
    tl.fromTo(q(".hero-text-anim"), 
        { y: 20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.2, ease: "back.out(1.7)" },
        "-=0.5"
    );

    // 3. Subtle Floating/Breathing Loop
    gsap.to(cardRef.current, {
        y: "-=10",
        rotation: "-=1",
        duration: 4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 0.5
    });

  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-emerald-950 flex items-center justify-center">
      <ShaderBackground />
      
      {/* Loose Clovers (Static Background Decorations) */}
      <StaticClover className="absolute top-[10%] left-[10%] w-20 md:w-32 opacity-60 rotate-12 blur-[1px]" />
      <StaticClover className="absolute bottom-[20%] right-[15%] w-24 md:w-40 opacity-50 -rotate-12 blur-[2px]" />
      <StaticClover className="absolute top-[40%] right-[5%] w-16 opacity-40 rotate-45 blur-[1px]" />
      <StaticClover className="absolute bottom-[10%] left-[20%] w-20 opacity-30 -rotate-6" />

      {/* Main Postcard Container Wrapper for Rotation */}
      <div ref={cardRef} className="postcard-container relative z-10 w-full max-w-lg md:max-w-3xl transform -rotate-2 p-6 origin-center">
         
         {/* Shadow/Paper Stack Effect behind */}
         <div className="absolute inset-0 bg-white/90 translate-x-3 translate-y-3 md:translate-x-6 md:translate-y-6 rotate-3 rounded-sm shadow-2xl pointer-events-none"></div>
         
         {/* Main Card */}
         <div className="relative bg-[#fdfbf7] w-full aspect-[4/3] md:aspect-[3/2] p-6 md:p-12 rounded-sm shadow-2xl flex flex-col items-center justify-center text-center overflow-hidden border border-stone-200">
             
             {/* Paper Texture Overlay */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>

             {/* Top Details (Date/Stamp) */}
             <div className="w-full flex justify-between items-start absolute top-6 left-0 px-6 md:px-12 text-emerald-900/40 font-serif text-xs md:text-sm tracking-widest uppercase">
                 <span>Saturday</span>
                 <div className="flex flex-col items-end">
                    <span>9am - 4pm</span>
                    {/* Decorative Stamp Area */}
                    <div className="w-12 h-16 border border-emerald-900/10 mt-2 flex items-center justify-center bg-stone-100 rotate-6 shadow-sm">
                         <div className="w-8 h-10 bg-emerald-100/30 border border-emerald-900/20"></div>
                    </div>
                 </div>
             </div>

             {/* Center Content */}
             <div className="relative z-10 flex flex-col items-center justify-center mt-6">
                 
                 {/* Main Typography & Clover Composition */}
                 <div className="relative">
                     {/* The Main Clover */}
                     <StaticClover className="w-40 h-40 md:w-64 md:h-64 mx-auto relative z-10 drop-shadow-2xl" />
                     
                     {/* Typography Overlapping/interacting */}
                     <h1 className="hero-text-anim font-['Pinyon_Script'] text-7xl md:text-9xl text-emerald-600 leading-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-6 whitespace-nowrap z-20 drop-shadow-sm mix-blend-multiply opacity-90">
                        Lucky Charm
                     </h1>
                 </div>

                 <h2 className="hero-text-anim font-playfair text-2xl md:text-4xl text-emerald-800/80 font-bold tracking-widest mt-4 uppercase">
                    Ineffable
                 </h2>
             </div>

             {/* Footer Date */}
             <div className="absolute bottom-8 font-serif text-emerald-800/40 text-sm md:text-base tracking-[0.2em] uppercase">
                 February 14, 2026
             </div>

             {/* Wax Seal (Top Center) */}
             <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-red-800 shadow-md flex items-center justify-center border-4 border-red-900/50 z-30">
                 <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-red-950/30 bg-red-700 shadow-inner flex items-center justify-center text-red-950 font-serif text-[10px] md:text-xs font-bold">
                     L
                 </div>
             </div>

             {/* Shadow Overlay (Tree shadow effect from reference - simulated) */}
             <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/5 via-transparent to-transparent mix-blend-multiply opacity-50"></div>
             
             {/* "Noise" Grain */}
             <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}></div>
         </div>
      </div>
    </section>
  )
}

export default Hero;
