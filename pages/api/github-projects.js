export default async function handler(req, res) {
  const username = process.env.GITHUB_USERNAME || process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'sanjjay';

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`, {
      headers: {
        Accept: 'application/vnd.github+json',
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'GitHub API request failed' });
    }

    const repos = await response.json();

    const filtered = repos
      .filter((repo) => !repo.fork)
      .map(({ id, name, description, stargazers_count, language, html_url }) => ({
        id,
        name,
        description,
        stargazers_count,
        language,
        html_url,
      }));

    return res.status(200).json(filtered);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
