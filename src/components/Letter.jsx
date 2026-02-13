import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VariableProximity from './VariableProximity';

gsap.registerPlugin(ScrollTrigger);

const Letter = () => {
  const containerRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    // Static visible for stability
  }, []);

  return (
    <section ref={containerRef} className="min-h-screen py-24 md:py-32 flex justify-center items-center relative overflow-hidden z-10 px-4">
        
        {/* Card Container - Premium Paper Look */}
        <div 
          ref={cardRef}
          className="relative w-full max-w-2xl bg-[#fdfbf7] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] p-8 md:p-16 rounded-sm rotate-1 transform transition-transform duration-700 hover:rotate-0"
          style={{
            backgroundImage: `url("https://www.transparenttextures.com/patterns/cream-paper.png")`,
            backgroundBlendMode: 'multiply'
          }}
        >
          {/* Outer Border (Gold foil effect) */}
          <div className="absolute inset-2 border border-amber-900/10 pointer-events-none"></div>
          {/* Inner Border (Classic Frame) */}
          <div className="absolute inset-6 border-2 border-double border-emerald-900/10 pointer-events-none"></div>

          {/* Top Section: To/From & Stamps */}
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
             {/* Left: To/From */}
            <div className="flex-1 space-y-6 w-full md:w-auto font-playfair text-emerald-950">
              <div className="flex items-end gap-3 group">
                <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] mb-1 text-emerald-800/60 uppercase">To.</span>
                <div className="relative flex-1 pb-1">
                  <span className="text-3xl md:text-4xl font-serif italic text-emerald-900 ml-2">zahraa</span>
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-emerald-900/20 group-hover:w-full transition-all duration-500"></div>
                </div>
              </div>
              <div className="flex items-end gap-3 group">
                <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] mb-1 text-emerald-800/60 uppercase">From.</span>
                <div className="relative flex-1 pb-1">
                  <span className="text-3xl md:text-4xl font-serif italic text-emerald-900 ml-2">hilmi</span>
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-emerald-900/20 group-hover:w-full transition-all duration-500"></div>
                </div>
              </div>
            </div>

            {/* Right: Stamps */}
            <div className="flex gap-4 self-center md:self-start opacity-90 mix-blend-multiply">
               {/* Stamp 1 */}
               <div className="w-20 h-24 bg-emerald-50 border-[3px] border-dotted border-emerald-800/40 p-1 flex flex-col items-center justify-center relative rotate-2 shadow-sm">
                 <div className="w-full h-full border border-emerald-800/20 flex flex-col items-center justify-center">
                    <svg className="w-8 h-8 text-emerald-700/60 mb-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    <span className="text-[0.5rem] font-bold text-emerald-800/50 uppercase tracking-widest">Air Mail</span>
                 </div>
               </div>
               {/* Stamp 2 */}
               <div className="w-20 h-24 bg-rose-50 border-[3px] border-dotted border-rose-800/40 p-1 flex flex-col items-center justify-center relative -rotate-3 shadow-sm" style={{ marginLeft: '-15px', marginTop: '10px' }}>
                 <div className="w-full h-full border border-rose-800/20 flex flex-col items-center justify-center">
                    <span className="text-2xl">🌷</span>
                    <span className="text-[0.5rem] font-bold text-rose-800/50 uppercase tracking-widest mt-1">Special</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="relative z-10 space-y-8 text-center px-2 md:px-8 font-serif italic flex flex-col items-center">
              <div style={{ position: 'relative' }}>
                <VariableProximity
                    label={"In a world that often rushes by, finding a friendship like ours feels like discovering a quiet garden in the middle of a storm."}
                    className={'variable-proximity-demo cursor-default text-xl md:text-2xl text-emerald-950/90 leading-relaxed'}
                    fromFontVariationSettings="'wght' 400, 'opsz' 9"
                    toFontVariationSettings="'wght' 900, 'opsz' 40"
                    containerRef={containerRef}
                    radius={80}
                    falloff="linear"
                />
              </div>

              <div style={{ position: 'relative' }}>
                <VariableProximity
                    label={"This Valentine's isn't just about romance; it's about celebrating the love that steadies us."}
                    className={'variable-proximity-demo cursor-default text-xl md:text-2xl text-emerald-950/90 leading-relaxed'}
                    fromFontVariationSettings="'wght' 400, 'opsz' 9"
                    toFontVariationSettings="'wght' 900, 'opsz' 40"
                    containerRef={containerRef}
                    radius={80}
                    falloff="linear"
                />
              </div>

             <div style={{ position: 'relative' }}>
                <VariableProximity
                    label={"The late-night talks, the shared silences, and the way you understand the unsaid."}
                    className={'variable-proximity-demo cursor-default text-xl md:text-2xl text-emerald-950/90 leading-relaxed'}
                    fromFontVariationSettings="'wght' 400, 'opsz' 9"
                    toFontVariationSettings="'wght' 900, 'opsz' 40"
                    containerRef={containerRef}
                    radius={80}
                    falloff="linear"
                />
             </div>

              <div style={{ position: 'relative' }}>
                <VariableProximity
                    label={"You are a rare gem, a constant source of light. Thank you for being you, for being here, and for walking this path with me."}
                    className={'variable-proximity-demo cursor-default text-xl md:text-2xl text-emerald-950/90 leading-relaxed'}
                    fromFontVariationSettings="'wght' 400, 'opsz' 9"
                    toFontVariationSettings="'wght' 900, 'opsz' 40"
                    containerRef={containerRef}
                    radius={80}
                    falloff="linear"
                />
              </div>
          </div>

          {/* Footer & Wax Seal */}
          <div className="relative mt-16 pt-8 flex flex-col items-center justify-center border-t border-emerald-900/10">
            {/* Wax Seal */}
            <div className="absolute -bottom-6 right-8 md:right-16 w-24 h-24 bg-red-800/90 rounded-full shadow-lg flex items-center justify-center transform rotate-12 opacity-90" style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.4), 2px 4px 6px rgba(0,0,0,0.3)' }}>
                <div className="w-20 h-20 border-[3px] border-red-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-red-100/20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </div>
            </div>

            {/* Postmark (Faded) */}
            <div className="absolute left-8 -top-8 w-32 h-32 rounded-full border-2 border-emerald-900/20 flex items-center justify-center opacity-30 -rotate-12 pointer-events-none">
                <div className="text-[0.6rem] font-bold text-emerald-900 uppercase tracking-widest text-center leading-tight">
                    Post Office<br/>Valentine St.<br/>14 FEB
                </div>
            </div>
          </div>

        </div>
    </section>
  );
};

export default Letter;
