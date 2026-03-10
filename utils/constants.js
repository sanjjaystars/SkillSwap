export const BOOT_MESSAGES = [
  '> initializing system...',
  '> loading modules...',
  '> connecting to github...',
  '> access granted.',
];

export const COMMANDS = {
  help: 'Show available commands',
  about: 'Display profile summary',
  projects: 'Fetch and list GitHub projects',
  skills: 'View technical skills',
  github: 'Open GitHub profile',
  linkedin: 'Open LinkedIn profile',
  contact: 'Show contact details',
  clear: 'Clear terminal history',
};

export const PROFILE = {
  name: 'Sanjjay',
  role: 'Full Stack Developer',
  specialization: 'Web Development, AI, Cyber Security',
  bio: 'Passionate developer building tools, platforms and automation systems.',
  github: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/sanjjay',
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/in/sanjjay',
  email: process.env.NEXT_PUBLIC_EMAIL || 'sanjjay@example.com',
  resume: process.env.NEXT_PUBLIC_RESUME_URL || '#',
};

export const SKILLS = [
  { label: 'Python', level: 90 },
  { label: 'JavaScript', level: 92 },
  { label: 'React', level: 88 },
  { label: 'Node.js', level: 85 },
  { label: 'Linux', level: 87 },
  { label: 'Cyber Security', level: 83 },
  { label: 'AI', level: 86 },
];
