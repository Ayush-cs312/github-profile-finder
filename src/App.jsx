import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar.jsx'
import ProfileCard from './components/ProfileCard.jsx'
import RepoList from './components/RepoList.jsx'

const API = 'https://api.github.com/users'
const VALID_NAME = /^[a-z\d](?:[a-z\d-]{0,38})$/i // GitHub's username rules
const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}

export default function App() {
  const [input, setInput] = useState('')
  const [query, setQuery] = useState(null)       // { name } - a new object each search, so the effect re-runs
  const [user, setUser] = useState(null)
  const [repos, setRepos] = useState([])
  const [status, setStatus] = useState('idle')   // idle | loading | done | error
  const [error, setError] = useState('')
  const [history, setHistory] = useState(() => load('history', []))
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  // Fetch whenever a new search is submitted.
  useEffect(() => {
    if (!query) return
    const controller = new AbortController()
    const { signal } = controller
    setStatus('loading')

    ;(async () => {
      try {
        const res = await fetch(`${API}/${query.name}`, { signal })
        if (res.status === 404) throw new Error(`No GitHub user found with the username "${query.name}".`)
        if (res.status === 403 || res.status === 429)
          throw new Error('GitHub API rate limit reached. Wait a few minutes and try again.')
        if (!res.ok) throw new Error(`Something went wrong (error ${res.status}). Please try again.`)
        const data = await res.json()

        // Repos are a nice-to-have: if this call fails, still show the profile.
        const repoRes = await fetch(`${API}/${query.name}/repos?sort=updated&per_page=8`, { signal })
        setRepos(repoRes.ok ? await repoRes.json() : [])
        setUser(data)
        setStatus('done')
        setHistory((h) => [data.login, ...h.filter((n) => n.toLowerCase() !== data.login.toLowerCase())].slice(0, 5))
      } catch (err) {
        if (err.name === 'AbortError') return
        setUser(null)
        setRepos([])
        setError(err instanceof TypeError ? 'Network error. Check your internet connection.' : err.message)
        setStatus('error')
      }
    })()

    return () => controller.abort() // cancels a stale request if a new search starts
  }, [query])

  useEffect(() => localStorage.setItem('history', JSON.stringify(history)), [history])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  const search = (raw) => {
    const name = raw.trim()
    setInput(name)
    if (!name) { setError('Please enter a GitHub username.'); setStatus('error'); return }
    if (!VALID_NAME.test(name)) {
      setError(`"${name}" is not a valid GitHub username. Use letters, numbers and single hyphens only.`)
      setStatus('error')
      return
    }
    setQuery({ name })
  }

  return (
    <div className="app">
      <header className="top">
        <h1>GitHub Profile Finder</h1>
        <button
          className="icon-btn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </header>

      <SearchBar
        value={input}
        onChange={setInput}
        onSearch={search}
        history={history}
        onClearHistory={() => setHistory([])}
      />

      <main aria-live="polite">
        {status === 'idle' && <p className="hint">Search for any username, for example <b>octocat</b>.</p>}
        {status === 'loading' && <p className="loading">Loading profile…</p>}
        {status === 'error' && <p className="error" role="alert">{error}</p>}
        {status === 'done' && user && (
          <>
            <ProfileCard user={user} />
            <RepoList repos={repos} total={user.public_repos} />
          </>
        )}
      </main>
    </div>
  )
}
