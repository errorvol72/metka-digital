"use client";

import { ArrowRight, Cpu, Radio, ScanLine } from "lucide-react";
import { motion } from "framer-motion";
import type { Transition } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const highlights = [
  { label: "NFC-метки", value: "VOLUME-NFC" },
  { label: "Формат", value: "Визитка 2025" },
  { label: "Доставка", value: "48 часов" },
];

const features = [
  {
    title: "Касание — контакт",
    description: "Одно прикосновение: профиль, мессенджеры, оплата.",
    icon: Radio,
  },
  {
    title: "Чип + облако",
    description: "NFC-токен, мгновенная ссылка, редиректы без перепрошивки.",
    icon: Cpu,
  },
  {
    title: "Минимализм",
    description: "Чёрный фон, фиолетовый неон, чистые CTA без шума.",
    icon: ScanLine,
  },
];

const floatTransition: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 22,
};

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(130,106,255,0.18) 1px, transparent 1px), linear-gradient(180deg, rgba(130,106,255,0.12) 1px, transparent 1px)",
            backgroundSize: "110px 110px",
          }}
        />
        <div className="absolute left-[-10%] top-[-10%] h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.24),transparent)] blur-3xl" />
        <div className="absolute right-[-8%] top-[25%] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2),transparent)] blur-3xl" />
        <div className="absolute bottom-[-15%] left-[20%] h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.2),transparent)] blur-3xl" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-400 text-black shadow-[0_10px_50px_-20px_rgba(147,51,234,0.8)]">
            V
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-400">
              volume nfc
            </p>
            <p className="text-lg font-semibold">VOLUME-NFC</p>
          </div>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" className="text-sm text-zinc-200 hover:text-white">
            Каталог
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-indigo-400 text-black shadow-[0_10px_60px_-25px_rgba(130,106,255,0.9)] hover:opacity-90">
            Запросить демо
          </Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-16">
        <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <Badge
              variant="outline"
              className="border border-purple-500/40 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.26em] text-purple-200 backdrop-blur"
            >
              новая токен-визитка
            </Badge>

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                VOLUME-NFC — минималистичная визитка с неоновым акцентом
              </h1>
              <p className="max-w-2xl text-base text-zinc-300">
                Чёрный фон, фиолетовый неон, жёсткий контраст. Касание к метке
                открывает ваш профиль и сценарий: визитка, каталог, предзаказ.
                Контент обновляем в облаке, железо трогать не надо.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col gap-3 sm:flex-row"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
            >
              <Button className="h-12 px-6 text-base bg-gradient-to-r from-purple-500 to-indigo-400 text-black shadow-[0_20px_60px_-20px_rgba(130,106,255,0.9)] hover:opacity-90">
                Заказать партию
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-12 px-6 text-base border-purple-400/70 bg-white/5 text-purple-100 shadow-[0_10px_40px_-25px_rgba(130,106,255,0.8)] hover:border-purple-300/80 hover:text-white hover:bg-purple-500/10"
              >
                Скачать демо-ссылку
              </Button>
            </motion.div>

            <motion.div
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:flex-row"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
            >
              <Input
                type="email"
                placeholder="Почта для макета"
                className="h-11 border-white/10 bg-black/40 text-white placeholder:text-zinc-500"
              />
              <Button
                type="submit"
                className="h-11 bg-gradient-to-r from-purple-500 to-indigo-400 text-black hover:opacity-90 sm:w-40"
              >
                Получить
              </Button>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.label}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.99 }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...floatTransition, delay: 0.08 * index }}
                >
                  <Card className="border border-white/10 bg-white/5 p-4 text-white backdrop-blur">
                    <p className="text-sm text-zinc-400">{item.label}</p>
                    <p className="mt-2 text-lg font-semibold">{item.value}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative">
            <Card className="relative overflow-hidden border border-white/10 bg-white/5 p-6 text-white shadow-[0_30px_80px_-40px_rgba(130,106,255,0.9)] backdrop-blur">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.25),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.2),transparent_35%)]" />
              <div className="relative space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">
                    live token
                  </p>
                  <Badge className="border border-white/10 bg-white/10 text-xs text-white">
                    NFC + Cloud
                  </Badge>
                </div>

                <motion.div
                  className="rounded-xl border border-white/10 bg-black/40 p-4"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                        активность
                      </p>
                      <p className="text-2xl font-semibold text-white">
                        72% вовлечения
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-purple-200">
                      <ScanLine className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-purple-500 to-indigo-400" />
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">
                    Моментальная ссылка + push к вашим действиям.
                  </p>
                </motion.div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      whileHover={{ y: -8, scale: 1.02 }}
                      whileTap={{ scale: 0.99 }}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...floatTransition, delay: 0.05 * index }}
                    >
                      <Card className="flex gap-3 border border-white/10 bg-black/40 p-4 backdrop-blur">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-purple-200">
                          <feature.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{feature.title}</p>
                          <p className="text-sm text-zinc-400">
                            {feature.description}
                          </p>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
