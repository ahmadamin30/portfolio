import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface FogBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

interface CloudNode {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  hue: number;
  alpha: number;
}

export const FogBackground: React.FC<FogBackgroundProps> = ({ className, children }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = (): void => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Large, calm, low-contrast atmospheric mist clouds for a smooth editorial canvas
    const clouds: CloudNode[] = Array.from({ length: 10 }, () => ({
      x: Math.random() * width,
      y: height * 0.1 + Math.random() * (height * 0.75),
      radius: Math.random() * 300 + 320,
      vx: (Math.random() - 0.5) * 0.14,
      vy: (Math.random() - 0.5) * 0.08,
      hue: Math.random() > 0.45 ? 212 : 222,
      alpha: Math.random() * 0.024 + 0.016,
    }));

    let time = 0;
    let themeProgress = document.documentElement.classList.contains("dark") ? 1 : 0;

    const lerpColor = (
      c1: [number, number, number],
      c2: [number, number, number],
      t: number
    ): string => {
      const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
      const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
      const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
      return `rgb(${r}, ${g}, ${b})`;
    };

    const render = (): void => {
      time += 0.002;

      const targetTheme = document.documentElement.classList.contains("dark") ? 1 : 0;
      themeProgress += (targetTheme - themeProgress) * 0.05;

      // 1. Calm, cohesive base atmospheric gradient melting seamlessly into #09090b / #fafafa
      const baseGrad = ctx.createLinearGradient(0, height, 0, 0);
      baseGrad.addColorStop(0, lerpColor([250, 250, 250], [9, 9, 11], themeProgress));
      baseGrad.addColorStop(0.45, lerpColor([246, 247, 249], [10, 11, 15], themeProgress));
      baseGrad.addColorStop(0.78, lerpColor([241, 245, 249], [12, 16, 24], themeProgress));
      baseGrad.addColorStop(1, lerpColor([236, 243, 250], [14, 21, 33], themeProgress));

      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Render wide, ultra-soft drifting ambient fog orbs
      clouds.forEach((cloud) => {
        cloud.x += cloud.vx;
        cloud.y += cloud.vy + Math.sin(time + cloud.x * 0.004) * 0.1;

        if (cloud.x < -cloud.radius) cloud.x = width + cloud.radius;
        if (cloud.x > width + cloud.radius) cloud.x = -cloud.radius;
        if (cloud.y < -cloud.radius) cloud.y = height + cloud.radius;
        if (cloud.y > height + cloud.radius) cloud.y = -cloud.radius;

        const radial = ctx.createRadialGradient(
          cloud.x,
          cloud.y,
          0,
          cloud.x,
          cloud.y,
          cloud.radius
        );

        const currentSaturation = Math.round(28 + themeProgress * 12);
        const currentLightness = Math.round(72 - themeProgress * 30);
        const currentAlpha = cloud.alpha * (0.75 + 0.25 * themeProgress);

        radial.addColorStop(
          0,
          `hsla(${cloud.hue}, ${currentSaturation}%, ${currentLightness}%, ${currentAlpha})`
        );
        radial.addColorStop(
          0.55,
          `hsla(${cloud.hue + 6}, ${currentSaturation}%, ${currentLightness - 8}%, ${currentAlpha * 0.3})`
        );
        radial.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={cn("relative w-full h-full overflow-hidden select-none", className)}>
      {/* Dynamic Fluid Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Subtle Analog Film Grain Texture Layer */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.09] dark:opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};

export default FogBackground;
