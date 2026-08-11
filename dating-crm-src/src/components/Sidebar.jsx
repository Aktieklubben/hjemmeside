import { Avatar, StatusBadge } from './ui.jsx'
import { STATUSES, SORT_OPTIONS } from '../constants.js'
import { SearchIcon, PlusIcon, HeartsLogo, CalendarIcon, UsersIcon, ChartIcon } from '../icons.jsx'
import { relativeDay, daysFromToday, lastActivity } from '../utils.js'

const ACTIVE_STATUSES = ['New', 'Talking', 'Dating', 'Exclusive']

function needsFollowUp(person) {
  if (!ACTIVE_STATUSES.includes(person.status)) return false
  if (person.nextDate) return daysFromToday(person.nextDate) <= 0
  const last = lastActivity(person)
  if (!last) return true
  return daysFromToday(last) <= -10
}

function MetaLine({ person }) {
  // Prefer an upcoming plan; otherwise show last activity.
  if (person.nextDate) {
    const diff = daysFromToday(person.nextDate)
    const overdue = diff < 0
    return (
      <span className={`row-meta ${overdue ? 'row-meta--alert' : 'row-meta--plan'}`}>
        <CalendarIcon size={13} />
        {overdue ? 'Plan overdue' : relativeDay(person.nextDate)}
      </span>
    )
  }
  const last = lastActivity(person)
  if (last) return <span className="row-meta">Active {relativeDay(last).toLowerCase()}</span>
  return <span className="row-meta row-meta--muted">No contact yet</span>
}

export default function Sidebar({
  userName,
  people,
  visible,
  selectedId,
  onSelect,
  onAdd,
  view,
  onViewChange,
  query,
  setQuery,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
}) {
  const total = people.length
  const active = people.filter((p) => ACTIVE_STATUSES.includes(p.status)).length
  const followUps = people.filter(needsFollowUp).length

  return (
    <aside className="sidebar">
      <header className="sidebar-head">
        <div className="brand">
          <span className="brand-mark">
            <HeartsLogo size={18} />
          </span>
          <div className="brand-text">
            <h1>{userName}'s Dating CRM</h1>
            <p>Keep your dates straight</p>
          </div>
        </div>
        <button className="btn btn-primary btn-add" onClick={onAdd}>
          <PlusIcon size={18} />
          Add
        </button>
      </header>

      <div className="nav-tabs">
        <button
          className={`nav-tab ${view === 'people' ? 'is-active' : ''}`}
          onClick={() => onViewChange('people')}
        >
          <UsersIcon size={16} /> People
        </button>
        <button
          className={`nav-tab ${view === 'stats' ? 'is-active' : ''}`}
          onClick={() => onViewChange('stats')}
        >
          <ChartIcon size={16} /> Insights
        </button>
      </div>

      <div className="stats">
        <div className="stat">
          <span className="stat-num">{total}</span>
          <span className="stat-label">People</span>
        </div>
        <div className="stat">
          <span className="stat-num">{active}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className={`stat ${followUps > 0 ? 'stat--alert' : ''}`}>
          <span className="stat-num">{followUps}</span>
          <span className="stat-label">Follow up</span>
        </div>
      </div>

      <div className="search-wrap">
        <SearchIcon size={17} className="search-icon" />
        <input
          className="search-input"
          placeholder="Search name, interests, notes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button className="search-clear" onClick={() => setQuery('')} aria-label="Clear search">
            ×
          </button>
        )}
      </div>

      <div className="filter-row">
        <div className="chips-scroll">
          <button
            className={`filter-chip ${statusFilter === 'all' ? 'is-active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All
          </button>
          {STATUSES.map((s) => (
            <button
              key={s.value}
              className={`filter-chip ${statusFilter === s.value ? 'is-active' : ''}`}
              onClick={() => setStatusFilter(statusFilter === s.value ? 'all' : s.value)}
              style={
                statusFilter === s.value
                  ? { color: s.color, background: s.bg, borderColor: s.color }
                  : undefined
              }
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="list-toolbar">
        <span className="list-count">
          {visible.length} {visible.length === 1 ? 'person' : 'people'}
        </span>
        <label className="sort-select">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <nav className="people-list">
        {visible.length === 0 ? (
          <div className="list-empty">
            {people.length === 0 ? 'No one here yet.' : 'No matches.'}
          </div>
        ) : (
          visible.map((p) => (
            <button
              key={p.id}
              className={`person-row ${p.id === selectedId ? 'is-selected' : ''}`}
              onClick={() => onSelect(p.id)}
            >
              <Avatar person={p} size={44} />
              <div className="row-body">
                <div className="row-top">
                  <span className="row-name">
                    {p.name || 'Unnamed'}
                    {p.age ? <span className="row-age">, {p.age}</span> : null}
                  </span>
                  {needsFollowUp(p) && <span className="follow-dot" title="Needs follow up" />}
                </div>
                <div className="row-bottom">
                  <StatusBadge status={p.status} size="sm" />
                  <MetaLine person={p} />
                </div>
              </div>
            </button>
          ))
        )}
      </nav>

      <footer className="sidebar-foot">
        <span>Saved on this device</span>
      </footer>
    </aside>
  )
}
