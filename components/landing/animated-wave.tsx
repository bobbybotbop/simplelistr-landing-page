"use client";

import { useEffect, useRef } from "react";

export function AnimatedWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chars = "·∘○◯◌●◉";
    let time = 0;
    let cachedRect = canvas.getBoundingClientRect();

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      cachedRect = canvas.getBoundingClientRect();
      canvas.width = cachedRect.width * dpr;
      canvas.height = cachedRect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const observer = new IntersectionObserver(
      (entries) => { pausedRef.current = !entries[0].isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const render = () => {
      frameRef.current = requestAnimationFrame(render);
      if (pausedRef.current) return;

      const { width, height } = cachedRect;
      ctx.clearRect(0, 0, width, height);

      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const cols = Math.floor(width / 20);
      const rows = Math.floor(height / 20);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = (x + 0.5) * (width / cols);
          const py = (y + 0.5) * (height / rows);

          const wave1 = Math.sin(x * 0.2 + time * 2) * Math.cos(y * 0.15 + time);
          const wave2 = Math.sin((x + y) * 0.1 + time * 1.5);
          const wave3 = Math.cos(x * 0.1 - y * 0.1 + time * 0.8);

          const combined = (wave1 + wave2 + wave3) / 3;
          const normalized = (combined + 1) / 2;

          const charIndex = Math.floor(normalized * (chars.length - 1));
          const alpha = 0.15 + normalized * 0.5;

          ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
          ctx.fillText(chars[charIndex], px, py);
        }
      }

      time += 0.03;
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
      aria-hidden="true"
    />
  );
}
