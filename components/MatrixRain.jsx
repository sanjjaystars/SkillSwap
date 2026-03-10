import { useEffect, useRef } from 'react';

const CHARACTERS = '01アカサタナハマヤラワ';

export default function MatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      context.fillStyle = 'rgba(0, 0, 0, 0.08)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = '#00ff9c';
      context.font = `${fontSize}px monospace`;

      drops.forEach((drop, i) => {
        const text = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
        context.fillText(text, i * fontSize, drop * fontSize);
        if (drop * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 1;
      });
    };

    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 opacity-40" aria-hidden="true" />;
}
