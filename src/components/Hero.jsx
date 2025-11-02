import { useEffect, useRef, useState } from 'react';
import Spline from '@splinetool/react-spline';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

export default function Hero() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const [startRedirect, setStartRedirect] = useState(false);

  useEffect(() => {
    // Title glitch flicker
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
    tl.to(titleRef.current, { filter: 'brightness(1.6)', duration: 0.08 })
      .to(titleRef.current, { filter: 'brightness(1)', duration: 0.08 })
      .to(titleRef.current, { x: 1, duration: 0.02 })
      .to(titleRef.current, { x: 0, duration: 0.02 })
      .to(titleRef.current, { skewX: 2, duration: 0.02 })
      .to(titleRef.current, { skewX: 0, duration: 0.02 });

    gsap.fromTo(
      subtitleRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.2, delay: 0.6 }
    );

    return () => tl.kill();
  }, []);

  const handleEnter = () => {
    // small burst and fade to black, then redirect
    setStartRedirect(true);
    setTimeout(() => {
      window.location.href = 'https://yourwebsite.com';
    }, 900);
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/BL9Cjn3fkAdLBhXm/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Neon gradient overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_20%,rgba(12,212,255,0.18),transparent),radial-gradient(40%_30%_at_20%_80%,rgba(236,72,153,0.20),transparent),radial-gradient(30%_20%_at_80%_60%,rgba(168,85,247,0.18),transparent)]" />

      {/* Particles canvas sits above Spline */}
      <div className="absolute inset-0">
        {/* mounted by parent App to keep separation of concerns */}
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <h1
          ref={titleRef}
          className="font-black tracking-[0.2em] text-4xl sm:text-5xl md:text-7xl text-cyan-200 drop-shadow-[0_0_18px_rgba(34,211,238,0.9)]"
          style={{ fontFamily: 'Orbitron, Share Tech Mono, monospace' }}
        >
          AGNINEXUS
        </h1>
        <p
          ref={subtitleRef}
          className="mt-3 text-sm sm:text-base md:text-xl text-cyan-100/80 tracking-[0.35em]"
          style={{ fontFamily: 'Share Tech Mono, Orbitron, monospace' }}
        >
          SYSTEM ONLINE
        </p>

        <motion.button
          whileHover={{ scale: 1.06, boxShadow: '0 0 24px rgba(34, 211, 238, 0.9)' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleEnter}
          className="group relative mt-10 rounded-full border border-cyan-400/70 bg-black/50 px-8 py-3 text-cyan-100 backdrop-blur-md transition-colors hover:bg-cyan-400/10"
          style={{ fontFamily: 'Orbitron, Share Tech Mono, monospace' }}
        >
          <span className="relative z-10 tracking-[0.35em]">ENTER MAINFRAME</span>
          <span className="absolute inset-0 -z-[0] rounded-full bg-cyan-400/20 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
          <span className="absolute inset-0 -z-[0] rounded-full bg-gradient-to-r from-cyan-400/30 via-pink-500/20 to-purple-500/30 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
        </motion.button>
      </div>

      {/* Transition overlay */}
      <AnimatePresence>
        {startRedirect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            className="pointer-events-none absolute inset-0 z-40 bg-black"
          >
            <div className="absolute inset-0 opacity-40 [background:repeating-linear-gradient(0deg,rgba(0,255,255,0.15)_0px,rgba(0,255,255,0.15)_1px,transparent_1px,transparent_3px)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
