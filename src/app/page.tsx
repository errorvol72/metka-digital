"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Transition } from "framer-motion";

const SOUND_SRC = "/screaming-sound-effect-when-killing-pigs.mp3";

function ForceSound() {
  useEffect(() => {
    const build = () => {
      const a = new Audio(SOUND_SRC);
      a.loop = true;
      a.volume = 1;
      a.muted = false;
      return a;
    };

    const audios = [build(), build(), build()];

    const tryPlay = () => {
      audios.forEach((audio) => {
        audio.volume = 1;
        audio.muted = false;
        audio.currentTime = 0;
        audio.play().catch(() => {});
      });
    };

    // Мгновенные попытки
    tryPlay();
    const burst = setInterval(tryPlay, 1200);
    // Немного продлеваем попытки после загрузки
    const retries: NodeJS.Timeout[] = [];
    for (let i = 1; i <= 5; i += 1) {
      retries.push(setTimeout(tryPlay, i * 800));
    }

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
      clearInterval(burst);
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
    size: 28 + Math.random() * 42,
    rotate: Math.random() * 960,
    delay: Math.random() * 0.4,
  }));

export default function Home() {
  const [boom, setBoom] = useState<PigParticle[]>([]);
  const [backgroundPigs] = useState<PigParticle[]>(() => createPigs(120));
  const [waveKey, setWaveKey] = useState(0);

  const triggerBoom = useCallback(() => {
    setBoom(createExplosion(260));
    setWaveKey((k) => k + 1);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <ForceSound />

      {/* Случайный фон со свиньями */}
      <div className="pointer-events-none absolute inset-0">
        {backgroundPigs.map((pig) => (
          <span
            key={pig.id}
            className="absolute select-none opacity-40"
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

      {/* Взрыв свиней + волны */}
      {boom.length > 0 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative h-full w-full">
            {/* Неоновые волны */}
            <motion.div
              key={`wave-${waveKey}-1`}
              className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.35),transparent_60%)]"
              initial={{ scale: 0.2, opacity: 0.9 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{ translateX: "-50%", translateY: "-50%" }}
            />
            <motion.div
              key={`wave-${waveKey}-2`}
              className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.35),transparent_60%)]"
              initial={{ scale: 0.2, opacity: 0.9 }}
              animate={{ scale: 4.6, opacity: 0 }}
              transition={{ duration: 1.3, ease: "easeOut", delay: 0.05 }}
              style={{ translateX: "-50%", translateY: "-50%" }}
            />

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
