"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const SOUND_SRC = "/screaming-sound-effect-when-killing-pigs.mp3";

function ForceSound() {
  useEffect(() => {
    const audio = new Audio(SOUND_SRC);
    audio.loop = true;
    audio.volume = 1;

    const tryPlay = () => {
      audio.volume = 1;
      audio.play().catch(() => {});
    };

    // Автозапуск и повторы
    tryPlay();
    const tick = setInterval(tryPlay, 4000);

    // Запуск по любому взаимодействию, если браузер заблокировал
    const resume = () => {
      tryPlay();
      document.removeEventListener("pointerdown", resume);
      document.removeEventListener("keydown", resume);
    };
    document.addEventListener("pointerdown", resume);
    document.addEventListener("keydown", resume);

    return () => {
      clearInterval(tick);
      document.removeEventListener("pointerdown", resume);
      document.removeEventListener("keydown", resume);
      audio.pause();
    };
  }, []);

  return null;
}

export default function Home() {
  const [boom, setBoom] = useState(false);

  const pigs = useMemo(
    () => Array.from({ length: 120 }, (_, i) => `pig-${i}`),
    []
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <ForceSound />

      {/* Фон со свинками */}
      <div className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.04),transparent_25%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.05),transparent_20%)]">
        <div className="absolute inset-0 animate-pulse text-6xl leading-none">
          <div className="grid h-full w-full grid-cols-6 gap-8 opacity-30">
            {pigs.slice(0, 36).map((key) => (
              <span key={key} className="text-center">🐷</span>
            ))}
          </div>
        </div>
      </div>

      {/* Контент */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <button
          onClick={() => setBoom(true)}
          className="flex h-24 w-24 items-center justify-center rounded-full border border-pink-500/50 bg-gradient-to-br from-pink-500 to-fuchsia-700 text-5xl shadow-[0_0_40px_-10px_rgba(236,72,153,0.8)] transition active:scale-95"
        >
          🐖
        </button>
      </div>

      {/* Взрыв свиней */}
      {boom && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="grid h-full w-full grid-cols-6 gap-6 p-6 text-5xl sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12">
            {pigs.map((key, i) => (
              <motion.span
                key={key}
                initial={{ scale: 0, rotate: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.2, 1],
                  rotate: 360,
                  opacity: 1,
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  delay: i * 0.006,
                }}
                className="select-none text-center"
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
