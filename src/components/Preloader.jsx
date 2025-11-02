import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Preloader({ onComplete = () => {} }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    // Glitch/typing animation
    const tl = gsap.timeline({ onComplete });
    const chars = Array.from('BOOTING SYSTEM…');

    gsap.set(textRef.current, { textContent: '' });

    tl.to({}, { duration: 0.4 })
      .to(textRef.current, {
        duration: 1.2,
        onUpdate() {
          const current = Math.floor((tl.time() / 1.2) * chars.length);
          const scrambled = chars
            .slice(0, Math.min(current + 1, chars.length))
            .map((c, i) => (i < current ? c : randomGlyph()))
            .join('');
          textRef.current.textContent = scrambled;
        },
        ease: 'none',
      })
      .to(textRef.current, {
        duration: 0.6,
        onStart() {
          // subtle flicker
          gsap.fromTo(
            textRef.current,
            { opacity: 0.6 },
            { opacity: 1, repeat: 6, yoyo: true, duration: 0.08 }
          );
        },
      })
      .to(containerRef.current, { opacity: 0, duration: 0.6 }, ">-0.2");

    return () => tl.kill();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
    >
      <div className="text-center select-none">
        <div
          ref={textRef}
          className="text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.9)] font-mono text-2xl md:text-3xl tracking-[0.25em]"
        >
          BOOTING SYSTEM…
        </div>
        <div className="mt-6 h-1 w-64 md:w-80 bg-cyan-900/40 rounded-full overflow-hidden mx-auto">
          <div className="h-full w-1/3 bg-cyan-400 animate-[loader_1.6s_ease-in-out_infinite] shadow-[0_0_20px_#22d3ee]" />
        </div>
      </div>
      <style>{`
        @keyframes loader {
          0% { transform: translateX(-120%); }
          50% { transform: translateX(40%); }
          100% { transform: translateX(160%); }
        }
      `}</style>
    </div>
  );
}

function randomGlyph() {
  const glyphs = '█▓▒░/\\|<>#*+=-';
  return glyphs[Math.floor(Math.random() * glyphs.length)];
}
