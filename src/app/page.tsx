"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Transition } from "framer-motion";

const SOUND_SRC = "/screaming-sound-effect-when-killing-pigs.mp3";

type StaticPig = {
  id: string;
  x: number;
  y: number;
  size: number;
  rotate: number;
  delay?: number;
};

type BlastPig = {
  id: string;
  size: number;
  rotate: number;
  delay?: number;
  tx: number;
  ty: number;
};

const floatTransition: Transition = {
  type: "spring",
  stiffness: 180,
  damping: 18,
  mass: 0.5,
};

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
    size: 20 + Math.random() * 28,
    rotate: Math.random() * 360,
    delay: Math.random() * 0.4,
  }));

const makeBlast = (count: number): BlastPig[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `blast-${i}`,
    size: 28 + Math.random() * 30,
    rotate: Math.random() * 720,
    delay: Math.random() * 0.25,
    tx: -120 + Math.random() * 240,
    ty: -120 + Math.random() * 240,
  }));

function Background({ pigs }: { pigs: StaticPig[] }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {pigs.map((pig) => (
        <motion.span
          key={pig.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
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
  );
}

function Blast({
  pigs,
  runKey,
}: {
  pigs: BlastPig[];
  runKey: number;
}) {
  return (
    <div className="relative h-full w-full">
      <motion.div
        key={`wave1-${runKey}`}
        className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.3),transparent_60%)]"
        initial={{ scale: 0.1, opacity: 0.9 }}
        animate={{ scale: 18, opacity: 0 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        style={{ translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        key={`wave2-${runKey}`}
        className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.3),transparent_60%)]"
        initial={{ scale: 0.1, opacity: 0.9 }}
        animate={{ scale: 20, opacity: 0 }}
        transition={{ duration: 1.8, ease: "easeOut", delay: 0.05 }}
        style={{ translateX: "-50%", translateY: "-50%" }}
      />

      {pigs.map((pig) => (
        <motion.span
          key={pig.id}
          initial={{ scale: 0.4, opacity: 0, x: 0, y: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            x: pig.tx,
            y: pig.ty,
            rotate: pig.rotate,
          }}
          transition={{
            ...floatTransition,
            duration: 0.6,
            delay: pig.delay ?? 0,
          }}
          className="absolute left-1/2 top-1/2 select-none will-change-transform"
          style={{
            fontSize: `${pig.size}px`,
            translateX: "-50%",
            translateY: "-50%",
          }}
        >
          🐷
        </motion.span>
      ))}
    </div>
  );
}

export default function Home() {
  const background = useMemo(() => makeBackground(30), []);
  const [blast, setBlast] = useState<BlastPig[]>([]);
  const [runKey, setRunKey] = useState(0);

  const triggerBoom = useCallback(() => {
    setBlast(makeBlast(60));
    setRunKey((k) => k + 1);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
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
          <Blast pigs={blast} runKey={runKey} />
        </div>
      )}
    </div>
  );
}
