import { useState, useEffect, useMemo } from 'react'
import Sidebar from './components/Sidebar.jsx'
import PersonDetail from './components/PersonDetail.jsx'
import PersonForm from './components/PersonForm.jsx'
import Statistics from './components/Statistics.jsx'
import DateDesigner from './components/DateDesigner.jsx'
import { loadPeople, savePeople, emptyPerson } from './storage.js'
import { lastActivity, daysFromToday } from './utils.js'
import { HeartsLogo, PlusIcon } from './icons.jsx'
import { USERS, getCurrentUser } from './users.js'
import TopNav from './TopNav.jsx'

function UserPicker() {
  return (
    <main className="main">
      <div className="welcome">
        <div className="welcome-mark">
          <HeartsLogo size={40} />
        </div>
        <h2>Hvis Dating CRM?</h2>
        <p>Vælg dig selv fra menuen for at se din egen liste.</p>
        <div className="user-picker-list">
          {USERS.map((u) => (
            <a key={u.slug} className="btn btn-primary" href={`?user=${u.slug}`}>
              {u.name}
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}

function matchesQuery(person, q) {
  if (!q) return true
  const haystack = [
    person.name,
    person.occupation,
    person.location,
    person.hobbies,
    person.notes,
    person.family,
    person.friends,
    person.metOn,
    ...(person.interests || []),
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(q.toLowerCase())
}

function compareBy(sortBy) {
  switch (sortBy) {
    case 'name':
      return (a, b) => (a.name || '').localeCompare(b.name || '')
    case 'rating':
      return (a, b) => (b.rating || 0) - (a.rating || 0)
    case 'added':
      return (a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')
    case 'upcoming':
      return (a, b) => {
        // Soonest upcoming plan first; people without a plan sink to the bottom.
        const da = a.nextDate ? daysFromToday(a.nextDate) : null
        const db = b.nextDate ? daysFromToday(b.nextDate) : null
        if (da === null && db === null) return 0
        if (da === null) return 1
        if (db === null) return -1
        return da - db
      }
    case 'recent':
    default:
      return (a, b) => {
        const la = lastActivity(a) || ''
        const lb = lastActivity(b) || ''
        return lb.localeCompare(la)
      }
  }
}

export default function App() {
  const user = useMemo(() => getCurrentUser(), [])
  const [people, setPeople] = useState(() => (user ? loadPeople(user.slug) : []))
  const [selectedId, setSelectedId] = useState(null)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [editing, setEditing] = useState(null) // null | { isNew, person }
  const [view, setView] = useState('people') // 'people' | 'stats'
  const [designingId, setDesigningId] = useState(null)

  // Persist on every change.
  useEffect(() => {
    if (user) savePeople(people, user.slug)
  }, [people, user])

  const visible = useMemo(() => {
    return people
      .filter((p) => (statusFilter === 'all' ? true : p.status === statusFilter))
      .filter((p) => matchesQuery(p, query))
      .sort(compareBy(sortBy))
  }, [people, query, statusFilter, sortBy])

  const selected = people.find((p) => p.id === selectedId) || null
  const designing = people.find((p) => p.id === designingId) || null

  function handleSelect(id) {
    setSelectedId(id)
    setView('people')
  }

  function handleAdd() {
    setView('people')
    setEditing({ isNew: true, person: emptyPerson() })
  }

  function handleSave(person) {
    const exists = people.some((p) => p.id === person.id)
    const stamped = { ...person, updatedAt: new Date().toISOString() }
    if (exists) {
      setPeople((prev) => prev.map((p) => (p.id === person.id ? stamped : p)))
    } else {
      setPeople((prev) => [stamped, ...prev])
    }
    setSelectedId(person.id)
    setEditing(null)
  }

  function handleDelete(id) {
    const person = people.find((p) => p.id === id)
    if (!person) return
    if (!window.confirm(`Delete ${person.name || 'this person'}? This can't be undone.`)) return
    setPeople((prev) => prev.filter((p) => p.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  function handlePatch(id, patch) {
    setPeople((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p)),
    )
  }

  if (!user) {
    return (
      <div className="site-shell">
        <TopNav currentUserSlug={null} />
        <UserPicker />
      </div>
    )
  }

  return (
    <div className="site-shell">
      <TopNav currentUserSlug={user.slug} />
      <div className={`app ${view === 'stats' || selected ? 'has-selection' : ''}`}>
        <Sidebar
        userName={user.name}
        people={people}
        visible={visible}
        selectedId={view === 'people' ? selectedId : null}
        onSelect={handleSelect}
        onAdd={handleAdd}
        view={view}
        onViewChange={setView}
        query={query}
        setQuery={setQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <main className="main">
        {view === 'stats' ? (
          <Statistics people={people} onBack={() => setView('people')} />
        ) : selected ? (
          <PersonDetail
            key={selected.id}
            person={selected}
            onEdit={() => setEditing({ isNew: false, person: selected })}
            onDelete={() => handleDelete(selected.id)}
            onPatch={(patch) => handlePatch(selected.id, patch)}
            onDesignDate={() => setDesigningId(selected.id)}
            onBack={() => setSelectedId(null)}
          />
        ) : (
          <div className="welcome">
            <div className="welcome-mark">
              <HeartsLogo size={40} />
            </div>
            <h2>Your dating dashboard</h2>
            <p>
              Select someone from the list to see everything you know about them — or add a new
              date to get started.
            </p>
            <button className="btn btn-primary" onClick={handleAdd}>
              <PlusIcon size={18} /> Add a date
            </button>
          </div>
        )}
      </main>

      {editing && (
        <PersonForm
          person={editing.person}
          isNew={editing.isNew}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      {designing && (
        <DateDesigner
          person={designing}
          onClose={() => setDesigningId(null)}
          onUsePlan={(text) => {
            handlePatch(designing.id, { nextNote: text })
            setDesigningId(null)
          }}
        />
      )}
      </div>
    </div>
  )
}
