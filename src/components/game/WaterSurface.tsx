import { memo, useEffect, useRef } from 'react';

interface WaterSurfaceProps {
  width: number;
  y: number;
}

export const WaterSurface = memo(function WaterSurface({ width, y }: WaterSurfaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const draw = () => {
      time += 0.03;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(232, 244, 248, 0.1)');
      gradient.addColorStop(0.5, 'rgba(232, 244, 248, 0.4)');
      gradient.addColorStop(1, 'rgba(232, 244, 248, 0.1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;

      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const offset = i * 8;
        for (let x = 0; x <= canvas.width; x += 2) {
          const waveY =
            canvas.height / 2 + Math.sin((x + time * 50 + i * 2) * 0.03) * 4 + offset - 12 + i * 8;
          if (x === 0) {
            ctx.moveTo(x, waveY);
          } else {
            ctx.lineTo(x, waveY);
          }
        }
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      for (let i = 0; i < 8; i++) {
        const x = (time * 30 + i * 80) % (canvas.width + 40) - 20;
        const yWave = canvas.height / 2 + Math.sin(time * 2 + i) * 5;
        const size = 2 + Math.sin(time * 3 + i) * 1;
        ctx.beginPath();
        ctx.arc(x, yWave, size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [width]);

  return (
    <div
      className="absolute left-0 right-0 pointer-events-none z-30 overflow-hidden"
      style={{
        top: y - 12,
        height: 24,
        width: width,
      }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={24}
        className="w-full h-full"
      />

      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent"
        style={{ filter: 'blur(1px)' }}
      />
    </div>
  );
});
