export async function fetchGithubRepos() {
  const response = await fetch('/api/github-projects');
  if (!response.ok) {
    throw new Error('Unable to fetch repositories');
  }
  return response.json();
}
