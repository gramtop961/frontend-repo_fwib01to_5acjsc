import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AudioToggle() {
  const [enabled, setEnabled] = useState(false);
  const audioCtxRef = useRef(null);
  const gainRef = useRef(null);
  const oscRef = useRef(null);

  useEffect(() => {
    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = async () => {
    if (!audioCtxRef.current) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const gain = ctx.createGain();
      gain.gain.value = 0.02; // soft ambient
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = 70; // low hum
      // slight modulation
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.2;
      lfoGain.gain.value = 8;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      osc.connect(gain).connect(ctx.destination);
      osc.start();
      lfo.start();

      audioCtxRef.current = ctx;
      gainRef.current = gain;
      oscRef.current = osc;
    }
  };

  const stop = () => {
    if (oscRef.current) {
      try { oscRef.current.stop(); } catch {}
      oscRef.current.disconnect();
      oscRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
  };

  const toggle = async () => {
    if (!enabled) {
      await start();
      setEnabled(true);
    } else {
      stop();
      setEnabled(false);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={enabled ? 'Mute ambient' : 'Unmute ambient'}
      className="group inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-black/30 px-4 py-2 text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-300/10 hover:text-cyan-100"
    >
      {enabled ? (
        <Volume2 className="h-5 w-5" />
      ) : (
        <VolumeX className="h-5 w-5" />
      )}
      <span className="text-xs tracking-widest">AMBIENT</span>
    </button>
  );
}
