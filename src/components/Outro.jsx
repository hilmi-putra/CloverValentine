import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import ScrollReveal from './ScrollReveal';

const Outro = ({ isActive }) => {
    const scrollContainerRef = useRef(null);
    const mainContainerRef = useRef(null);

    useEffect(() => {
        if (!isActive || !scrollContainerRef.current) return;

        // 1. Initial Fade In of the entire Outro screen
        gsap.fromTo(mainContainerRef.current, 
            { opacity: 0 }, 
            { opacity: 1, duration: 2, ease: "power2.inOut" }
        );

        // Auto-scroll logic
        const scroller = scrollContainerRef.current;
        const totalHeight = scroller.scrollHeight - scroller.clientHeight;

        if (totalHeight > 0) {
            // Wait longer (3s) then start rolling credits very smoothly
            gsap.to(scroller, {
                scrollTop: totalHeight,
                duration: 90, 
                ease: 'none',
                delay: 3
            });
        }
    }, [isActive]);

    if (!isActive) return null;

    const categories = [
        {
            title: "Core Architecture",
            items: ["Vite", "React 18", "TailwindCSS v3", "JavaScript (ES6+)"]
        },
        {
            title: "Animation Engine",
            items: ["GSAP (GreenSock)", "GSAP ScrollTrigger", "CSS3 Keyframes", "Lottie (Pre-loader)"]
        },
        {
            title: "3D & Physics",
            items: ["Three.js", "@react-three/fiber", "@react-three/drei", "@react-three/rapier", "MeshLine", "ShaderMaterials"]
        },
        {
            title: "Interactive Components",
            items: ["TextPressure (React Bits)", "Lanyard Physics", "Interactive Clover Game", "Drag & Drop Mechanics"]
        },
        {
            title: "Assets & Resources",
            items: ["Google Fonts (Playfair, Inter)", "Cloudinary (Media Hosting)", "Custom SVG Icons", "Aurora Gradients"]
        },
        {
            title: "Features",
            items: ["Passcode Security", "Music Player", "Photo Booth", "Secret Clover Mission", "Responsive Mobile Design"]
        }
    ];

    return (
        <div 
            ref={mainContainerRef}
            className="fixed inset-0 z-[700] bg-black text-white font-sans flex flex-col items-center justify-center overflow-hidden opacity-0"
        >
            
            {/* Scroll Container */}
            <div 
                ref={scrollContainerRef} 
                className="w-full h-full overflow-y-auto px-4 py-20 flex flex-col items-center no-scrollbar relative"
                style={{ scrollBehavior: 'auto' }} 
            >
                {/* Spacer to start from bottom */}
                <div className="h-[90vh]"></div>

                {/* Credits Content */}
                <div className="w-full max-w-2xl text-center space-y-32 pb-40">
                    
                    {/* Main Dedication */}
                    <div>
                         <ScrollReveal 
                            scrollContainerRef={scrollContainerRef} 
                            baseRotation={5} 
                            enableBlur={true} 
                            containerClassName="text-center"
                            textClassName="text-5xl md:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-t from-emerald-600 to-white mb-2"
                        >
                            SEMANGAT YA NAK UGM
                        </ScrollReveal>
                        <p className="mt-8 text-emerald-200/60 font-serif italic text-2xl opacity-80 animate-pulse">
                            "Mau Sombong aja sii aku bisa buat ini hehe"
                        </p>
                    </div>

                    {/* CAST */}
                     <div className="flex flex-col md:flex-row justify-center gap-12 md:gap-40 border-y border-white/10 py-12">
                         <div className="text-center">
                            <h4 className="text-gray-500 text-xs uppercase tracking-[0.3em] mb-4">Presented By</h4>
                            <ScrollReveal 
                                scrollContainerRef={scrollContainerRef} 
                                baseRotation={-2} 
                                textClassName="text-4xl font-bold text-white"
                            >
                                Hilmi
                            </ScrollReveal>
                        </div>
                        <div className="text-center">
                            <h4 className="text-gray-500 text-xs uppercase tracking-[0.3em] mb-4">For</h4>
                             <ScrollReveal 
                                scrollContainerRef={scrollContainerRef} 
                                baseRotation={2} 
                                textClassName="text-4xl font-bold text-emerald-400"
                            >
                                Depa
                            </ScrollReveal>
                        </div>
                    </div>

                    {/* TECHNICAL CREDITS (Readme Style) */}
                    <div className="space-y-24">
                        <h2 className="text-3xl font-serif text-white/40 italic">Technical Specifications</h2>
                        
                        {categories.map((cat, i) => (
                            <div key={i} className="space-y-6">
                                <h4 className="text-emerald-500 text-sm uppercase tracking-[0.2em] font-bold">{cat.title}</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {cat.items.map((item, idx) => (
                                        <div key={idx} className="opacity-70 hover:opacity-100 transition-opacity">
                                            <ScrollReveal 
                                                scrollContainerRef={scrollContainerRef}
                                                baseRotation={0}
                                                blurStrength={1}
                                                textClassName="text-xl md:text-2xl font-light tracking-wider text-gray-300"
                                            >
                                                {item}
                                            </ScrollReveal>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                     {/* Final Logo/Mark */}
                     <div className="pt-40 pb-60 opacity-80 flex flex-col items-center">
                        <p className="mb-8 text-emerald-200/50 font-serif italic text-sm md:text-base max-w-md text-center">
                            "soory ya kak kalo banyak bug dan kurangnya tapi aku jago si jadi harusnya bagus, moga aja ada yang nanya “Will you be my Valentine?” oh y hbd tis"
                        </p>
                        <div className="w-32 h-32 mx-auto text-emerald-500 animate-spin-slow drop-shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                             <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
                                {/* Top Leaf */}
                                <path d="M50 50 C 35 35, 20 10, 50 10 C 80 10, 65 35, 50 50" />
                                {/* Right Leaf */}
                                <path d="M50 50 C 65 35, 90 20, 90 50 C 90 80, 65 65, 50 50" />
                                {/* Bottom Leaf */}
                                <path d="M50 50 C 65 65, 80 90, 50 90 C 20 90, 35 65, 50 50" />
                                {/* Left Leaf */}
                                <path d="M50 50 C 35 65, 10 80, 10 50 C 10 20, 35 35, 50 50" />
                                {/* Center Dot */}
                                <circle cx="50" cy="50" r="3" fill="#ecfccb" />
                             </svg>
                        </div>
                        <p className="mt-12 text-2xl md:text-4xl text-emerald-300 font-serif italic tracking-widest uppercase animate-pulse">Happy Valentine</p>
                     </div>

                </div>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .animate-spin-slow {
                    animation: spin 10s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default Outro;
