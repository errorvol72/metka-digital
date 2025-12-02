"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Transition } from "framer-motion";

const SOUND_SRC = "/screaming-sound-effect-when-killing-pigs.mp3";

function ForceSound() {
  useEffect(() => {
    const audios = [new Audio(SOUND_SRC), new Audio(SOUND_SRC)];
    audios.forEach((a) => {
      a.loop = true;
      a.volume = 1;
      a.muted = false;
    });

    const tryPlay = () => {
      audios.forEach((a) => {
        a.volume = 1;
        a.muted = false;
        a.play().catch(() => {});
      });
    };

    tryPlay();
    const interval = setInterval(tryPlay, 2000);

    const resume = () => {
      tryPlay();
    };

    document.addEventListener("pointerdown", resume);
    document.addEventListener("touchstart", resume);
    document.addEventListener("keydown", resume);
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("focus", resume);
    window.addEventListener("blur", resume);

    return () => {
      clearInterval(interval);
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
  size: number;
  rotate: number;
  delay?: number;
};

const floatTransition: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 22,
};

const createPigs = (count: number): PigParticle[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `bg-${i}`,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 24 + Math.random() * 36,
    rotate: Math.random() * 360,
  }));

const createExplosion = (count: number): PigParticle[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `boom-${i}`,
    x: -10 + Math.random() * 120,
    y: -10 + Math.random() * 120,
    size: 28 + Math.random() * 38,
    rotate: Math.random() * 720,
    delay: Math.random() * 0.6,
  }));

export default function Home() {
  const [boom, setBoom] = useState<PigParticle[]>([]);
  const [backgroundPigs] = useState<PigParticle[]>(() => createPigs(80));

  const triggerBoom = useCallback(() => {
    setBoom(createExplosion(200));
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <ForceSound />

      {/* Случайный фон со свиньями */}
      <div className="pointer-events-none absolute inset-0">
        {backgroundPigs.map((pig) => (
          <span
            key={pig.id}
            className="absolute select-none opacity-50"
            style={{
              left: `${pig.x}%`,
              top: `${pig.y}%`,
              fontSize: `${pig.size}px`,
              transform: `translate(-50%, -50%) rotate(${pig.rotate}deg)`,
            }}
          >
            🐷
          </span>
        ))}
      </div>

      {/* Кнопка */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <button
          onClick={triggerBoom}
          className="flex h-24 w-24 items-center justify-center rounded-full border border-pink-500/60 bg-gradient-to-br from-pink-500 to-fuchsia-700 text-5xl shadow-[0_0_40px_-10px_rgba(236,72,153,0.8)] transition active:scale-95 hover:scale-105"
          aria-label="BOOM"
        >
          🐖
        </button>
      </div>

      {/* Взрыв свиней */}
      {boom.length > 0 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative h-full w-full">
            {boom.map((pig) => (
              <motion.span
                key={pig.id}
                initial={{ scale: 0, rotate: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.4, 1],
                  rotate: pig.rotate,
                  opacity: 1,
                  x: ["0%", `${pig.x - 50}%`],
                  y: ["0%", `${pig.y - 50}%`],
                }}
                transition={{
                  ...floatTransition,
                  duration: 0.9,
                  delay: pig.delay ?? 0,
                }}
                className="absolute select-none"
                style={{
                  left: "50%",
                  top: "50%",
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
