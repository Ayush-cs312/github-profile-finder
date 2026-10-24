export default function RepoList({ repos, total }) {
  if (repos.length === 0) return <p className="hint">No public repositories to show.</p>

  return (
    <section className="repos">
      <h3>
        Latest repositories <small>({repos.length} of {total})</small>
      </h3>
      <ul>
        {repos.map((repo) => (
          <li key={repo.id} className="card repo">
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.name}</a>
            <p>{repo.description || 'No description.'}</p>
            <div className="meta">
              <span>{repo.language || 'n/a'}</span>
              <span>★ {repo.stargazers_count}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
