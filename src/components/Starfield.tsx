import React, { useEffect, useRef } from "react";

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Handle resizing
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Star configuration
    const starCount = 120;
    const stars: {
      x: number;
      y: number;
      size: number;
      alpha: number;
      speed: number;
      color: string;
      phase: number;
    }[] = [];

    const colors = ["#ffffff", "#e0f2fe", "#f0f9ff", "#bae6fd", "#c084fc", "#a5f3fc"];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        speed: Math.random() * 0.05 + 0.01,
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Shooting stars
    const shootingStars: {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      alpha: number;
      active: boolean;
    }[] = [];

    const spawnShootingStar = () => {
      if (Math.random() > 0.995 && shootingStars.filter((s) => s.active).length < 2) {
        shootingStars.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * height * 0.4,
          length: Math.random() * 80 + 40,
          speed: Math.random() * 8 + 4,
          angle: Math.PI / 6 + Math.random() * (Math.PI / 12), // downwards & leftwards/rightwards
          alpha: 1,
          active: true,
        });
      }
    };

    // Nebula nodes
    const nebulae = [
      { x: width * 0.2, y: height * 0.3, radius: 180, color: "rgba(139, 92, 246, 0.07)" }, // Purple
      { x: width * 0.8, y: height * 0.7, radius: 240, color: "rgba(6, 182, 212, 0.06)" }, // Cyan
      { x: width * 0.5, y: height * 0.5, radius: 200, color: "rgba(236, 72, 153, 0.04)" }, // Pink
    ];

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw background Nebulae
      nebulae.forEach((nebula) => {
        const gradient = ctx.createRadialGradient(
          nebula.x,
          nebula.y,
          0,
          nebula.x,
          nebula.y,
          nebula.radius
        );
        gradient.addColorStop(0, nebula.color);
        gradient.addColorStop(1, "rgba(3, 7, 18, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw and update stars
      stars.forEach((star) => {
        star.phase += star.speed;
        const currentAlpha = Math.max(0.2, Math.min(1, star.alpha + Math.sin(star.phase) * 0.3));

        // Draw star
        ctx.fillStyle = star.color;
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Slow movement
        star.y -= star.speed * 0.5;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }
      });
      ctx.globalAlpha = 1.0;

      // Draw and update shooting stars
      spawnShootingStar();
      shootingStars.forEach((s) => {
        if (!s.active) return;

        ctx.strokeStyle = "rgba(255, 255, 255, " + s.alpha + ")";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(
          s.x + Math.cos(s.angle) * s.length,
          s.y + Math.sin(s.angle) * s.length
        );
        ctx.stroke();

        // Update position
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.alpha -= 0.02;

        if (s.alpha <= 0 || s.x > width || s.y > height) {
          s.active = false;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10 block pointer-events-none" id="starfield-canvas" />;
}
