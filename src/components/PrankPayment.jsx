import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import ShaderBackground from './ShaderBackground';

const PrankPayment = ({ isActive, onComplete }) => {
  const [showIdlePrompt, setShowIdlePrompt] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [prankState, setPrankState] = useState('initial'); // 'initial', 'shuffling', 'reveal'
  const [displayContent, setDisplayContent] = useState('');
  
  // Refs for animation
  const idleModalRef = useRef(null);
  const bankModalRef = useRef(null);

  const [timeLeft, setTimeLeft] = useState(60);

  // Timer Logic
  useEffect(() => {
    let interval;
    if (isActive && !showIdlePrompt && !showBankModal) {
        interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setShowIdlePrompt(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    } else {
        if (!isActive) setTimeLeft(60);
    }
    return () => clearInterval(interval);
  }, [isActive, showIdlePrompt, showBankModal]);

  // GSAP Animations - Idle Prompt
  useEffect(() => {
    if (showIdlePrompt && idleModalRef.current) {
        gsap.fromTo(idleModalRef.current, 
            { scale: 0.9, opacity: 0, rotation: -2 }, 
            { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: "elastic.out(1, 0.75)" }
        );
    }
  }, [showIdlePrompt]);

  // GSAP Animations - Bank Modal
  useEffect(() => {
    if (showBankModal && bankModalRef.current) {
        gsap.fromTo(bankModalRef.current, 
            { y: 100, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" }
        );
    }
  }, [showBankModal]);

  // Auto-transition to Final Message 5 seconds after prank reveal
  useEffect(() => {
    if (prankState === 'reveal') {
        const timer = setTimeout(() => {
            if (onComplete) onComplete();
        }, 5000);
        return () => clearTimeout(timer);
    }
  }, [prankState, onComplete]);

  const handleIdleResponse = (isDone) => {
      setShowIdlePrompt(false);
      if (isDone) {
          setShowBankModal(true);
      } else {
          setTimeLeft(60);
      }
  };

  const handleBankClick = () => {
      setPrankState('shuffling');
      
      const timeline = [
          { text: "Siap siap ya...", duration: 2000 },
          { text: "3", duration: 1000 },
          { text: "2", duration: 1000 },
          { text: "1", duration: 1000 },
          { text: "ALL", duration: 300 } // Muncul seliwat (300ms)
      ];

      let currentIndex = 0;

      const runSequence = () => {
          if (currentIndex < timeline.length) {
              setDisplayContent(timeline[currentIndex].text);
              const duration = timeline[currentIndex].duration;
              currentIndex++;
              setTimeout(runSequence, duration);
          } else {
              setPrankState('reveal');
          }
      };

      runSequence();
  };

  if (!isActive) return null;

  return (
    <>
        {/* Timer UI (Enhanced Visibility) */}
        {!showIdlePrompt && !showBankModal && (
            <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] pointer-events-none">
                <div className="bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-emerald-500/30 text-emerald-400 text-sm font-bold font-mono tracking-widest shadow-lg">
                     SESSION: {timeLeft}s
                </div>
            </div>
        )}

        {/* Idle Prompt */}
        {showIdlePrompt && (
            <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                <div ref={idleModalRef} className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                    <div className="text-4xl mb-4">👀</div>
                    <h3 className="text-xl font-light text-white mb-2 font-mono">udah lomm?? ga juga gapapasi</h3>
                    <p className="text-xs text-gray-500 mb-8 tracking-widest uppercase">System Waiting...</p>
                    <div className="flex gap-4 justify-center">
                        <button 
                            onClick={() => handleIdleResponse(false)}
                            className="px-8 py-3 rounded-xl border border-white/5 text-gray-400 hover:bg-white/5 hover:text-white text-xs tracking-wider transition-all"
                        >
                            lom
                        </button>
                        <button 
                            onClick={() => handleIdleResponse(true)}
                            className="px-8 py-3 rounded-xl bg-emerald-500 text-black font-bold text-xs tracking-wider hover:bg-emerald-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                        >
                            dah
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Payment / Prank Interaction */}
        {showBankModal && (
            <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
                <div ref={bankModalRef} className="w-full max-w-md relative z-10">
                    
                    {prankState === 'initial' && (
                        <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden relative group flex flex-col justify-center min-h-[400px]">
                            {/* Decorative Gloss */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                            
                            <h2 className="text-2xl text-white font-light mb-1">Kamu minta norek kann <span className="text-emerald-500 text-xs align-top">REQ</span></h2>
                            <p className="text-gray-500 text-xs mb-8 font-mono">pilih aja nihh tapi jangannn marah lagi</p>
                            
                            <div className="space-y-3">
                                {[
                                    { name: "Livin' by Mandiri", img: "https://res.cloudinary.com/dahvjvesd/image/upload/v1770825840/livin_lv8rux.svg" },
                                    { name: "BCA Mobile", img: "https://res.cloudinary.com/dahvjvesd/image/upload/v1770825840/bca_trhuiu.svg" },
                                    { name: "BRImo", img: "https://res.cloudinary.com/dahvjvesd/image/upload/v1770825840/bri_qvyu7y.svg" }
                                ].map((bank, i) => (
                                    <button 
                                        key={i}
                                        onClick={handleBankClick}
                                        className="w-full bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-4 flex items-center justify-between group transition-all duration-300 hover:border-emerald-500/30"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1">
                                                <img src={bank.img} alt={bank.name} className="w-full h-full object-contain" />
                                            </div>
                                            <span className="text-sm text-gray-300 font-medium group-hover:text-white transition-colors">{bank.name}</span>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-gray-700 group-hover:bg-emerald-500 transition-colors"></div>
                                    </button>
                                ))}
                            </div>
                            
                            <div className="mt-auto border-t border-white/5 flex justify-between items-center text-[10px] text-gray-600 font-mono pt-4">
                                <span>SECURE CHECKOUT</span>
                                <span>ID: #L0V3-999</span>
                            </div>
                        </div>
                    )}

                    {prankState === 'shuffling' && (
                        <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-full h-full bg-emerald-500/5 animate-pulse pointer-events-none"></div>
                             
                             <div className="text-emerald-500 font-mono text-xs tracking-[0.3em] mb-8">
                                 {displayContent === 'ALL' ? 'RETRIEVING DATA...' : 'SYSTEM MESSAGE'}
                             </div>
                             
                             {displayContent === 'ALL' ? (
                                 <div className="space-y-4 w-full scale-95 blur-[0.5px]">
                                      <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                          <div className="text-xs text-gray-400">BRI</div>
                                          <div className="text-white font-mono text-lg">0598 #### 1680 505 EFFORT BGT</div>
                                      </div>
                                      <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                          <div className="text-xs text-gray-400">Bank Mandiri</div>
                                          <div className="text-white font-mono text-lg">131002487#### KLO BERHASIL</div>
                                          <div className="text-[10px] text-emerald-400">HILMI ABDURRAFI PUTR</div>
                                      </div>
                                      <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                          <div className="text-xs text-gray-400">BCA</div>
                                          <div className="text-white font-mono text-lg">####201262 SS KE AKU</div>
                                      </div>
                                 </div>
                             ) : (
                                 <div className="text-center w-full animate-bounce">
                                    <div className="text-4xl md:text-6xl font-mono text-white font-bold tracking-tighter">
                                        {displayContent}
                                    </div>
                                 </div>
                             )}

                             <div className="mt-8 w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
                                 <div className="h-full bg-emerald-500 w-full animate-loading-bar"></div>
                             </div>
                        </div>
                    )}

                    {prankState === 'reveal' && (
                        <div className="relative text-center">
                            {/* Chaos Background */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 select-none overflow-hidden">
                                <span className="text-[20rem] font-bold text-white rotate-12 blur-sm">?</span>
                            </div>

                             <div className="relative z-10 bg-[#0f0f0f]/80 backdrop-blur-xl border border-red-500/30 rounded-3xl p-10 transform transition-all duration-500 hover:scale-105">
                                 <div className="text-6xl mb-4 animate-bounce">
                                    😝
                                 </div>
                                 <button
                                    onClick={() => {
                                        setShowBankModal(false);
                                        setPrankState('initial');
                                        if (onComplete) onComplete(); 
                                    }}
                                    className="px-8 py-3 rounded-full bg-white text-black font-bold text-sm hover:bg-gray-200 transition-colors"
                                 >
                                     Lanjuttt ➔
                                 </button>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        )}
        
        <style>{`
            .shimmer-text {
                background: linear-gradient(to right, #ffffff, #10b981, #ffffff);
                background-size: 200% auto;
                color: transparent;
                -webkit-background-clip: text;
                background-clip: text;
                animation: shimmer 2s linear infinite;
            }
            @keyframes shimmer {
                to { background-position: 200% center; }
            }
            @keyframes loading-bar {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            .animate-loading-bar {
                animation: loading-bar 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            }
            .animate-fade-in-up {
                animation: fadeInUp 0.5s ease-out;
            }
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `}</style>
    </>
  );
};

export default PrankPayment;
