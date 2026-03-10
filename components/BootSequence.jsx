import { useEffect, useState } from 'react';
import { BOOT_MESSAGES } from '@/utils/constants';

export default function BootSequence({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([]);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setVisibleLines((prev) => [...prev, BOOT_MESSAGES[index]]);
      index += 1;

      if (index === BOOT_MESSAGES.length) {
        clearInterval(timer);
        setTimeout(onComplete, 700);
      }
    }, 700);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-3xl border border-neonGreen/60 shadow-neon bg-black/80 p-6 sm:p-8 rounded-md">
        <h1 className="text-xl sm:text-2xl mb-6 glow-text">[boot sequence]</h1>
        <div className="space-y-2 text-sm sm:text-base">
          {visibleLines.map((line, idx) => (
            <p key={idx} className="tracking-wide">
              {line}
            </p>
          ))}
          <span className="inline-block w-3 h-5 bg-neonGreen animate-blink align-middle" />
        </div>
      </div>
    </div>
  );
}
