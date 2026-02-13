import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import TextPressure from './TextPressure';

const PasscodeGate = ({ onUnlock }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [viewState, setViewState] = useState('recommendation'); // 'recommendation' -> 'passcode'
  const [failedAttempts, setFailedAttempts] = useState(0); 
  const [hintStage, setHintStage] = useState(0);         
  
  const inputRefs = useRef([]);
  const containerRef = useRef(null);
  const hintRef = useRef(null);

  // 1. HEADPHONE RECOMMENDATION ANIMATION
  useEffect(() => {
    if (viewState === 'recommendation') {
        gsap.fromTo(".rec-text", 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.3, ease: "power2.out" }
        );
    }
  }, [viewState]);

  // 2. PASSCODE ENTRANCE
  useEffect(() => {
    if (viewState === 'passcode') {
        const tl = gsap.timeline();
        
        // Inputs Entrance
        setTimeout(() => {
            const inputs = document.querySelectorAll('.passcode-input');
            if(inputs.length > 0) {
                gsap.fromTo(inputs, 
                    { scale: 0, opacity: 0, y: 20 },
                    { scale: 1, opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" }
                );
                // Auto focus first input
                if (inputRefs.current[0]) inputRefs.current[0].focus();
            }
        }, 800);
    }
  }, [viewState]);

  // Hint Entrance
  useEffect(() => {
    if (failedAttempts === 1 && hintRef.current) {
        gsap.fromTo(hintRef.current, 
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        );
    }
  }, [failedAttempts]);

  const handleChange = (index, value) => {
    if (value && !/^\d*$/.test(value)) return; 
    
    const newCode = [...code];
    // Allow replacing a digit if already filled (for better UX)
    newCode[index] = value.slice(-1); 
    
    if (value.length > 0 && index < 5) {
        inputRefs.current[index + 1]?.focus();
    }

    setCode(newCode);

    const fullCode = newCode.join('');
    if (fullCode.length === 6 && !newCode.includes('')) {
        checkCode(fullCode);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const checkCode = (enteredCode) => {
    // Constraint: User interaction with hint required if set.
    // Must trigger hint at least once even if code is correct initially.
    if (enteredCode === "010507" && hintStage > 0) {
       // Success
       gsap.to(".passcode-input", {
         scale: 1.1,
         borderColor: "#10b981", 
         boxShadow: "0 0 20px #10b981",
         duration: 0.2,
         yoyo: true,
         repeat: 1
       });
       
       gsap.to(containerRef.current, {
        opacity: 0,
        scale: 1.1,
        filter: "blur(10px)",
        duration: 1,
        ease: "power2.inOut",
        onComplete: onUnlock
      });

    } else {
      // Fail
      setFailedAttempts(prev => prev + 1);

      // Shake
      gsap.to(".passcode-input", {
        x: 10,
        duration: 0.1,
        repeat: 5,
        yoyo: true,
        ease: "none",
        onComplete: () => {
             gsap.to(".passcode-input", { x: 0, duration: 0.1 });
             setCode(['', '', '', '', '', '']); 
             inputRefs.current[0]?.focus();
        }
      });
      
      // Flash Red
      gsap.fromTo(".passcode-input",
        { borderColor: "#ef4444" }, 
        { borderColor: "transparent", duration: 0.5 } 
      );
    }
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] flex flex-col items-center justify-center text-white overflow-hidden bg-black font-sans">
        
        {/* RECOMMENDATION VIEW */}
        {viewState === 'recommendation' && (
            <div 
                className="flex flex-col items-center justify-center h-full w-full cursor-pointer z-50 p-8 text-center"
                onClick={() => setViewState('passcode')}
            >
                <div className="rec-text mb-6">
                    <svg className="w-16 h-16 mx-auto text-emerald-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    <h2 className="text-2xl md:text-3xl font-light tracking-wide text-white">Use headphones for better experience</h2>
                </div>
                <p className="rec-text text-sm md:text-base text-gray-500 font-light tracking-widest uppercase">
                    Open on laptop recommended
                </p>
                <p className="rec-text text-[10px] md:text-sm text-gray-600 font-serif italic mt-4">
                    follow the flow, don't fight it ⚠️
                </p>
                <p className="rec-text mt-12 text-xs text-white/30 animate-pulse">Click anywhere to start</p>
            </div>
        )}

        {/* PASSCODE VIEW */}
        {viewState === 'passcode' && (
            <div className="flex flex-col items-center z-50 w-full max-w-lg">
                
                {/* TextPressure Title */}
                <div className="relative h-32 w-full mb-12 flex items-center justify-center">
                    <TextPressure
                        text="WELCOME"
                        flex={true}
                        alpha={false}
                        stroke={false}
                        width={true}
                        weight={true}
                        italic={true}
                        textColor="#ffffff"
                        minFontSize={48}
                    />
                </div>

                {/* Inputs */}
                <div className="flex gap-2 md:gap-4">
                    {code.map((digit, index) => {
                        const isFilled = digit !== '';
                        // Determine border color: Green if filled/active, Transparent otherwise (or styled via CSS)
                        // User request: "hovernya pada saat diisi hijau" -> implies active/filled state is green
                        
                        return (
                            <div key={index} className="relative group">
                                <input
                                    ref={el => inputRefs.current[index] = el}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className={`
                                        passcode-input w-12 h-14 md:w-16 md:h-20 
                                        bg-white/10 backdrop-blur-md rounded-lg text-white text-center text-3xl md:text-4xl font-bold 
                                        focus:outline-none transition-all duration-300
                                        border-2 
                                        ${isFilled ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] bg-white/20' : 'border-white/10 hover:border-white/30'}
                                        focus:border-emerald-500 focus:bg-black/60
                                    `}
                                />
                            </div>
                        );
                    })}
                </div>

                <p className="mt-12 text-gray-500 text-xs tracking-[0.2em] uppercase">
                    Enter the access pin to continue
                </p>
            </div>
        )}

       {/* Hint Button (Same logic, slightly updated style) */}
       {failedAttempts >= 1 && (
        <div 
            ref={hintRef}
            onClick={() => setHintStage(prev => Math.min(prev + 1, 4))}
            className={`fixed right-0 top-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-md border border-white/10 border-r-0 rounded-l-2xl p-4 cursor-pointer hover:bg-white/10 transition-all z-[60] ${hintStage > 0 ? 'pr-8' : 'pr-6'}`}
        >
            {hintStage === 0 ? (
                <div className="flex flex-col items-center gap-2">
                    <span className="text-xl">💡</span>
                    <span className="text-[10px] font-light tracking-widest uppercase text-emerald-100/60" style={{ writingMode: 'vertical-rl' }}>
                    need a hint?
                    </span>
                </div>
            ) : (
                <div className="text-center animate-fade-in min-w-[150px]">
                     {hintStage === 1 && <p className="text-sm font-serif text-emerald-100">r u sure?</p>}
                     {hintStage === 2 && <p className="text-sm font-serif text-emerald-100">really??</p>}
                     {hintStage === 3 && <p className="text-sm font-serif text-emerald-100">okaii for last chance?</p>}
                     {hintStage === 4 && (
                        <p className="text-sm font-serif italic text-emerald-100 leading-relaxed">
                            coba isi lagi, you give me a pin on tsm
                        </p>
                     )}
                </div>
            )}
        </div>
      )}

    </div>
  );
};

export default PasscodeGate;
