import Head from 'next/head';
import { useState } from 'react';
import BootSequence from '@/components/BootSequence';
import MatrixRain from '@/components/MatrixRain';
import SystemWidgets from '@/components/SystemWidgets';
import Terminal from '@/components/Terminal';

export default function Home() {
  const [isBootComplete, setBootComplete] = useState(false);

  return (
    <>
      <Head>
        <title>Sanjjay | Hacker Portfolio</title>
        <meta
          name="description"
          content="Cyberpunk terminal portfolio for Sanjjay, Full Stack Developer specializing in Web Development, AI, and Cyber Security."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <MatrixRain />
      <div className="noise-overlay" />
      {isBootComplete ? (
        <>
          <SystemWidgets />
          <main>
            <h1 className="text-center text-xl sm:text-3xl pt-8 glow-text">root@kali:~$ portfolio</h1>
            <Terminal />
          </main>
        </>
      ) : (
        <BootSequence onComplete={() => setBootComplete(true)} />
      )}
    </>
  );
}
