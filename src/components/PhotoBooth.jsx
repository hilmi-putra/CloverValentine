import React, { useRef, useState, useEffect } from 'react';
import PrankPayment from './PrankPayment';
import ShaderBackground from './ShaderBackground';



const PhotoBooth = ({ onRetake, frameSrc, onComplete }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [isCapturingSequence, setIsCapturingSequence] = useState(false);
  const [photo, setPhoto] = useState(null); 
  const [countdown, setCountdown] = useState(null);
  const [flash, setFlash] = useState(false);

  // Floating Clovers Effect
  const [clovers, setClovers] = useState([]);
  useEffect(() => {
    const newClovers = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      animDuration: 5 + Math.random() * 10,
      animDelay: Math.random() * 5,
      size: 1 + Math.random() * 1.5,
      opacity: 0.3 + Math.random() * 0.4
    }));
    setClovers(newClovers);
  }, []);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  useEffect(() => {
      if (capturedImages.length > 0) {
          updateCanvas(capturedImages);
      }
  }, [capturedImages]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: 1280, height: 720 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const startCaptureSequence = () => {
      setCapturedImages([]);
      setPhoto(null);
      setIsCapturingSequence(true);
      // Start the first shot immediately
      runCountdownAndCapture(0);
  };

  const runCountdownAndCapture = (shotIndex) => {
      // Ensure we don't exceed 3 shots
      if (shotIndex >= 3) {
          setIsCapturingSequence(false);
          return;
      }

      setCountdown(3);
      let count = 3;
      const timer = setInterval(() => {
          count--;
          if (count > 0) {
              setCountdown(count);
          } else {
              clearInterval(timer);
              setCountdown(null);
              triggerFlash();
              captureSingleShot(shotIndex);
          }
      }, 1000);
  };

  const triggerFlash = () => {
      setFlash(true);
      setTimeout(() => setFlash(false), 200);
  };

  const captureSingleShot = (shotIndex) => {
      const video = videoRef.current;
      if (!video) return;

      const canvas = document.createElement('canvas');
      const w = 1280; 
      const h = 720;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      
      ctx.save();
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, w, h);
      ctx.restore();

      const imageData = canvas.toDataURL('image/png');
      
      setCapturedImages(prev => [...prev, imageData]);

      if (shotIndex < 2) {
          setTimeout(() => {
              runCountdownAndCapture(shotIndex + 1);
          }, 1000);
      } else {
          setIsCapturingSequence(false);
      }
  };

  const updateCanvas = (images) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      
      const w = 600; 
      const h = 1800; // 3:9 ratio
      canvas.width = w;
      canvas.height = h;

      // Draw Background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);

      // Define Fixed Photo Slots (based on the "Red Box" visual guidance)
      // These are absolute coordinates on the 600x1800 canvas
      const paddingX = 0; 
      const slotWidth = w; // Full width
      const slotHeight = 500; 
      
      const slots = [
          { x: 0, y: 10, w: slotWidth, h: 520 }, // Top - Adjusted height/y to fill better
          { x: 0, y: 510, w: slotWidth, h: 520 }, // Middle
          { x: 0, y: 1010, w: slotWidth, h: 520 } // Bottom
      ];

      const drawImages = async () => {
          for (let i = 0; i < 3; i++) {
              if (images[i] && slots[i]) {
                  await new Promise(resolve => {
                      const img = new Image();
                      img.src = images[i];
                      img.onload = () => {
                          const slot = slots[i];
                          
                          // Source Dimensions
                          const sw = img.width;
                          const sh = img.height;
                          
                          // Target Dimensions
                          const dw = slot.w;
                          const dh = slot.h;
                          
                          // Calculate Aspect Ratios
                          const sourceAspect = sw / sh;
                          const targetAspect = dw / dh;
                          
                          let renderSx, renderSy, renderSw, renderSh;
                          
                          // Cover Logic: Crop the source to fit the target ratio
                          if (sourceAspect > targetAspect) {
                              // Source is wider than target: Crop width
                              renderSh = sh;
                              renderSw = sh * targetAspect;
                              renderSy = 0;
                              renderSx = (sw - renderSw) / 2;
                          } else {
                              // Source is taller than target: Crop height
                              renderSw = sw;
                              renderSh = sw / targetAspect;
                              renderSx = 0;
                              renderSy = (sh - renderSh) / 2;
                          }
                          
                          // Draw into the absolute slot coordinates
                          ctx.save();
                          // Optional: Add rounded corners or clipping if needed by the "card" concept
                          // ctx.beginPath();
                          // ctx.rect(slot.x, slot.y, slot.w, slot.h);
                          // ctx.clip();
                          
                          ctx.drawImage(
                              img, 
                              renderSx, renderSy, renderSw, renderSh, // Source crop
                              slot.x, slot.y, dw, dh // Destination
                          );
                          
                          ctx.restore();
                          resolve();
                      };
                  });
              }
          }

          // Overlay Frame
          const frameImg = new Image();
          frameImg.onload = () => {
              ctx.drawImage(frameImg, 0, 0, w, h);
              setPhoto(canvas.toDataURL('image/png'));
          };
          frameImg.onerror = (e) => {
              console.error("Failed to load frame image", e);
              // Fallback: save photo without frame if frame fails
              setPhoto(canvas.toDataURL('image/png'));
          };
          frameImg.src = "/frame.svg";
      };
      
      drawImages();
  };

  const download = () => {
      if (!photo) return;
      const link = document.createElement('a');
      link.download = 'clover-photobooth.png';
      link.href = photo;
      link.click();
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 overflow-hidden bg-transparent">
        <ShaderBackground />
        {/* Floating Background Effects */}
        <style>{`
          @keyframes floatUp {
            0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
            10% { opacity: var(--opacity); }
            90% { opacity: var(--opacity); }
            100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
          }
        `}</style>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {clovers.map((clover) => (
                <div 
                    key={clover.id}
                    className="absolute text-emerald-300/30 drop-shadow-[0_0_5px_rgba(52,211,153,0.3)]"
                    style={{
                        left: `${clover.left}%`,
                        fontSize: `${clover.size}rem`,
                        '--opacity': clover.opacity,
                        animation: `floatUp ${clover.animDuration}s linear infinite`,
                        animationDelay: `-${clover.animDelay}s`,
                        top: 0 
                    }}
                >
                    🍀
                </div>
            ))}
        </div>

        <h2 className="relative z-10 text-4xl font-serif text-emerald-200 mb-6 drop-shadow-[0_0_10px_rgba(167,243,208,0.5)]">
            Clover Booth <span className="animate-pulse">🌸</span>
        </h2>

        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center justify-center w-full max-w-6xl">
            
            {/* Camera Preview */}
            <div className={`relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-8 border-emerald-900/50 bg-black transition-all duration-500`} style={{ width: 'min(90vw, 640px)', aspectRatio: '16/9' }}>
                 <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                 
                 {/* Live Overlay UI */}
                 <div className="absolute top-6 left-0 right-0 text-center pointer-events-none">
                     {isCapturingSequence ? (
                         <div className="inline-block px-6 py-2 bg-red-500/80 backdrop-blur-sm rounded-full text-white font-bold tracking-wider animate-pulse shadow-lg">
                             Recording Shot {capturedImages.length + 1} / 3
                         </div>
                     ) : (
                        <div className="inline-block px-6 py-2 bg-emerald-500/30 backdrop-blur-md rounded-full text-emerald-100 font-medium text-sm tracking-wide border border-emerald-500/20">
                             Live Preview
                        </div>
                     )}
                 </div>

                 {/* Countdown */}
                 {countdown && (
                     <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                         <span className="text-[120px] font-bold text-white drop-shadow-2xl animate-ping font-mono">{countdown}</span>
                     </div>
                 )}
            </div>

            {/* Photo Strip Result */}
            <div className="relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-lg overflow-hidden bg-white/5 border-[min(1vw,8px)] border-white/20 h-[60vh] md:h-[600px] aspect-[1/3] transition-transform hover:scale-[1.02] duration-300">
                 {photo ? (
                    <img src={photo} alt="Photobooth Strip" className="w-full h-full object-contain bg-white" />
                 ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-emerald-100/30 gap-4 bg-emerald-900/20">
                        <div className="w-16 h-16 border-2 border-dashed border-emerald-100/30 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">✨</span>
                        </div>
                        <p className="font-serif italic tracking-widest text-sm">Waiting for magic...</p>
                    </div>
                 )}
            </div>
        </div>

        {/* Hidden Canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Buttons */}
        <div className="mt-10 flex gap-6 z-[150]">
            {capturedImages.length < 3 ? (
                <button 
                onClick={startCaptureSequence}
                disabled={isCapturingSequence}
                className={`px-10 py-4 rounded-full font-bold shadow-xl transition-all transform flex items-center gap-3 text-lg
                    ${isCapturingSequence 
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed scale-95' 
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white hover:scale-105 active:scale-95 hover:shadow-emerald-500/50'
                    }`}
                >
                {isCapturingSequence ? (
                    <><span className="animate-spin">🌀</span> Capturing...</>
                ) : (
                    <>📸 Start Session</>
                )}
                </button>
            ) : (
                <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <button 
                        onClick={() => {
                            setCapturedImages([]);
                            setPhoto(null);
                            setIsCapturingSequence(false);
                            setCountdown(null);
                        }}
                        className="px-8 py-3 border-2 border-emerald-400/50 text-emerald-100 rounded-full font-bold hover:bg-emerald-500/20 transition-all hover:border-emerald-400"
                    >
                        ↺ Retake
                    </button>
                    <button 
                        onClick={download}
                        className="px-10 py-3 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-300 hover:to-pink-400 text-white rounded-full font-bold shadow-xl shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                        ⬇ Save Photo
                    </button>
                </div>
            )}
        </div>
        {/* Bank Prank Integration */}
        <PrankPayment isActive={!!photo} onComplete={onComplete} />
    </div>
  );
};

export default PhotoBooth;
