"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Transition } from "framer-motion";

const SOUND_SRC = "/screaming-sound-effect-when-killing-pigs.mp3";

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
    const retries: NodeJS.Timeout[] = [];
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

type PigParticle = {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  vr: number;
  size: number;
  rotate: number;
  delay?: number;
};

type Viewport = { w: number; h: number };

const floatTransition: Transition = {
  type: "spring",
  stiffness: 180,
  damping: 16,
  mass: 0.4,
};

const createPigs = (count: number): Omit<PigParticle, "vx" | "vy" | "vr">[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `bg-${i}`,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 24 + Math.random() * 36,
    rotate: Math.random() * 360,
    delay: Math.random() * 0.4,
  }));

const createExplosion = (count: number, view: Viewport): PigParticle[] => {
  const cx = view.w / 2;
  const cy = view.h / 2;

  return Array.from({ length: count }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 450 + Math.random() * 700; // px/s
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const vr = -720 + Math.random() * 1440; // deg/s

    return {
      id: `boom-${i}`,
      x: cx,
      y: cy,
      vx,
      vy,
      vr,
      size: 26 + Math.random() * 34,
      rotate: Math.random() * 360,
      delay: Math.random() * 0.25,
    };
  });
};

export default function Home() {
  const [boom, setBoom] = useState<PigParticle[]>([]);
  const [backgroundPigs] = useState(() => createPigs(40));
  const [waveKey, setWaveKey] = useState(0);
  const [view, setView] = useState<Viewport>({ w: 1200, h: 800 });
  const boundsRef = useRef(view);

  useEffect(() => {
    boundsRef.current = view;
  }, [view]);

  const triggerBoom = useCallback(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    const h = typeof window !== "undefined" ? window.innerHeight : 800;
    const viewport = { w, h };
    setView(viewport);
    setBoom(createExplosion(90, viewport));
    setWaveKey((k) => k + 1);
  }, []);

  // simple physics with bounces
  useEffect(() => {
    if (boom.length === 0) return;

    let active = true;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.04);
      last = now;
      setBoom((prev) => {
        const { w, h } = boundsRef.current;
        return prev.map((p) => {
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
      });

      if (active) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
    return () => {
      active = false;
    };
  }, [boom.length]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <ForceSound />

      {/* Случайный фон со свиньями */}
      <div className="pointer-events-none absolute inset-0">
        {backgroundPigs.map((pig) => (
          <motion.span
            key={pig.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ duration: 0.6, delay: pig.delay ?? 0 }}
            className="absolute select-none"
            style={{
              left: `${pig.x}%`,
              top: `${pig.y}%`,
              fontSize: `${pig.size}px`,
              transform: `translate(-50%, -50%) rotate(${pig.rotate}deg)`,
            }}
          >
            🐷
          </motion.span>
        ))}
      </div>

      {/* Кнопка */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <button
          onClick={triggerBoom}
          className="flex h-24 w-24 items-center justify-center rounded-full border border-pink-500/60 bg-gradient-to-br from-pink-500 to-fuchsia-700 text-5xl shadow-[0_0_50px_-12px_rgba(236,72,153,0.9)] transition active:scale-95 hover:scale-110"
          aria-label="BOOM"
        >
          🐖
        </button>
      </div>

      {/* Взрыв свиней + волны */}
      {boom.length > 0 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative h-full w-full">
            {/* Неоновые волны на весь экран */}
            <motion.div
              key={`wave-${waveKey}-1`}
              className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.3),transparent_60%)]"
              initial={{ scale: 0.1, opacity: 0.9 }}
              animate={{ scale: 18, opacity: 0 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              style={{ translateX: "-50%", translateY: "-50%" }}
            />
            <motion.div
              key={`wave-${waveKey}-2`}
              className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.28),transparent_60%)]"
              initial={{ scale: 0.1, opacity: 0.9 }}
              animate={{ scale: 20, opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut", delay: 0.05 }}
              style={{ translateX: "-50%", translateY: "-50%" }}
            />

            {boom.map((pig) => (
              <motion.span
                key={pig.id}
                initial={{
                  x: view.w / 2,
                  y: view.h / 2,
                  scale: 0.4,
                  opacity: 0,
                }}
                animate={{
                  x: pig.x,
                  y: pig.y,
                  rotate: pig.rotate,
                  scale: 1,
                  opacity: 1,
                }}
                transition={{
                  ...floatTransition,
                  duration: 0.6,
                  delay: pig.delay ?? 0,
                }}
                className="absolute select-none"
                style={{
                  left: 0,
                  top: 0,
                  fontSize: `${pig.size}px`,
                }}
              >
                🐷
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
