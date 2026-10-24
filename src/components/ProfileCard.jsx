export default function ProfileCard({ user }) {
  const stats = [
    ['Repositories', user.public_repos],
    ['Followers', user.followers],
    ['Following', user.following],
  ]

  return (
    <article className="card profile">
      <img src={user.avatar_url} alt={`${user.login}'s avatar`} width="120" height="120" />
      <div className="info">
        <h2>{user.name || user.login}</h2>
        <p className="login">@{user.login}</p>
        <p className="bio">{user.bio || 'No bio provided.'}</p>
        <a className="visit" href={user.html_url} target="_blank" rel="noopener noreferrer">
          Visit GitHub profile
        </a>
      </div>

      <ul className="stats">
        {stats.map(([label, value]) => (
          <li key={label}>
            <strong>{value.toLocaleString()}</strong>
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}
