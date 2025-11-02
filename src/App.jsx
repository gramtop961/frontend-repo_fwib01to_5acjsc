import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import ParticleField from './components/ParticleField';
import Preloader from './components/Preloader';
import AudioToggle from './components/AudioToggle';

function App() {
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    // Load cyber fonts dynamically without touching index.html
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap';
    document.head.appendChild(link);

    const t = setTimeout(() => setBooted(true), 2100);
    return () => {
      clearTimeout(t);
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white">
      {!booted && <Preloader onComplete={() => setBooted(true)} />}

      {/* Background 3D + particles */}
      <div className="absolute inset-0">
        <ParticleField />
      </div>

      {/* Main hero */}
      <Hero />

      {/* Ambient control */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-30 -translate-x-1/2 md:left-8 md:translate-x-0">
        <div className="pointer-events-auto">
          <AudioToggle />
        </div>
      </div>

      {/* HUD corners */}
      <div className="pointer-events-none fixed inset-0 z-30">
        <Corner position="tl" />
        <Corner position="tr" />
        <Corner position="bl" />
        <Corner position="br" />
      </div>
    </div>
  );
}

function Corner({ position }) {
  const base = 'absolute w-20 h-20 opacity-60';
  const map = {
    tl: 'top-0 left-0 border-l border-t',
    tr: 'top-0 right-0 border-r border-t',
    bl: 'bottom-0 left-0 border-l border-b',
    br: 'bottom-0 right-0 border-r border-b',
  };
  return (
    <div
      className={`${base} ${map[position]} border-cyan-400/40 [mask-image:radial-gradient(80%_80%_at_0%_0%,#000_30%,transparent_70%)]`}
    />
  );
}

export default App;
