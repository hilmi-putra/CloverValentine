import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const Float = ({ children, speed = 1, rotationIntensity = 1, floatIntensity = 1 }) => {
    const ref = useRef(null);
    const offset = useRef(Math.random() * 100);
    
    useEffect(() => {
        let t = offset.current;
        let frame;
        
        const animate = () => {
             if (!ref.current) return;
             
             t += 0.01 * speed;
             
             // Smooth Sine Wave Floating
             const y = Math.sin(t) * 10 * floatIntensity;
             const rotate = Math.sin(t / 2) * 5 * rotationIntensity;
             
             ref.current.style.transform = `translateY(${y}px) rotate(${rotate}deg)`;
             
             frame = requestAnimationFrame(animate);
        };
        
        animate();
        return () => cancelAnimationFrame(frame);
    }, [speed, rotationIntensity, floatIntensity]);
    
    return <div ref={ref} className="will-change-transform">{children}</div>;
};

const Clover = ({ id, leaves, onCollect, isInteractable }) => {
    const cloverRef = useRef(null);
    const [isCollected, setIsCollected] = useState(false);
    
    // Drag State
    const dragData = useRef({ 
        isDragging: false, 
        startX: 0, 
        startY: 0, 
        initialLeft: 0, 
        initialTop: 0,
        hasMoved: false
    });

    // Entrance Logic
    useEffect(() => {
        gsap.fromTo(cloverRef.current, 
            { scale: 0, opacity: 0, y: 50 },
            { 
                scale: 1, 
                opacity: 1, 
                y: 0, 
                duration: 1.5, 
                ease: "back.out(1.5)",
                delay: Math.random() * 0.5 
            }
        );
    }, []);

    const getRandomPos = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const padding = 80; 
        let x, y;
        let attempts = 0;
        const maxAttempts = 100;
        
        do {
            x = Math.random() * (w - padding * 2) + padding;
            y = Math.random() * (h - padding * 2) + padding;
            attempts++;
            
            const centerX = w / 2;
            const centerY = h / 2;
            
            // Zones to avoid
            const inCounterCardZone = (x > w - 300) && (y > centerY - 150 && y < centerY + 150);
            const inMissionModalZone = (x > w - 300) && (y > h - 250);
            
            // Main Center Floating Card Zone (approx 600x500 plus margin)
            const inCenterCardZone = (x > centerX - 320 && x < centerX + 320) && (y > centerY - 280 && y < centerY + 280);
            
            if (!inCounterCardZone && !inMissionModalZone && !inCenterCardZone) return { x, y };
        } while (attempts < maxAttempts);
        
        // Fallback: Safe left area
        return { x: Math.random() * (w * 0.25) + 50, y: Math.random() * (h - 200) + 100 }; 
    };

    const initialPos = useRef(getRandomPos());
    
    // DRAG HANDLERS
    const handlePointerDown = (e) => {
        if (!isInteractable || isCollected) return;
        e.preventDefault(); // Prevent text selection/scroll start
        
        dragData.current.isDragging = true;
        dragData.current.startX = e.clientX;
        dragData.current.startY = e.clientY;
        dragData.current.hasMoved = false;
        
        // Capture current position
        const style = window.getComputedStyle(cloverRef.current);
        dragData.current.initialLeft = parseFloat(style.left);
        dragData.current.initialTop = parseFloat(style.top);
        
        cloverRef.current.setPointerCapture(e.pointerId);
        cloverRef.current.style.zIndex = 1000; // Bring to front while dragging
        cloverRef.current.style.cursor = 'grabbing';
    };
    
    const handlePointerMove = (e) => {
        if (!dragData.current.isDragging) return;
        
        const dx = e.clientX - dragData.current.startX;
        const dy = e.clientY - dragData.current.startY;
        
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            dragData.current.hasMoved = true;
        }

        cloverRef.current.style.left = `${dragData.current.initialLeft + dx}px`;
        cloverRef.current.style.top = `${dragData.current.initialTop + dy}px`;
    };
    
    const handlePointerUp = (e) => {
        if (!dragData.current.isDragging) return;
        
        dragData.current.isDragging = false;
        cloverRef.current.releasePointerCapture(e.pointerId);
        cloverRef.current.style.zIndex = "";
        cloverRef.current.style.cursor = 'pointer';

        // Check if it was a click or drag
        if (!dragData.current.hasMoved) {
            handleCollectCheck();
        }
    };

    const handleCollectCheck = () => {
        if (leaves === 4) {
            setIsCollected(true);
            gsap.to(cloverRef.current, {
                scale: 1.5,
                opacity: 0,
                duration: 0.4,
                ease: "back.in(1.7)",
                onComplete: () => onCollect(id, true)
            });
        } else {
            gsap.to(cloverRef.current, {
                x: "+=10",
                duration: 0.1,
                repeat: 5,
                yoyo: true,
                onComplete: () => gsap.to(cloverRef.current, { x: 0, duration: 0.1 })
            });
            gsap.to(cloverRef.current, { color: "#ef4444", duration: 0.2, yoyo: true, repeat: 1 });
        }
    };
    
    // Calculate angles based on leaves
    const getAngles = (n) => {
        const angles = [];
        const step = 360 / n;
        for(let i=0; i<n; i++) angles.push(i * step);
        return angles;
    };

    const angles = getAngles(leaves);

    return (
        <div 
            ref={cloverRef} 
            className={`absolute w-16 h-16 pointer-events-auto transition-colors touch-none ${isInteractable ? 'cursor-pointer hover:brightness-110' : 'cursor-default opacity-80'}`}
            style={{ left: initialPos.current.x, top: initialPos.current.y, zIndex: 50 }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            <Float speed={2} rotationIntensity={2} floatIntensity={2}>
                 <div className="w-full h-full drop-shadow-xl filter transition-all duration-300">
                    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible pointer-events-none">
                        <g transform="translate(50,50)">
                            {/* Leaves based on count */}
                            {angles.map((rot, i) => (
                                <path 
                                    key={i} 
                                    d="M0,0 C-15,-15 -25,-40 0,-40 C25,-40 15,-15 0,0" 
                                    transform={`rotate(${rot}) translate(0, -2)`}
                                    fill="#10b981" 
                                    stroke="#065f46" 
                                    strokeWidth="1"
                                    className="opacity-90"
                                />
                            ))}
                            <path d="M0,0 Q5,25 20,40" fill="none" stroke="#065f46" strokeWidth="3" transform="rotate(45)" /> 
                            <circle cx="0" cy="0" r="3" fill="#34d399" />
                        </g>
                    </svg>
                 </div>
            </Float>
        </div>
    );
};

// ... SideCard, CloverConfetti, SecretMissionModal, TransitionScreen code ...

// In InteractiveOverlay render:
// ...


const SideCard = ({ count, visible }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        if (visible) {
            gsap.to(cardRef.current, { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
        } else {
             gsap.to(cardRef.current, { x: 100, opacity: 0, duration: 0.5, ease: "power3.in" });
        }
    }, [visible]);

    useEffect(() => {
        gsap.fromTo(".count-text", 
            { scale: 1.5, color: "#34d399" }, 
            { scale: 1, color: "#065f46", duration: 0.3, ease: "back.out(1.7)" }
        );
    }, [count]);

    return (
        <div 
            ref={cardRef}
            className="fixed right-6 top-1/2 -translate-y-1/2 w-48 bg-emerald-50/90 backdrop-blur-md border border-emerald-100 p-6 rounded-2xl shadow-lg z-[60] transform translate-x-32 opacity-0"
        >
            <div className="flex flex-col items-center">
                <h3 className="font-cinzel text-emerald-800 font-bold tracking-wider text-sm mb-2 uppercase">Your Clover</h3>
                <div className="w-full h-px bg-emerald-200 mb-4"></div>
                <div className="flex items-end gap-1">
                    <span className="count-text text-4xl font-playfair font-bold text-emerald-900">{count}</span>
                    <span className="text-lg font-light text-emerald-600 mb-1">/ 7</span>
                </div>
                {count === 7 ? (
                    <p className="mt-3 text-xs text-center text-emerald-600 font-inter animate-pulse">Collection Complete!</p>
                ) : (
                    <p className="mt-3 text-xs text-center text-emerald-600/70 font-inter">Find the 4-leaf ones!</p>
                )}
            </div>
        </div>
    );
};

const CloverConfetti = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const clovers = document.querySelectorAll('.confetti-clover');
            
            clovers.forEach((clover) => {
                // Random start above viewport
                gsap.set(clover, {
                    x: Math.random() * window.innerWidth,
                    y: -100, 
                    rotation: Math.random() * 360,
                    scale: Math.random() * 0.4 + 0.3,
                    opacity: Math.random() * 0.5 + 0.5
                });

                // Periodic falling animation
                gsap.to(clover, {
                    y: window.innerHeight + 100,
                    x: `+=${Math.random() * 200 - 100}`,
                    rotation: `+=${Math.random() * 720}`,
                    duration: Math.random() * 3 + 3,
                    ease: "none",
                    delay: Math.random() * 5, // Spread out the start
                    repeat: -1
                });
            });
        }, containerRef);
        
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[80] overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
                <div key={i} className="confetti-clover absolute w-10 h-10 text-emerald-400 drop-shadow-sm">
                     <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
                        <g transform="translate(50,50)">
                            {/* 4 Leaves for Confetti */}
                            {[0, 90, 180, 270].map((rot, j) => (
                                <path 
                                    key={j} 
                                    d="M0,0 C-15,-15 -25,-40 0,-40 C25,-40 15,-15 0,0" 
                                    transform={`rotate(${rot}) translate(0, -2)`}
                                />
                            ))}
                            <circle cx="0" cy="0" r="3" />
                        </g>
                     </svg>
                </div>
            ))}
        </div>
    );
};

const SecretMissionModal = ({ visible }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        if (visible) {
            gsap.to(modalRef.current, {
                x: 0,
                opacity: 1,
                duration: 1,
                ease: "elastic.out(1, 0.75)"
            });
        } else {
            gsap.to(modalRef.current, {
                x: 100,
                opacity: 0,
                duration: 0.5,
                ease: "power2.in"
            });
        }
    }, [visible]);

    return (
        <div 
            ref={modalRef}
            className="fixed right-6 bottom-32 z-[60] transform translate-x-32 opacity-0"
        >
            <div className="bg-white/80 backdrop-blur-md border border-emerald-200 p-4 rounded-xl shadow-xl max-w-[200px]">
                 <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl animate-bounce">🍀</span>
                    <h4 className="font-cinzel text-emerald-800 font-bold text-xs uppercase">Secret Mission</h4>
                 </div>
                 <p className="text-xs font-inter text-emerald-700 leading-relaxed">
                    Find and collect all the <span className="font-bold">4-leaf clovers</span> floating around! (Scroll to the end to collect them!)
                 </p>
            </div>
        </div>
    );
};

const TransitionScreen = ({ showConfetti }) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(containerRef.current, 
                { opacity: 0 }, 
                { opacity: 1, duration: 1 }
            );
            
            gsap.fromTo(textRef.current,
                { y: 50, opacity: 0, scale: 0.9 },
                { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: "power3.out", delay: 0.5 }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
            <h1 ref={textRef} className="text-6xl md:text-8xl font-serif text-emerald-200 text-center drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                Ready ur outfit ✨
            </h1>
            {showConfetti && <CloverConfetti />}
        </div>
    );
};

const InteractiveOverlay = ({ onComplete }) => {
    // Generate mix: 7 correct (4-leaf)
    const [clovers, setClovers] = useState([]);
    const [collectedCount, setCollectedCount] = useState(0);
    const [showCard, setShowCard] = useState(false);
    const [showFindModal, setShowFindModal] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showTransitionScreen, setShowTransitionScreen] = useState(false);

    const [canInteract, setCanInteract] = useState(false);

    useEffect(() => {
        // Create clovers once on mount
        const correct = Array.from({ length: 7 }).map((_, i) => ({ id: `win-${i}`, leaves: 4 }));
        const decoys = Array.from({ length: 5 }).map((_, i) => ({ id: `decoy-${i}`, leaves: 3 }));
        
        // Shuffle and set
        const mixed = [...correct, ...decoys].sort(() => Math.random() - 0.5);
        setClovers(mixed);

        // Scroll listener for Mission Modal visibility only
        const handleScroll = () => {
            const scrollValues = window.scrollY;
            // Show mission modal after scrolling down a bit (100px)
            if (scrollValues > 100) {
                setShowFindModal(true);
            }
            
            // Enable interaction when near bottom
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
                setCanInteract(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Completion Logic
    useEffect(() => {
        if (collectedCount === 7) {
            setShowConfetti(true);
            
            // 1. Wait a bit for confetti
            const timer1 = setTimeout(() => {
                setShowTransitionScreen(true);
            }, 1500);

            // 2. Wait for transition screen then complete
            const timer2 = setTimeout(() => {
                if (onComplete) onComplete();
            }, 4500); 

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
            };
        }
    }, [collectedCount, onComplete]);

    const handleCollect = (id, isCorrect) => {
        if (isCorrect) {
            // Remove collected clover
            setClovers(prev => prev.filter(c => c.id !== id));
            setCollectedCount(prev => prev + 1);
            setShowCard(true);
        }
    };

    if (showTransitionScreen) {
        return <TransitionScreen showConfetti={showConfetti} />;
    }

    return (
        <>
            <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
                 <div className="pointer-events-none w-full h-full relative">
                    {clovers.map(data => (
                        <Clover 
                            key={data.id} 
                            id={data.id} 
                            leaves={data.leaves}
                            onCollect={handleCollect}
                            isInteractable={canInteract} 
                        />
                    ))}
                 </div>
            </div>
            
            <SideCard count={collectedCount} visible={showCard} />
            
            {/* Find Clover Modal - Shows after partial scroll */}
            <SecretMissionModal visible={showFindModal} />

            {/* Confetti Celebration */}
            {showConfetti && <CloverConfetti />}
        </>
    );
};

export default InteractiveOverlay;
