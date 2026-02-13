import React, { useState, useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import PasscodeGate from './components/PasscodeGate';
import MusicSelection from './components/MusicSelection';
import BloomingIntro from './components/BloomingIntro';
import InteractiveOverlay from './components/InteractiveOverlay';
import Hero from './components/Hero';
import Letter from './components/Letter';
import Gallery from './components/Gallery';
import Layout from './layouts/Layout';
import MusicPlayer from './components/MusicPlayer';
import PhotoBooth from './components/PhotoBooth';
import FinalMessage from './components/FinalMessage';
import UgmMotivation from './components/UgmMotivation';
import Outro from './components/Outro';

const App = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [isMusicSelected, setIsMusicSelected] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // BloomingIntro active
  const [showPhotoBooth, setShowPhotoBooth] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [showUgmMotivation, setShowUgmMotivation] = useState(false);
  const [showOutro, setShowOutro] = useState(false);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);
    
    // GSAP Ticker for Lenis
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
    
    return () => {
       lenis.destroy();
    };
  }, []);

  const handleMusicSelect = (track) => {
    if (audioRef.current) {
        audioRef.current.src = track.src;
        audioRef.current.loop = true;
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        setSelectedTrack(track);
        setIsMusicSelected(true);
    }
  };

  return (
    <>
      {isLocked ? (
        <PasscodeGate onUnlock={() => setIsLocked(false)} />
      ) : !isMusicSelected ? (
        <MusicSelection onSelect={handleMusicSelect} />
      ) : (
        <>
          {isLoading && <BloomingIntro onComplete={() => setIsLoading(false)} />}
          
          {!isLoading && !showPhotoBooth && (
            <Layout>
              <InteractiveOverlay onComplete={() => setShowPhotoBooth(true)} />
              <Hero />
              <Letter />
              <Gallery />
            </Layout>
          )}

          {showPhotoBooth && !showFinalMessage && (
            <PhotoBooth 
                frameSrc="/frame.png" 
                onComplete={() => setShowFinalMessage(true)} 
            />
          )}

          {/* Condition: Show FinalMessage ONLY if UgmMotivation is NOT active yet */}
          {showFinalMessage && !showUgmMotivation && (
            <FinalMessage 
                isActive={true} 
                onComplete={() => setShowUgmMotivation(true)} 
            />
          )}

          {/* Condition: Show UgmMotivation if active and Outro is not yet active */}
          {showUgmMotivation && !showOutro && (
            <UgmMotivation 
                isActive={true} 
                onComplete={() => setShowOutro(true)}
            />
          )}

          {/* Condition: Show Outro */}
          {showOutro && <Outro isActive={true} />}

          {/* Persistent Music Player */}
          {selectedTrack && (
            <MusicPlayer track={selectedTrack} audioRef={audioRef} />
          )}
        </>
      )}
    </>
  );
};

export default App;
