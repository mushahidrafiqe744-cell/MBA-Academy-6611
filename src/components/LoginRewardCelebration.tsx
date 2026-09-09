import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Check, Volume2, VolumeX, X } from 'lucide-react';

interface LoginRewardCelebrationProps {
  isOpen: boolean;
  userName: string;
  userRole: 'student' | 'teacher' | 'admin';
  coinsAwarded?: number;
  totalCoins: number;
  onClose: () => void;
}

// Sound effect synthesizer via Web Audio API (Zero external file dependencies)
const playCelebrationAudio = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // Fanfare chords + Coin chimes
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + idx * 0.1 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 0.5);
    });

    // High sparkling coin ring at 0.5s
    setTimeout(() => {
      const coinOsc = ctx.createOscillator();
      const coinGain = ctx.createGain();
      coinOsc.type = 'sine';
      coinOsc.frequency.setValueAtTime(1975.53, ctx.currentTime); // B6
      coinOsc.frequency.exponentialRampToValueAtTime(2637.02, ctx.currentTime + 0.15); // E7

      coinGain.gain.setValueAtTime(0.3, ctx.currentTime);
      coinGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      coinOsc.connect(coinGain);
      coinGain.connect(ctx.destination);
      coinOsc.start();
      coinOsc.stop(ctx.currentTime + 0.6);
    }, 550);
  } catch (e) {
    console.warn('Audio play restricted or unsupported:', e);
  }
};

export const LoginRewardCelebration: React.FC<LoginRewardCelebrationProps> = ({
  isOpen,
  userName,
  userRole,
  coinsAwarded = 10,
  totalCoins,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [displayedCoins, setDisplayedCoins] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Play audio and start count-up on open
  useEffect(() => {
    if (!isOpen) {
      setDisplayedCoins(0);
      return;
    }

    if (soundEnabled) {
      playCelebrationAudio();
    }

    // Animated count up for 10 coins
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current <= coinsAwarded) {
        setDisplayedCoins(current);
      } else {
        clearInterval(interval);
      }
    }, 70);

    return () => clearInterval(interval);
  }, [isOpen, soundEnabled, coinsAwarded]);

  // Flower Petals & Blossoms Rain on HTML5 Canvas
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Color palettes for petals
    const petalColors = [
      '#ff758c', '#ff7eb3', '#f8bbd0', '#f48fb1', // Cherry Pink
      '#e91e63', '#d81b60', '#ff4081',             // Rose
      '#ffe082', '#ffd54f', '#ffca28',             // Yellow Jasmine / Marigold
      '#ffffff', '#fce4ec', '#f3e5f5',             // White / Lilac
      '#ff8a80', '#ff5252'                         // Coral
    ];

    // Flower emoji icons that also float and flutter
    const flowerEmojis = ['🌸', '🌺', '🌹', '🌷', '🌼', '💐', '🌻'];

    interface Petal {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
      sway: number;
      swaySpeed: number;
      isEmoji: boolean;
      emojiChar: string;
      opacity: number;
    }

    const petals: Petal[] = [];
    const count = 90;

    for (let i = 0; i < count; i++) {
      const isEmoji = i % 3 === 0;
      petals.push({
        x: Math.random() * width,
        y: Math.random() * -height * 1.2, // Start scattered above screen
        size: isEmoji ? 18 + Math.random() * 16 : 10 + Math.random() * 14,
        speedY: 1.5 + Math.random() * 2.8,
        speedX: (Math.random() - 0.5) * 1.5,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.02 + Math.random() * 0.03,
        isEmoji,
        emojiChar: flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)],
        opacity: 0.75 + Math.random() * 0.25
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.sway += p.swaySpeed;
        p.x += Math.sin(p.sway) * 1.8 + p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Reset when falling past screen bottom
        if (p.y > height + 40) {
          p.y = -30;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        if (p.isEmoji) {
          ctx.font = `${Math.floor(p.size)}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.emojiChar, 0, 0);
        } else {
          // Draw a natural realistic curved flower petal
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.5, p.size * 0.9, p.size * 0.3, 0, p.size);
          ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.3, -p.size * 0.6, -p.size * 0.5, 0, 0);
          ctx.fill();

          // Subtle petal vein highlight
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1;
          ctx.moveTo(0, 0);
          ctx.lineTo(0, p.size * 0.75);
          ctx.stroke();
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Full screen canvas for flower rain */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10"
      />

      {/* Floating 10 Gold Coins Burst Emitter */}
      <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => {
          const delay = i * 0.12;
          const leftPercent = 50 + (Math.cos((i / 10) * Math.PI * 2) * 22);
          const topPercent = 48 + (Math.sin((i / 10) * Math.PI * 2) * 20);
          return (
            <div
              key={i}
              className="absolute text-2xl md:text-3xl filter drop-shadow-[0_0_12px_rgba(250,204,21,0.8)] animate-bounce"
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                animationDelay: `${delay}s`,
                animationDuration: '1.6s',
                transform: 'translate(-50%, -50%)',
              }}
            >
              🪙
            </div>
          );
        })}
      </div>

      {/* Main Celebration Popup Card */}
      <div className="relative z-20 max-w-md w-full bg-gradient-to-b from-white via-amber-50/40 to-orange-50/30 rounded-3xl shadow-[0_25px_60px_-15px_rgba(245,158,11,0.4)] border-2 border-amber-300/80 p-6 md:p-8 text-center animate-in zoom-in-95 duration-300">
        
        {/* Controls bar */}
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 transition text-xs flex items-center gap-1 font-bold cursor-pointer"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span className="text-[10px]">{soundEnabled ? 'Sound On' : 'Muted'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Top Flower Crown & Badge */}
        <div className="relative inline-block mb-3">
          <div className="text-4xl md:text-5xl animate-pulse select-none">
            🌸 🌺 💐 🌷 🌸
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-extrabold text-[11px] uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-md border border-white/40">
            ✨ Login Celebration & Flower Shower ✨
          </div>
        </div>

        {/* Urdu Greeting */}
        <div className="mt-3 mb-1">
          <p className="text-amber-900 font-serif text-sm font-bold tracking-wide">
            خوش آمدید! پھولوں کی برسات اور انعام
          </p>
        </div>

        {/* Personalized Welcome Headline */}
        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-snug">
          Welcome, <span className="text-blue-700 underline decoration-amber-400 decoration-wavy decoration-2">{userName}</span>!
        </h2>
        <div className="inline-flex items-center gap-1.5 mt-1 px-3 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider">
          <span>{userRole === 'teacher' ? '🏫 Faculty Teacher' : userRole === 'admin' ? '🛡️ Administrator' : '🎓 Academy Student'}</span>
        </div>

        {/* Golden Coin Reward Box */}
        <div className="my-5 p-5 bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 rounded-3xl text-white shadow-xl relative overflow-hidden border border-yellow-200">
          {/* Background Shimmer */}
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/20 rounded-full blur-xl pointer-events-none"></div>

          {/* Big 3D Coin Graphic */}
          <div className="relative z-10 flex items-center justify-center gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-b from-yellow-100 via-amber-300 to-yellow-600 border-4 border-yellow-100 shadow-[0_0_25px_rgba(255,255,255,0.8)] flex items-center justify-center text-3xl md:text-4xl animate-spin-slow">
              🪙
            </div>

            <div className="text-left">
              <div className="text-[11px] font-black uppercase tracking-widest text-amber-950/80">
                Reward Added To Wallet
              </div>
              <div className="text-3xl md:text-4xl font-black text-amber-950 flex items-center gap-1 drop-shadow-xs">
                <span>+{displayedCoins}</span>
                <span className="text-lg font-extrabold text-amber-900">Coins</span>
              </div>
              <div className="text-xs text-amber-950 font-bold flex items-center gap-1 mt-0.5">
                <Sparkles size={13} className="text-amber-900" />
                <span>10 MBA Coins Gift Claimed!</span>
              </div>
            </div>
          </div>

          {/* Total Balance Ribbon */}
          <div className="mt-4 pt-3 border-t border-amber-900/15 flex items-center justify-between text-xs font-bold text-amber-950">
            <span>Your Total Wallet Balance:</span>
            <span className="bg-amber-950 text-amber-300 px-3 py-1 rounded-full text-xs font-mono font-extrabold shadow-inner">
              🪙 {totalCoins} Coins
            </span>
          </div>
        </div>

        {/* Message description */}
        <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto mb-5">
          آپ کے اکاؤنٹ میں <strong className="text-amber-700">10 کوائنز</strong> شامل کر دیے گئے ہیں۔ یہ کوائنز آپ کے پروفائل میں محفوظ رہیں گے!
        </p>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition duration-200 hover:scale-[1.02] cursor-pointer"
        >
          <Check size={18} className="stroke-[3]" />
          <span>شکریہ! Claim 10 Coins & Continue</span>
        </button>

        <p className="text-[10px] text-slate-400 font-medium mt-2">
          Click anywhere or press continue to start exploring MBA Academy
        </p>
      </div>
    </div>
  );
};

export default LoginRewardCelebration;
