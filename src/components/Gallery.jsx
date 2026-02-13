import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ShaderBackground from './ShaderBackground';

gsap.registerPlugin(ScrollTrigger);

// Using existing image URLs as placeholders
const images = [
  "https://res.cloudinary.com/dahvjvesd/image/upload/v1770983877/2_lpgd2t.png", // Green leaves/forest
  "https://res.cloudinary.com/dahvjvesd/image/upload/v1770983879/3_oma3nt.png", // Moody field
  "https://res.cloudinary.com/dahvjvesd/image/upload/v1770983883/5_i9tomq.png", // Dew on grass/field
  "https://res.cloudinary.com/dahvjvesd/image/upload/v1770983885/6_icsbeq.png", // Misty nature
  "https://res.cloudinary.com/dahvjvesd/image/upload/v1770984066/8_ospke1.png", // Forest light
  "https://res.cloudinary.com/dahvjvesd/image/upload/v1770984440/9_bb2wot.png", // Hands/Friendship
  "https://res.cloudinary.com/dahvjvesd/image/upload/v1770995222/11_fhs6cg.png", 
  "https://res.cloudinary.com/dahvjvesd/image/upload/v1770983876/7_vlhep1.png", 
];

const Gallery = () => {
    const containerRef = useRef(null);
    const wrapperRef = useRef(null);
    const photosRef = useRef([]);

    const captions = [
        "Ever since we first met in dc",
        "p balap",
        "mana ni jodoh aku kak, kamu kasih dari 2 taun lalu",
        "makasih nnt aku kasih tiketnya",
        "muak sama braga",
        "ini gatau si nemu",
        "jarinya dikondisikan kak", 
        "baru kemarin si"
    ];

    useEffect(() => {
        const wrapper = wrapperRef.current;
        const container = containerRef.current;
        
        // Function to get the scroll distance
        const getScrollAmount = () => {
            let wrapperWidth = wrapper.scrollWidth;
            return -(wrapperWidth - window.innerWidth);
        };

        const tween = gsap.to(wrapper, {
            x: getScrollAmount,
            ease: "none",
            scrollTrigger: {
                trigger: container,
                start: "top top",
                end: () => `+=${getScrollAmount() * -1}`,
                pin: container,
                scrub: 1,
                invalidateOnRefresh: true,
            }
        });

        return () => {
            tween.kill();
        };
    }, []);

    return (
        <section className="relative overflow-hidden bg-emerald-950 text-emerald-50">
            {/* Extended Background */}
             <div className="fixed inset-0 z-0">
                 <ShaderBackground />
                 <div className="absolute inset-0 bg-emerald-950/40 pointer-events-none"></div>
             </div>
            
            <div ref={containerRef} className="h-screen flex items-center relative z-10 overflow-hidden">
                
                {/* Intro Text (Fixed Position or First Item) */}
                <div className="absolute left-10 top-1/2 transform -translate-y-1/2 w-[30vw] z-20 pointer-events-none">
                     {/* Placeholder for potential fixed overlay text */}
                </div>

                <div ref={wrapperRef} className="flex items-center pl-[10vw] gap-32">
                    
                    {/* 1. Intro Card / Text Item */}
                    <div className="gallery-item flex-shrink-0 w-[40vw] flex flex-col justify-center pr-10">
                        <h2 className="text-5xl md:text-7xl font-playfair font-medium text-white mb-8 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                           Captured Moments
                        </h2>
                        <p className="text-xl font-inter font-light leading-relaxed text-emerald-50 drop-shadow-sm">
                            We may not meet often, sometimes not even once a year, but every time we do, it feels just as meaningful.
                        </p>
                        <span className="mt-12 font-['Pinyon_Script'] text-4xl text-emerald-200 transform -rotate-2 drop-shadow-md">
                            Scroll to explore &rarr;
                        </span>
                    </div>

                    {/* 2. Photo Items */}
                    {images.map((src, index) => {
                        const margin = index % 2 !== 0 ? 'mt-24' : 'mb-24';
                        
                        return (
                            <div 
                                key={index}
                                ref={el => photosRef.current[index] = el}
                                className={`gallery-photo-card flex-shrink-0 relative group p-4 bg-white shadow-2xl transition-all duration-500 transform hover:scale-105 hover:z-50 ${margin}`}
                                style={{
                                    width: '320px',
                                    height: '420px',
                                }}
                            >
                                {/* Photo Content */}
                                <div className="flex flex-col h-full bg-white">
                                    <div className="relative aspect-[4/5] overflow-hidden w-full bg-gray-100">
                                        <img 
                                            src={src} 
                                            alt={`Memory ${index + 1}`} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                        />
                                        <div className="absolute inset-0 bg-[#5c4033] opacity-10 mix-blend-multiply pointer-events-none"></div>
                                    </div>
                                    <div className="h-16 flex items-center justify-center">
                                       <span className="font-serif italic text-gray-500 text-2l">
                                          {captions[index] || `Memory #${index + 1}`}
                                       </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Gallery;
