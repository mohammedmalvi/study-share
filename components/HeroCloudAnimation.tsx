"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  progress: number;
  speed: number;
  pathIndex: number;
  opacity: number;
  size: number;
}

// Predefined data-flow paths (normalised 0-1 coordinates mapped to the 700x500 canvas)
// These follow the circuit-line trajectories visible in the cloud network vector image.
const PATHS: [number, number][][] = [
  // left-bottom PDF → cloud center
  [[0.08, 0.85], [0.18, 0.80], [0.28, 0.72], [0.40, 0.62], [0.52, 0.55], [0.60, 0.52]],
  // left-mid folder → cloud center
  [[0.05, 0.70], [0.15, 0.66], [0.26, 0.60], [0.40, 0.57], [0.52, 0.54], [0.60, 0.52]],
  // cloud center → right-top doc
  [[0.60, 0.52], [0.68, 0.46], [0.76, 0.38], [0.85, 0.30], [0.93, 0.25]],
  // cloud center → right-bottom folder
  [[0.60, 0.52], [0.70, 0.58], [0.80, 0.64], [0.90, 0.70]],
  // top doc → cloud center
  [[0.45, 0.10], [0.50, 0.22], [0.54, 0.36], [0.57, 0.46], [0.60, 0.52]],
  // cloud center → right-mid
  [[0.60, 0.52], [0.72, 0.50], [0.83, 0.50], [0.93, 0.50]],
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function pointOnPath(path: [number, number][], t: number): [number, number] {
  if (path.length < 2) return path[0];
  const segCount = path.length - 1;
  const seg = Math.min(Math.floor(t * segCount), segCount - 1);
  const segT = (t * segCount) - seg;
  const [x1, y1] = path[seg];
  const [x2, y2] = path[seg + 1];
  return [lerp(x1, x2, segT), lerp(y1, y2, segT)];
}

export default function HeroCloudAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const LOOP_DURATION = 12000; // 12-second seamless loop (ms)

    // Initialise particles — spread across paths and progress to create continuous streams
    const particles: Particle[] = [];
    for (let pi = 0; pi < PATHS.length; pi++) {
      const count = 5 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: 0,
          y: 0,
          progress: i / count, // spread evenly so loop is seamless
          speed: 0.0006 + Math.random() * 0.0004,
          pathIndex: pi,
          opacity: 0.6 + Math.random() * 0.4,
          size: 1.5 + Math.random() * 2,
        });
      }
    }

    function drawParticle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number, w: number, h: number) {
      const px = x * w;
      const py = y * h;
      // Glow halo
      const grd = ctx.createRadialGradient(px, py, 0, px, py, size * 4);
      grd.addColorStop(0, `rgba(120,180,255,${opacity})`);
      grd.addColorStop(0.5, `rgba(100,120,255,${opacity * 0.4})`);
      grd.addColorStop(1, "rgba(100,120,255,0)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(px, py, size * 4, 0, Math.PI * 2);
      ctx.fill();

      // Core dot
      ctx.fillStyle = `rgba(200,230,255,${opacity})`;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawFloatingDoc(ctx: CanvasRenderingContext2D, t: number, w: number, h: number) {
      // Subtle floating icons synced to loop
      const docs = [
        { bx: 0.10, by: 0.82, phase: 0 },
        { bx: 0.04, by: 0.55, phase: 0.33 },
        { bx: 0.46, by: 0.12, phase: 0.66 },
        { bx: 0.92, by: 0.68, phase: 0.2 },
        { bx: 0.94, by: 0.23, phase: 0.55 },
      ];

      docs.forEach(({ bx, by, phase }) => {
        const floatY = Math.sin((t / LOOP_DURATION) * Math.PI * 2 + phase * Math.PI * 2) * 0.015;
        const px = bx * w;
        const py = (by + floatY) * h;
        const size = Math.min(w, h) * 0.025;

        ctx.save();
        ctx.globalAlpha = 0.18;
        // Soft glow rectangle representing doc
        const grd = ctx.createRadialGradient(px, py, 0, px, py, size * 2.5);
        grd.addColorStop(0, "rgba(160,190,255,1)");
        grd.addColorStop(1, "rgba(100,130,255,0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(px, py, size * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    function drawArrows(ctx: CanvasRenderingContext2D, t: number, w: number, h: number) {
      // Upload arrows — drift upwards, loop reset for seamlessness
      const arrows = [
        { bx: 0.30, by: 0.68 },
        { bx: 0.22, by: 0.76 },
        { bx: 0.17, by: 0.60 },
      ];
      const arrowPhase = ((t % LOOP_DURATION) / LOOP_DURATION);

      arrows.forEach(({ bx, by }, i) => {
        // Offset each arrow so they stagger in the loop
        const offset = (arrowPhase + i * 0.33) % 1;
        const travel = 0.07; // how far upward they move
        const py = (by - offset * travel) * h;
        const px = bx * w;
        const opacity = Math.sin(offset * Math.PI) * 0.5; // fade in and out

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.strokeStyle = "rgba(100,180,255,1)";
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        const as = Math.min(w, h) * 0.018;
        ctx.beginPath();
        ctx.moveTo(px, py + as);
        ctx.lineTo(px, py - as);
        ctx.moveTo(px - as * 0.6, py - as * 0.4);
        ctx.lineTo(px, py - as);
        ctx.lineTo(px + as * 0.6, py - as * 0.4);
        ctx.stroke();
        ctx.restore();
      });
    }

    function drawCloudPulse(ctx: CanvasRenderingContext2D, t: number, w: number, h: number) {
      // Subtle glowing aura around cloud center (approx 60% x, 50% y)
      const cx = 0.60 * w;
      const cy = 0.50 * h;
      const base = Math.min(w, h) * 0.18;
      const pulse = 1 + 0.06 * Math.sin((t / LOOP_DURATION) * Math.PI * 2);
      const r = base * pulse;

      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grd.addColorStop(0, "rgba(180,200,255,0.10)");
      grd.addColorStop(0.5, "rgba(160,190,255,0.05)");
      grd.addColorStop(1, "rgba(100,140,255,0)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    function animate(timestamp: number) {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;

      const c = canvas!;
      const x = ctx!;
      const w = c.width;
      const h = c.height;
      x.clearRect(0, 0, w, h);

      // Draw cloud pulse
      drawCloudPulse(x, elapsed % LOOP_DURATION, w, h);

      // Draw floating document glows
      drawFloatingDoc(x, elapsed % LOOP_DURATION, w, h);

      // Draw upload arrows
      drawArrows(x, elapsed, w, h);

      // Update + draw particles
      particles.forEach((p) => {
        p.progress = (p.progress + p.speed) % 1;
        const path = PATHS[p.pathIndex];
        const [nx, ny] = pointOnPath(path, p.progress);
        p.x = nx;
        p.y = ny;

        // Fade in/out near endpoints for seamless loop
        const edgeFade = Math.min(p.progress * 8, 1) * Math.min((1 - p.progress) * 8, 1);
        drawParticle(x, p.x, p.y, p.size, p.opacity * edgeFade, w, h);
      });

      frameRef.current = requestAnimationFrame(animate);
    }

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div className="relative w-full h-full select-none" style={{ minHeight: "420px" }}>
      {/* Base static cloud network image */}
      <img
        src="/hero-cloud.png"
        alt="Cloud-based study material ecosystem — files and folders flowing into a central cloud"
        className="w-full h-[420px] object-cover object-center"
        style={{ display: "block" }}
        draggable={false}
      />
      {/* Animation canvas overlay */}
      <canvas
        ref={canvasRef}
        width={700}
        height={420}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: "screen" }}
        aria-hidden="true"
      />
    </div>
  );
}
