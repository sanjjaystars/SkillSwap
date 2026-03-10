import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { COMMANDS, PROFILE } from '@/utils/constants';
import { fetchGithubRepos } from '@/utils/github';
import SkillBars from '@/components/SkillBars';

function CommandHelp() {
  return (
    <div>
      <p className="mb-2">commands available:</p>
      {Object.entries(COMMANDS).map(([command, description]) => (
        <p key={command}>
          {command.padEnd(10, ' ')} -&gt; {description.toLowerCase()}
        </p>
      ))}
    </div>
  );
}

function AboutSection() {
  return (
    <div className="space-y-1">
      <p>Name: {PROFILE.name}</p>
      <p>Role: {PROFILE.role}</p>
      <p>Specialization: {PROFILE.specialization}</p>
      <p className="pt-2">Bio:</p>
      <p>{PROFILE.bio}</p>
    </div>
  );
}

function ContactSection() {
  return (
    <div className="space-y-1">
      <p>Email: {PROFILE.email}</p>
      <p>
        GitHub:{' '}
        <a className="underline hover:animate-glitch" href={PROFILE.github} target="_blank" rel="noreferrer">
          {PROFILE.github}
        </a>
      </p>
      <p>
        LinkedIn:{' '}
        <a className="underline hover:animate-glitch" href={PROFILE.linkedin} target="_blank" rel="noreferrer">
          {PROFILE.linkedin}
        </a>
      </p>
      <p>
        Portfolio Download:{' '}
        <a className="underline hover:animate-glitch" href={PROFILE.resume} target="_blank" rel="noreferrer">
          resume
        </a>
      </p>
    </div>
  );
}

export default function Terminal() {
  const [history, setHistory] = useState([
    { type: 'output', command: null, content: <p>Type "help" to list commands.</p> },
  ]);
  const [input, setInput] = useState('');
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const terminalEndRef = useRef(null);

  const pushHistory = (entry) => {
    setHistory((prev) => [...prev, entry]);
    setTimeout(() => terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const commandHandlers = useMemo(
    () => ({
      help: () => pushHistory({ type: 'output', command: 'help', content: <CommandHelp /> }),
      about: () => pushHistory({ type: 'output', command: 'about', content: <AboutSection /> }),
      skills: () => pushHistory({ type: 'output', command: 'skills', content: <SkillBars /> }),
      github: () => {
        window.open(PROFILE.github, '_blank', 'noopener,noreferrer');
        pushHistory({ type: 'output', command: 'github', content: <p>Opening GitHub profile...</p> });
      },
      linkedin: () => {
        window.open(PROFILE.linkedin, '_blank', 'noopener,noreferrer');
        pushHistory({ type: 'output', command: 'linkedin', content: <p>Opening LinkedIn profile...</p> });
      },
      contact: () => pushHistory({ type: 'output', command: 'contact', content: <ContactSection /> }),
      clear: () => setHistory([]),
      projects: async () => {
        setIsLoadingProjects(true);
        pushHistory({ type: 'output', command: 'projects', content: <p>Fetching repositories...</p> });
        try {
          const repos = await fetchGithubRepos();
          pushHistory({
            type: 'output',
            command: null,
            content: (
              <div className="space-y-3 mt-2">
                {repos.map((repo) => (
                  <motion.a
                    whileHover={{ scale: 1.01 }}
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="block border border-neonGreen/50 rounded p-3 hover:shadow-neon transition"
                  >
                    <p className="font-semibold">{repo.name}</p>
                    <p className="text-neonGreen/80 text-sm">{repo.description || 'No description provided'}</p>
                    <p className="text-xs mt-1">⭐ {repo.stargazers_count} | {repo.language || 'N/A'}</p>
                  </motion.a>
                ))}
              </div>
            ),
          });
        } catch (error) {
          pushHistory({ type: 'output', command: null, content: <p>Failed to fetch projects.</p> });
        } finally {
          setIsLoadingProjects(false);
        }
      },
      sudo: (args) => {
        if (args.join(' ') === 'access') {
          pushHistory({
            type: 'output',
            command: 'sudo access',
            content: (
              <div>
                <p className="glow-text">ACCESS GRANTED</p>
                <p>Welcome back, Sanjjay.</p>
              </div>
            ),
          });
          return;
        }
        pushHistory({ type: 'output', command: null, content: <p>Permission denied.</p> });
      },
    }),
    [],
  );

  const executeCommand = async (rawCommand) => {
    const [command, ...args] = rawCommand.trim().toLowerCase().split(/\s+/);
    if (!command) {
      return;
    }

    pushHistory({ type: 'command', command: rawCommand, content: null });

    const handler = commandHandlers[command];
    if (!handler) {
      pushHistory({ type: 'output', command: null, content: <p>Command not found: {command}</p> });
      return;
    }

    await handler(args);
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
      <div className="border border-neonGreen/60 shadow-neon bg-black/75 backdrop-blur p-4 sm:p-6 rounded-md min-h-[65vh]">
        <div className="space-y-4 text-sm sm:text-base">
          {history.map((entry, idx) => (
            <div key={idx}>
              {entry.type === 'command' && <p>&gt; {entry.command}</p>}
              {entry.content}
            </div>
          ))}
          {isLoadingProjects && <p className="animate-pulse">[loading...]</p>}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const value = input;
              setInput('');
              executeCommand(value);
            }}
            className="flex items-center gap-2"
          >
            <span>&gt;</span>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="bg-transparent flex-1 outline-none"
              autoFocus
              aria-label="terminal input"
            />
            <span className="w-2 h-4 bg-neonGreen animate-blink" />
          </form>
          <div ref={terminalEndRef} />
        </div>
      </div>
    </section>
  );
}
