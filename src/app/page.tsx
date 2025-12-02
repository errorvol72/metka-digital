"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const SOUND_SRC = "/screaming-sound-effect-when-killing-pigs.mp3";
const BG_COUNT = 25;
const EXPLOSION_COUNT = 60;
const EXPLOSION_LIFETIME_MS = 5000;

type StaticPig = {
  id: string;
  x: number;
  y: number;
  size: number;
  rotate: number;
  delay: number;
};

type BlastPig = {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  vr: number;
  size: number;
  rotate: number;
  delay: number;
};

type Viewport = { w: number; h: number };

function ForceSound() {
  useEffect(() => {
    const makeAudio = () => {
      const audio = new Audio(SOUND_SRC);
      audio.loop = true;
      audio.volume = 1;
      audio.muted = false;
      return audio;
    };

    const audios = [makeAudio(), makeAudio()];

    const tryPlay = () => {
      audios.forEach((audio) => {
        audio.volume = 1;
        audio.muted = false;
        if (audio.paused) {
          audio.play().catch(() => {});
        }
      });
    };

    tryPlay();
    const keepAlive = setInterval(tryPlay, 1500);
    const retries: Array<ReturnType<typeof setTimeout>> = [];
    for (let i = 1; i <= 8; i += 1) {
      retries.push(setTimeout(tryPlay, i * 600));
    }

    const resume = () => tryPlay();

    document.addEventListener("pointerdown", resume);
    document.addEventListener("touchstart", resume);
    document.addEventListener("keydown", resume);
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("focus", resume);
    window.addEventListener("blur", resume);

    return () => {
      clearInterval(keepAlive);
      retries.forEach(clearTimeout);
      document.removeEventListener("pointerdown", resume);
      document.removeEventListener("touchstart", resume);
      document.removeEventListener("keydown", resume);
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("focus", resume);
      window.removeEventListener("blur", resume);
      audios.forEach((a) => a.pause());
    };
  }, []);

  return null;
}

const makeBackground = (count: number): StaticPig[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `bg-${i}`,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 18 + Math.random() * 26,
    rotate: Math.random() * 360,
    delay: Math.random() * 0.4,
  }));

const makeBlast = (count: number, view: Viewport): BlastPig[] => {
  const cx = view.w / 2;
  const cy = view.h / 2;

  return Array.from({ length: count }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 420 + Math.random() * 680; // px/s
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const vr = -720 + Math.random() * 1440; // deg/s

    return {
      id: `blast-${i}`,
      x: cx,
      y: cy,
      vx,
      vy,
      vr,
      size: 24 + Math.random() * 32,
      rotate: Math.random() * 360,
      delay: Math.random() * 0.25,
    };
  });
};

function Background({ pigs }: { pigs: StaticPig[] }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {pigs.map((pig) => (
        <span
          key={pig.id}
          className="absolute select-none opacity-30"
          style={{
            left: `${pig.x}%`,
            top: `${pig.y}%`,
            fontSize: `${pig.size}px`,
            transform: `translate(-50%, -50%) rotate(${pig.rotate}deg)`,
            transition: "opacity 0.6s ease",
            transitionDelay: `${pig.delay}s`,
          }}
        >
          🐷
        </span>
      ))}
    </div>
  );
}

function Blast({
  pigs,
  view,
  runKey,
}: {
  pigs: BlastPig[];
  view: Viewport;
  runKey: number;
}) {
  const nodes = useRef<Record<string, HTMLSpanElement | null>>({});
  const data = useRef<BlastPig[]>(pigs);

  useEffect(() => {
    data.current = pigs;
    // стартовая позиция в центре
    const cx = view.w / 2;
    const cy = view.h / 2;
    pigs.forEach((p) => {
      const node = nodes.current[p.id];
      if (node) {
        node.style.transform = `translate(${cx}px, ${cy}px) rotate(${p.rotate}deg) scale(0.6)`;
        node.style.opacity = "0";
      }
    });
  }, [pigs, view]);

  useEffect(() => {
    if (pigs.length === 0) return;
    let active = true;
    let last = performance.now();
    const endAt = last + EXPLOSION_LIFETIME_MS;

    const step = (now: number) => {
      if (!active) return;
      const dt = Math.min((now - last) / 1000, 0.04);
      last = now;
      const { w, h } = view;

      const updated = data.current.map((p) => {
        let x = p.x + p.vx * dt;
        let y = p.y + p.vy * dt;
        let vx = p.vx;
        let vy = p.vy;
        const rotate = p.rotate + p.vr * dt;

        if (x < 0) {
          x = -x;
          vx = -vx;
        } else if (x > w) {
          x = w - (x - w);
          vx = -vx;
        }

        if (y < 0) {
          y = -y;
          vy = -vy;
        } else if (y > h) {
          y = h - (y - h);
          vy = -vy;
        }

        return { ...p, x, y, vx, vy, rotate };
      });

      data.current = updated;
      updated.forEach((p) => {
        const node = nodes.current[p.id];
        if (node) {
          node.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rotate}deg) scale(1)`;
          node.style.opacity = "1";
        }
      });

      if (now < endAt) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
    return () => {
      active = false;
    };
  }, [pigs, view]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.25),transparent_60%)] animate-wave1" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.25),transparent_60%)] animate-wave2" />

      {pigs.map((pig) => (
        <span
          key={`${runKey}-${pig.id}`}
          ref={(node) => {
            nodes.current[pig.id] = node;
          }}
          className="absolute left-0 top-0 select-none will-change-transform"
          style={{
            fontSize: `${pig.size}px`,
            opacity: 0,
            transition: `opacity 0.3s ease ${pig.delay}s`,
          }}
        >
          🐷
        </span>
      ))}
    </div>
  );
}

export default function Home() {
  const background = useMemo(() => makeBackground(BG_COUNT), []);
  const [blast, setBlast] = useState<BlastPig[]>([]);
  const [view, setView] = useState<Viewport>({ w: 1200, h: 800 });
  const [runKey, setRunKey] = useState(0);

  const triggerBoom = useCallback(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    const h = typeof window !== "undefined" ? window.innerHeight : 800;
    const viewport = { w, h };
    setView(viewport);
    setBlast(makeBlast(EXPLOSION_COUNT, viewport));
    setRunKey((k) => k + 1);
    setTimeout(() => setBlast([]), EXPLOSION_LIFETIME_MS);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <style jsx global>{`
        @keyframes wave1 {
          0% {
            transform: translate(-50%, -50%) scale(0.1);
            opacity: 0.9;
          }
          100% {
            transform: translate(-50%, -50%) scale(16);
            opacity: 0;
          }
        }
        @keyframes wave2 {
          0% {
            transform: translate(-50%, -50%) scale(0.1);
            opacity: 0.9;
          }
          100% {
            transform: translate(-50%, -50%) scale(18);
            opacity: 0;
          }
        }
        .animate-wave1 {
          animation: wave1 1.8s ease-out forwards;
        }
        .animate-wave2 {
          animation: wave2 2s ease-out forwards 50ms;
        }
      `}</style>

      <ForceSound />

      <Background pigs={background} />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <button
          onClick={triggerBoom}
          className="flex h-24 w-24 items-center justify-center rounded-full border border-pink-500/60 bg-gradient-to-br from-pink-500 to-fuchsia-700 text-5xl shadow-[0_0_50px_-12px_rgba(236,72,153,0.9)] transition active:scale-95 hover:scale-110"
          aria-label="BOOM"
        >
          🐖
        </button>
      </div>

      {blast.length > 0 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <Blast pigs={blast} view={view} runKey={runKey} />
        </div>
      )}
    </div>
  );
}
