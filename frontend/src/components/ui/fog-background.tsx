import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface FogBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export const FogBackground: React.FC<FogBackgroundProps> = ({ className, children }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Particle nodes for organic misty clouds - toned down, soft, moody
    const clouds = Array.from({ length: 14 }, () => ({
      x: Math.random() * width,
      y: height * 0.15 + Math.random() * (height * 0.65),
      radius: Math.random() * 260 + 160,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.15,
      hue: Math.random() > 0.4 ? 205 : 220, // Gentle deep ocean cyan & twilight indigo
      alpha: Math.random() * 0.08 + 0.04, // Soft, non-distracting ambient alpha
    }));

    let time = 0;
    const render = () => {
      time += 0.003;

      const isDark = document.documentElement.classList.contains("dark");

      // 1. Layered Base Atmospheric Gradient - soft, eye-friendly, moody
      const baseGrad = ctx.createLinearGradient(0, height, 0, 0);
      if (isDark) {
        // Deep ambient moody blues that melt into page background #09090b
        baseGrad.addColorStop(0, "#09090b");
        baseGrad.addColorStop(0.35, "#030712");
        baseGrad.addColorStop(0.7, "#08203e");
        baseGrad.addColorStop(1, "#0a3055");
      } else {
        baseGrad.addColorStop(0, "#fafafa");
        baseGrad.addColorStop(0.4, "#f1f5f9");
        baseGrad.addColorStop(0.75, "#e2e8f0");
        baseGrad.addColorStop(1, "#e0f2fe");
      }
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Render drifting soft fluid fog orbs with subtle alpha
      clouds.forEach((cloud) => {
        cloud.x += cloud.vx;
        cloud.y += cloud.vy + Math.sin(time + cloud.x * 0.005) * 0.18;

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
        if (isDark) {
          radial.addColorStop(0, `hsla(${cloud.hue}, 65%, 45%, ${cloud.alpha})`);
          radial.addColorStop(0.5, `hsla(${cloud.hue + 10}, 60%, 30%, ${cloud.alpha * 0.4})`);
          radial.addColorStop(1, "rgba(9, 9, 11, 0)");
        } else {
          radial.addColorStop(0, `hsla(${cloud.hue}, 60%, 65%, ${cloud.alpha * 0.5})`);
          radial.addColorStop(0.5, `hsla(${cloud.hue + 10}, 50%, 75%, ${cloud.alpha * 0.2})`);
          radial.addColorStop(1, "rgba(250, 250, 250, 0)");
        }

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

      {/* Film Grain & Analog Noise Texture Layer */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.20] dark:opacity-[0.22] mix-blend-overlay"
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
