import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ShaderBackground from './ShaderBackground';

// Reusable Clover SVG for decoration (similar to what was used in Hero)
const FinalMessage = ({ isActive, onComplete }) => {
    const containerRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        if (!isActive) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // 1. Fade in Container
            tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 1 });

            // 2. Header Reveal
            tl.fromTo(".main-header", 
                { y: -30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
            );

            // 3. Columns Stagger In
            tl.fromTo(".album-col", 
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.3, ease: "back.out(1.2)" },
                "-=0.5"
            );

            // 4. Vinyl Elements slide out & Spin
            // Slide out - Make it visible (approx 50% width to show "half")
            tl.fromTo(".vinyl-record",
                { x: 0, rotation: 0 },
                { x: "50%",  duration: 1.5, ease: "power2.inOut", delay: 0.5 } 
            );

            // Continuous Spin
            gsap.to(".vinyl-record", {
                rotation: 360,
                duration: 4,
                repeat: -1,
                ease: "linear",
                delay: 2 // Start spinning after slide out starts
            });

            // 5. Quotes Fade In
            tl.fromTo(".quote-text", 
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.2 },
                "-=1"
            );

            // 6. Continue Button Fade In
            tl.to(".continue-btn", { opacity: 1, duration: 1, delay: 0.5 });

        }, containerRef);

        return () => ctx.revert();
    }, [isActive]);

    const handleHover = (e, state) => {
        const vinyl = e.currentTarget.querySelector('.vinyl-record');
        if (vinyl) {
            gsap.to(vinyl, {
                x: state ? "50%" : "20%", 
                duration: 0.5, 
                ease: "power3.out",
                overwrite: "auto"
            });
        }
    };

    if (!isActive) return null;

    return (
        <section ref={containerRef} className="fixed inset-0 z-[500] flex flex-col items-center justify-center overflow-hidden bg-[#f0fdf4] text-emerald-900">
            
            {/* Main Header */}
            <div className="main-header text-center mb-6 md:mb-12 relative z-10 p-4">
                <h1 className="font-playfair text-4xl md:text-5xl italic tracking-wide text-emerald-800">
                    You <span className="text-emerald-600 font-bold">remind me</span> of
                </h1>
                <h1 className="font-['Pinyon_Script'] text-6xl md:text-8xl text-emerald-500 mt-2">
                    the color Green
                </h1>
            </div>

            {/* 3-Column Layout */}
            <div ref={contentRef} className="w-full max-w-7xl px-4 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-start relative z-10">

                {/* Column 1: Beautiful */}
                <div className="album-col flex flex-col items-center text-center">
                    <div 
                        className="relative w-56 h-56 md:w-64 md:h-64 mb-6 group cursor-pointer"
                        onMouseEnter={(e) => handleHover(e, true)}
                        onMouseLeave={(e) => handleHover(e, false)}
                    >
                        {/* Vinyl Record (Behind) */}
                        <div className="vinyl-record absolute top-1 right-1 w-[95%] h-[95%] rounded-full bg-black flex items-center justify-center shadow-xl -z-10">
                            <div className="w-[35%] h-[35%] bg-emerald-100 rounded-full border-4 border-[#222]"></div>
                             {/* Grooves */}
                             <div className="absolute inset-0 rounded-full border-[10px] border-transparent border-t-white/10 opacity-20"></div>
                        </div>
                        {/* Album Art */}
                        <img 
                            src="https://res.cloudinary.com/dahvjvesd/image/upload/v1770810906/beautiful_levas9.svg" 
                            alt="Beautiful" 
                            className="w-full h-full object-cover shadow-2xl relative z-10 rounded-sm" 
                        />
                    </div>
                    <div className="quote-text font-serif text-sm md:text-base leading-relaxed opacity-90 max-w-xs text-emerald-800">
                        <p>
                            You're <span className="text-emerald-600 font-bold italic">the star</span> I look for<br/>
                            <span className="font-bold">every night</span><br/>
                            When <span className="italic">it's dark</span>, you'll stick<br/>
                            right <span className="font-bold text-emerald-600">by my side</span> . . .
                        </p>
                    </div>
                </div>

                {/* Column 2: Disillusioned (Standard Square Style) */}
                <div className="album-col flex flex-col items-center text-center mt-4 md:mt-0">
                    <div 
                        className="relative w-56 h-56 md:w-64 md:h-64 mb-6 group cursor-pointer"
                        onMouseEnter={(e) => handleHover(e, true)}
                        onMouseLeave={(e) => handleHover(e, false)}
                    >
                         {/* Vinyl Record */}
                         <div className="vinyl-record absolute top-1 right-1 w-[95%] h-[95%] rounded-full bg-black flex items-center justify-center shadow-xl -z-10">
                            <div className="w-[35%] h-[35%] bg-emerald-200 rounded-full border-4 border-[#222]"></div>
                            {/* Grooves */}
                            <div className="absolute inset-0 rounded-full border-[10px] border-transparent border-t-white/10 opacity-20"></div>
                        </div>
                        
                        {/* Artwork (Square) */}
                        <img 
                            src="https://res.cloudinary.com/dahvjvesd/image/upload/v1770810906/Disillusioned_m8mazk.svg" 
                            alt="Disillusioned" 
                            className="w-full h-full object-cover shadow-2xl relative z-10 rounded-sm" 
                        />
                    </div>
                    <div className="quote-text font-serif text-sm md:text-base leading-relaxed opacity-90 max-w-xs px-2 text-emerald-800">
                        <span className="text-4xl leading-none text-emerald-400 block mb-2">“</span>
                        <p className="-mt-4">
                            The <span className="text-emerald-600 font-bold">Sun don't shine</span> when I'm alone<br/>
                            <span className="italic">I lose my mind</span> and <span className="italic">I lose control</span><br/>
                            I see <span className="font-bold">your eyes</span> look through <span className="italic">my soul</span><br/>
                            <span className="italic">Don't be surprised</span>, this is all <span className="font-bold">I know</span>
                        </p>
                        <span className="text-4xl leading-none text-emerald-400 block text-right">”</span>
                    </div>
                </div>

                {/* Column 3: Stuck */}
                <div className="album-col flex flex-col items-center text-center">
                    <div 
                        className="relative w-56 h-56 md:w-64 md:h-64 mb-6 group cursor-pointer"
                        onMouseEnter={(e) => handleHover(e, true)}
                        onMouseLeave={(e) => handleHover(e, false)}
                    >
                         <div className="vinyl-record absolute top-1 right-1 w-[95%] h-[95%] rounded-full bg-black flex items-center justify-center shadow-xl -z-10">
                            <div className="w-[35%] h-[35%] bg-emerald-300 rounded-full border-4 border-[#222]"></div>
                        </div>
                        <img 
                            src="https://res.cloudinary.com/dahvjvesd/image/upload/v1770810907/stuck_l8nrf9.svg" 
                            alt="Stuck" 
                            className="w-full h-full object-cover shadow-2xl relative z-10 rounded-sm" 
                        />
                    </div>
                    <div className="quote-text font-serif text-sm md:text-base leading-relaxed opacity-90 max-w-xs text-emerald-800">
                        <p>
                            You <span className="font-bold text-emerald-600">really</span>, really <span className="font-bold text-emerald-600">love me</span><br/>
                            You <span className="font-bold">know me</span> and <span className="italic text-emerald-600">you love me</span><br/>
                            And it's <span className="font-bold text-emerald-600">the kind of thing</span> I <span className="font-bold text-emerald-600">always</span><br/>
                            hoped <span className="italic">I'd find</span> . . .
                        </p>
                    </div>
                </div>

            </div>
            
            {/* Continue Button */}
            <div className="continue-btn absolute bottom-12 z-[60] opacity-0 pointer-events-auto">
                <button 
                    onClick={() => onComplete && onComplete()}
                    className="px-8 py-3 bg-emerald-600 text-white font-serif italic tracking-widest rounded-full hover:bg-emerald-700 hover:scale-105 transition-all shadow-lg text-sm cursor-pointer"
                >
                    Lanjut ➔
                </button>
            </div>

            {/* Decorative Stars from reference - Green Theme */}
            <div className="fixed top-20 left-10 text-emerald-200 opacity-40 text-9xl pointer-events-none rotate-12">★</div>
            <div className="fixed bottom-20 right-10 text-emerald-200 opacity-40 text-9xl pointer-events-none -rotate-12">★</div>

        </section>
    );
};

export default FinalMessage;
