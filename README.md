# Hacker Portfolio Website (Next.js)

A cyberpunk terminal-style portfolio for **Sanjjay** with interactive commands, boot sequence, matrix animation, and GitHub-powered projects.

## Features

- Kali-inspired dark terminal aesthetic
- Boot sequence intro
- Interactive terminal commands (`help`, `about`, `projects`, `skills`, `github`, `linkedin`, `contact`, `clear`, `sudo access`)
- Live GitHub repo fetching through Next.js API route
- Animated skill bars with Framer Motion
- Matrix rain + neon glow effects + glitch hover
- Floating hacker system widgets (CPU/network/uptime)
- Mobile responsive and Vercel-ready

## Tech Stack

- Next.js (Pages Router)
- TailwindCSS
- Framer Motion
- GitHub API

## Project Structure

```bash
/components
/pages
/utils
/styles
/api (implemented as pages/api)
```

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Open `http://localhost:3000`

## Build for Production

```bash
npm run build
npm run start
```

## Environment Variables

Create `.env.local`:

```env
GITHUB_USERNAME=sanjjay
GITHUB_TOKEN=optional_personal_access_token
NEXT_PUBLIC_GITHUB_USERNAME=sanjjay
NEXT_PUBLIC_GITHUB_URL=https://github.com/sanjjay
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/sanjjay
NEXT_PUBLIC_EMAIL=sanjjay@example.com
NEXT_PUBLIC_RESUME_URL=https://example.com/resume.pdf
```

### GitHub API Connection Notes

- `pages/api/github-projects.js` fetches latest repositories from GitHub.
- If `GITHUB_TOKEN` is set, requests use authenticated mode for higher rate limits.
- Repositories are auto-updated when new repos are added to GitHub.

## Deploy to Vercel

1. Push repo to GitHub.
2. Import project in [Vercel](https://vercel.com/new).
3. Set the same environment variables in Vercel Project Settings.
4. Deploy.

