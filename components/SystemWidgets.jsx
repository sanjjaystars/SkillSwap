import { useEffect, useState } from 'react';

export default function SystemWidgets() {
  const [cpu, setCpu] = useState(37);
  const [network, setNetwork] = useState('stable');
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCpu(Math.floor(20 + Math.random() * 70));
      setNetwork(Math.random() > 0.1 ? 'stable' : 'fluctuating');
      setUptime((value) => value + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <aside className="fixed right-4 top-4 z-10 w-48 border border-neonGreen/40 bg-black/70 backdrop-blur rounded-md p-3 text-xs shadow-neon">
      <p className="mb-2 glow-text">system widgets</p>
      <div className="space-y-1">
        <p>CPU usage: {cpu}%</p>
        <p>Network: {network}</p>
        <p>Uptime: {uptime}s</p>
      </div>
    </aside>
  );
}
