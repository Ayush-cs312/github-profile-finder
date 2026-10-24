export default function SearchBar({ value, onChange, onSearch, history, onClearHistory }) {
  return (
    <section className="search">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSearch(value)
        }}
      >
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter a GitHub username"
          aria-label="GitHub username"
          autoComplete="off"
        />
        <button type="submit">Search</button>
      </form>

      {history.length > 0 && (
        <div className="history">
          <span>Recent</span>
          {history.map((name) => (
            <button key={name} className="chip" onClick={() => onSearch(name)}>
              {name}
            </button>
          ))}
          <button className="clear" onClick={onClearHistory}>Clear</button>
        </div>
      )}
    </section>
  )
}
