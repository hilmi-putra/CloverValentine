/* eslint-disable react/no-unknown-property */
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import gsap from 'gsap';
import TextPressure from './TextPressure';

// Extend MeshLine
extend({ MeshLineGeometry, MeshLineMaterial });

// --- Aurora Background Component ---
const AuroraBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black z-0 pointer-events-none">
       {/* Aurora colors: usually green, purple, blue */}
       <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-tr from-emerald-900 via-slate-900 to-black animate-aurora-spin opacity-50"></div>
       
       <div className="absolute top-0 left-0 w-full h-full mix-blend-screen opacity-60">
           <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-emerald-500/30 rounded-full blur-[100px] animate-blob-float"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-purple-500/30 rounded-full blur-[100px] animate-blob-float animation-delay-2000"></div>
           <div className="absolute top-[40%] left-[40%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[80px] animate-blob-float animation-delay-4000"></div>
       </div>

       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 mix-blend-overlay"></div>
       
       <style>{`
          @keyframes aurora-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes blob-float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-aurora-spin { animation: aurora-spin 20s linear infinite; }
          .animate-blob-float { animation: blob-float 10s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
       `}</style>
    </div>
  );
};

// --- Physics Lanyard Component ---
function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false }) {
  const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef();
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3();
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 };

  // Load User's Texture
  const texture = useTexture('https://res.cloudinary.com/dahvjvesd/image/upload/v1770986951/yo_can_call_me_anyting_you_want_bxm8ea.png');
  
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]));
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.1, z: ang.z });
    }
  });

  curve.curveType = 'chordal';

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        
        {/* The Dragable Card Body */}
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          
          <group
            scale={2.25}
            position={[0, 0, -0.05]} // Centered on RigidBody
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={(e) => (e.target.setPointerCapture(e.pointerId), drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation()))))}
          >
            {/* Card Mesh - Constructed manually since no GLB */}
            <mesh>
                <boxGeometry args={[0.7, 1.0, 0.02]} /> {/* Slightly smaller than collider for visuals */}
                <meshStandardMaterial 
                    color="white"
                    roughness={0.2}
                    metalness={0.1}
                    map={texture} // Apply user image here
                />
            </mesh>
            
            {/* Simple Connector Box */}
            <mesh position={[0, 0.55, 0]}>
                <boxGeometry args={[0.2, 0.15, 0.05]} />
                <meshStandardMaterial color="black" />
            </mesh>
          </group>
        </RigidBody>
      </group>
      
      {/* The Connecting Band/Strap */}
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial 
            color="white" 
            depthTest={false} 
            resolution={[window.innerWidth, window.innerHeight]} 
            lineWidth={1} 
        />
      </mesh>
    </>
  );
}

function LanyardCanvas({ isActive }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="absolute inset-0 z-10 w-full h-full pointer-events-auto">
            <Canvas
                camera={{ position: [0, 0, 13], fov: 25 }}
                dpr={[1, 2]}
            >
                <ambientLight intensity={Math.PI} />
                <Physics gravity={[0, -40, 0]} timeStep={1 / 60}>
                    <Band isMobile={isMobile} />
                </Physics>
                <Environment blur={0.75}>
                    <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
                    <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
                    <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
                    <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
                </Environment>
            </Canvas>
        </div>
    );
}


// --- Main Page Component ---
const UgmMotivation = ({ isActive, onComplete }) => {
    const [phase, setPhase] = useState('transition'); // 'transition' | 'content'
    const [timeLeft, setTimeLeft] = useState(35);
    const transitionContainerRef = useRef(null);

    useEffect(() => {
        if (!isActive) return;

        if (phase === 'transition') {
            // Animate Transition Out after 5 seconds
            const tl = gsap.timeline();
            
            tl.to(transitionContainerRef.current, {
                opacity: 0,
                duration: 1,
                delay: 2, // Shortened transition delay slightly for better flow
                ease: "power2.in",
                onComplete: () => setPhase('content')
            });
        }
    }, [isActive, phase]);

    // Countdown Timer Logic
    useEffect(() => {
        if (phase === 'content') {
            if (timeLeft > 0) {
                const timerId = setTimeout(() => {
                    setTimeLeft(prev => prev - 1);
                }, 1000);
                return () => clearTimeout(timerId);
            } else {
                if (onComplete) onComplete();
            }
        }
    }, [phase, timeLeft, onComplete]);

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 z-[600] overflow-hidden bg-black text-white font-sans">
            
            {/* Phase 1: Transition Text (TextPressure) */}
            {phase === 'transition' && (
                <div ref={transitionContainerRef} className="flex items-center justify-center h-full w-full p-10 bg-black absolute inset-0 z-20">
                    <div className="w-full h-[600px] relative"> 
                        <TextPressure
                            text="SEMANGAT YA NAK UGM"
                            flex={true}
                            alpha={true}
                            stroke={false}
                            width={true}
                            weight={true}
                            italic={true}
                            textColor="#34d399" // Emerald-400 equivalent
                            minFontSize={36}
                        />
                    </div>
                </div>
            )}

            {/* Phase 2: Content (Aurora + 3D Lanyard) */}
            {phase === 'content' && (
                <>
                    <AuroraBackground />
                    
                    {/* Timer Display */}
                    <div className="fixed top-8 right-8 z-50 pointer-events-none flex flex-col items-end">
                        <span className="text-6xl font-bold font-mono text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse">
                            {timeLeft}
                        </span>
                        <span className="text-xs uppercase tracking-widest text-emerald-200/70">Respite Time</span>
                    </div>

                    <div className="relative w-full h-full flex flex-col md:flex-row items-center justify-center pointer-events-none">
                        
                        {/* 3D Lanyard Area (Has its own pointer events) */}
                        <div className="absolute inset-0 z-10 pointer-events-auto">
                             <LanyardCanvas isActive={true} />
                        </div>

                        {/* Text Area (Aside/Overlay) */}
                        <div className="absolute top-[20%] w-full flex justify-center pointer-events-none z-20 px-4">
                             <div className="text-center bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-emerald-500/20 shadow-2xl max-w-2xl animate-fade-in-up">
                                <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 text-white drop-shadow-lg">
                                    Hopeless <span className="text-emerald-400 italic">Romantic</span>
                                </h2>
                                <p className="text-sm md:text-lg text-emerald-100/90 leading-relaxed">
                                    This is your small reminder that you’re capable of amazing things.
                                    Breathe. Recharge. Don’t overlove the wrong person.

                                    And listen… I’m a hopeless romantic too, so I get it.

                                    You can go full “Dorami mode” — loving someone like it’s a drama series.

                                    Or we can sit pretty and wait for someone who actually shows insane effort for us.

                                    Two hopeless romantics trying to act chill — but still believing in the right kind of crazy love.
                                    <br/>
                                    <span className="text-emerald-300 text-xs italic opacity-80 mt-2 block">(Drag the card to play!)</span>
                                </p>
                             </div>
                        </div>
                    </div>

                    {/* Manual Skip Button */}
                    <button 
                        onClick={() => onComplete && onComplete()}
                        className="fixed bottom-8 right-8 z-50 text-white/30 hover:text-white text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 cursor-pointer pointer-events-auto"
                    >
                        Skip Timer ➔
                    </button>
                    
                    <style>{`
                        .animate-fade-in-up {
                            animation: fadeInUp 1s ease-out forwards;
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        @keyframes fadeInUp {
                            to { opacity: 1; transform: translateY(0); }
                        }
                    `}</style>
                </>
            )}
        </div>
    );
};

export default UgmMotivation;
