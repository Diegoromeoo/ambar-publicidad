"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotionPreference } from "@/lib/motion-preference";

/**
 * Polvo de oro flotante en <canvas>. Optimizado para móvil:
 * - densidad según área (máx. 34 partículas en móvil), DPR limitado a 2
 * - se pausa fuera de pantalla o con la pestaña oculta
 * - con las animaciones en pausa (interruptor "Animaciones") dibuja un solo cuadro estático
 */
export function GoldParticles({ className, density = 1 }: { className?: string; density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotionPreference();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const palette = ["247,224,143", "212,175,55", "197,160,89", "245,158,11", "255,244,200"];

    // Sprite con halo pre-renderizado (más barato que shadowBlur por partícula)
    const sprites = palette.map((rgb) => {
      const s = document.createElement("canvas");
      s.width = s.height = 32;
      const g = s.getContext("2d")!;
      const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, `rgba(${rgb},1)`);
      grad.addColorStop(0.25, `rgba(${rgb},0.85)`);
      grad.addColorStop(0.5, `rgba(${rgb},0.18)`);
      grad.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = grad;
      g.fillRect(0, 0, 32, 32);
      return s;
    });

    type P = { x: number; y: number; r: number; vy: number; vx: number; phase: number; tw: number; sprite: HTMLCanvasElement; depth: number };
    let particles: P[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let visible = true;
    const pointer = { x: -9999, y: -9999, active: false };

    const spawn = (anywhere: boolean): P => {
      const depth = Math.random();
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : h + 20,
        r: 0.6 + depth * 2.4,
        vy: -(0.08 + depth * 0.32),
        vx: (Math.random() - 0.5) * 0.08,
        phase: Math.random() * Math.PI * 2,
        tw: 0.6 + Math.random() * 1.6,
        sprite: sprites[Math.floor(Math.random() * sprites.length)],
        depth,
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(Math.min((w * h) / (coarse ? 13000 : 9000), coarse ? 34 : 110) * density);
      if (particles.length > target) particles = particles.slice(0, target);
      while (particles.length < target) particles.push(spawn(true));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        if (!reduced) {
          p.y += p.vy;
          p.x += p.vx + Math.sin(t * 0.0006 + p.phase) * 0.12 * (0.4 + p.depth);
          if (pointer.active) {
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 14000) {
              const f = (1 - d2 / 14000) * 0.9;
              p.x += (dx / Math.sqrt(d2 + 0.01)) * f;
              p.y += (dy / Math.sqrt(d2 + 0.01)) * f;
            }
          }
          if (p.y < -20 || p.x < -20 || p.x > w + 20) Object.assign(p, spawn(false));
        }
        const twinkle = 0.45 + 0.55 * Math.abs(Math.sin(t * 0.001 * p.tw + p.phase));
        const size = p.r * 6;
        ctx.globalAlpha = (0.25 + p.depth * 0.6) * twinkle;
        ctx.drawImage(p.sprite, p.x - size / 2, p.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    draw(0);
    start();

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw(performance.now());
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = pointer.y > 0 && pointer.y < rect.height;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [density, reduced]);

  return <canvas ref={canvasRef} aria-hidden className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} />;
}
