import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/all';

gsap.registerPlugin(Draggable);


// Utils
const random = (min, max) => Math.random() * (max - min) + min;

// Repelling Clover (Uses /clover.svg, Avoids Mouse)
const RepellingClover = ({ x, y, size }) => {
    const elRef = useRef(null);
    const rafRef = useRef(null);
    
    // Config - adjusted for smoother feel
    const repelDist = 200; // Trigger distance
    const moveDist = 100;   // Movement distance
    
    useEffect(() => {
        const handleMouseMove = (e) => {
            // Cancel any pending animation frame
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }

            rafRef.current = requestAnimationFrame(() => {
                if (!elRef.current) return;

                // Since we are inside an SVG, we need to calculate position relative to viewport
                // However, for this simple repel effect, client coords comparison often works "okay" 
                // if the SVG covers the screen. Better precision involves mapping, 
                // but let's stick to the visual logic which works for full screen.
                
                const rect = elRef.current.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                
                const dx = e.clientX - cx;
                const dy = e.clientY - cy;
                const dist = Math.sqrt(dx*dx + dy*dy);

                if (dist < repelDist) {
                    // Calculate angle to move AWAY
                    const angle = Math.atan2(dy, dx);
                    // Smooth falloff based on distance
                    const force = (1 - dist / repelDist) * moveDist;
                    const tx = -Math.cos(angle) * force;
                    const ty = -Math.sin(angle) * force;

                    gsap.to(elRef.current, {
                        x: tx, 
                        y: ty,
                        duration: 0.6,
                        ease: "power2.out",
                        overwrite: true
                    });
                } else {
                    // Return to zero offset with elastic bounce
                    gsap.to(elRef.current, {
                        x: 0,
                        y: 0,
                        duration: 1.2,
                        ease: "elastic.out(1, 0.6)",
                        overwrite: true
                    });
                }
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    // Base size for the clover image
    const baseSize = 50; 

    return (
        <g transform={`translate(${x}, ${y})`}>
            <g ref={elRef}> 
                <g transform={`scale(${size})`}>
                    <g className="animate-spin-slow"> 
                        {/* Using the provided SVG file */}
                        {/* Center it: x = -width/2, y = -height/2 */}
                        <image 
                            href="/clover.svg" 
                            width={baseSize} 
                            height={baseSize} 
                            x={-baseSize/2} 
                            y={-baseSize/2} 
                            style={{ filter: 'drop-shadow(0px 10px 10px rgba(0,0,0,0.2))' }}
                        />
                    </g>
                </g>
            </g>
        </g>
    );
};

const BloomingIntro = ({ onComplete }) => {
    const containerRef = useRef(null);
    // Initial Word Setup
    const correctWord = ['i', 'n', 'e', 'f', 'f', 'a', 'b', 'l', 'e'];
    
    // We only need the characters, position is handled by GSAP
    const [letters] = useState(() => {
         return correctWord.map((char, i) => ({ 
             id: i, 
             char, 
             // Random scattering within typical screen bounds (avoiding very edges)
             // We'll set these effectively via GSAP on mount
             initialX: random(10, 80), 
             initialY: random(10, 80),
             rotate: random(-15, 15)
         }));
    });
    
    const [isSolved, setIsSolved] = useState(false);
    const lettersRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(containerRef.current, { visibility: 'visible' });

            // 1. Scatter Animation (Pop in at random spots)
            letters.forEach((item, i) => {
                const el = lettersRef.current[i];
                if(el) {
                    gsap.set(el, {
                        x: window.innerWidth * (item.initialX / 100),
                        y: window.innerHeight * (item.initialY / 100),
                        rotation: item.rotate,
                        scale: 0,
                        opacity: 0
                    });

                    // Pop In
                    gsap.to(el, {
                        scale: 1,
                        opacity: 1,
                        duration: 1,
                        delay: 0.5 + (i * 0.05),
                        ease: "elastic.out(1, 0.5)"
                    });
                }
            });

            // 2. Initialize Draggable
            Draggable.create(".ineffable-letter", {
                type: "x,y",
                bounds: window,
                inertia: true,
                onDragStart: function() {
                    gsap.to(this.target, { zIndex: 100, scale: 1.1, duration: 0.2 });
                },
                onDragEnd: function() {
                    gsap.to(this.target, { zIndex: 10, scale: 1, duration: 0.2 });
                    checkOrder();
                }
            });
            
            // Entrance Text
             gsap.fromTo(".intro-instruction", 
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, delay: 2, ease: "power2.out" }
            );

        }, containerRef);

        return () => ctx.revert();
    }, [letters]);

    const checkOrder = () => {
        if (isSolved) return;

        // Get all letter elements
        const els = lettersRef.current;
        
        // Map elements to their current visual position (getBoundingClientRect.x)
        const currentOrder = els.map((el, index) => {
            const rect = el.getBoundingClientRect();
            return {
                char: letters[index].char,
                x: rect.x
            };
        });

        // Sort by X position (Left to Right)
        currentOrder.sort((a, b) => a.x - b.x);

        // Check against "ineffable"
        const formedWord = currentOrder.map(item => item.char).join('');
        
        if (formedWord === 'ineffable') {
             // Basic proximity check: Ensure they are somewhat aligned (optional, but good)
             // For now, just order is strict enough as requested "disesuaikan urutannya"
             
             setIsSolved(true);
             
             // Win Sequence
             // 1. Center coordinates
             // We need to measure one element to calculate layout
             const measureEl = lettersRef.current[0]; 
             const rect = measureEl.getBoundingClientRect();
             // Note: rect might be affected by current scale/rotation, 
             // but strictly we want the layout box size. 
             // Since we animate to scale 1.2, we can adjust spacing slightly or just use current rect as base.
             
             const width = rect.width;
             const height = rect.height;
             
             const spacing = width * 0.45; // Overlap factor
             const totalArrangementWidth = (8 * spacing) + width;
             
             const startX = (window.innerWidth - totalArrangementWidth) / 2;
             const startY = (window.innerHeight - height) / 2;
             
             const sortedEls = [...lettersRef.current].sort((a, b) => {
                 return a.getBoundingClientRect().x - b.getBoundingClientRect().x;
             });

             sortedEls.forEach((el, i) => {
                 // Kill draggable to prevent interference
                 const draggable = Draggable.get(el);
                 if(draggable) draggable.disable();

                 gsap.to(el, {
                     x: startX + (i * spacing),
                     y: startY, 
                     rotation: 0,
                     scale: 1.2,
                     duration: 1,
                     ease: "power3.inOut"
                 });
             });

             // Fade out
             gsap.to(containerRef.current, { 
                 opacity: 0, 
                 duration: 1.5, 
                 delay: 2.5, 
                 onComplete 
             });
        }
    };

    // Generate mix of small and large clovers
    const smallClovers = Array.from({ length: 28 }).map((_, i) => ({
        id: `small-${i}`,
        x: random(50, 950),
        y: random(50, 550),
        size: random(0.6, 1.2), // Adjusted size for image
    }));

    // 7 LARGE clovers
    const largeClovers = Array.from({ length: 7 }).map((_, i) => ({
        id: `large-${i}`,
        x: random(100, 900),
        y: random(100, 500),
        size: random(2.0, 3.5), // Larger for emphasis
    }));

    const clovers = [...smallClovers, ...largeClovers];



    return (
        <div ref={containerRef} className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/90 backdrop-blur-sm invisible">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
                {/* Render Many Repelling Clovers */}
                {clovers.map(c => (
                    <g key={c.id} className="clover-group pointer-events-auto">
                        <RepellingClover 
                            x={c.x} 
                            y={c.y} 
                            size={c.size} 
                        />
                    </g>
                ))}
            </svg>

            <div className="relative z-10 w-full h-full pointer-events-none">
                {/* Letters container taking full screen for scattering */}
                <div className="absolute inset-0 pointer-events-auto">
                    {letters.map((item, index) => (
                        <div 
                            key={`letter-${index}`}
                            ref={el => lettersRef.current[index] = el}
                            className="ineffable-letter absolute w-32 h-44 md:w-48 md:h-64 cursor-grab active:cursor-grabbing hover:scale-105 active:scale-110 transition-transform active:z-50"
                            // Initial transforms are handled by GSAP
                        >
                           <img 
                                src={`/word/${item.char}.svg`} 
                                alt={item.char} 
                                className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] pointer-events-none select-none"
                                draggable="false"
                           />
                        </div>
                    ))}
                </div>
                
                {/* Instructions at bottom */}
                <div className="absolute bottom-12 left-0 right-0 text-center intro-instruction pointer-events-none">
                    <p className="font-inter text-emerald-200/80 text-sm tracking-[0.3em] uppercase animate-pulse">
                        {isSolved ? "Perfect!" : "Arrange the letters freely to form the word"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BloomingIntro;