import { useState, useEffect } from 'react'
import { initials, colorFor } from '../utils.js'
import { statusMeta } from '../constants.js'
import { HeartIcon, FlameIcon } from '../icons.jsx'

// Profile photo if set, otherwise a colored circle with the person's initials.
// Falls back to initials if the image fails to load (e.g. offline).
export function Avatar({ person, size = 40, onClick }) {
  const [broken, setBroken] = useState(false)
  useEffect(() => setBroken(false), [person.photo])

  const clickable = typeof onClick === 'function'
  const common = {
    className: `avatar ${clickable ? 'avatar--clickable' : ''}`,
    style: { width: size, height: size },
    onClick,
  }

  if (person.photo && !broken) {
    return (
      <img
        {...common}
        className={`${common.className} avatar--img`}
        src={person.photo}
        alt={person.name || 'Profile photo'}
        onError={() => setBroken(true)}
      />
    )
  }

  return (
    <span
      {...common}
      style={{
        ...common.style,
        background: colorFor(person.id || person.name),
        fontSize: size * 0.38,
      }}
    >
      {initials(person.name)}
    </span>
  )
}

// Pill showing the relationship status in its themed colors.
export function StatusBadge({ status, size = 'md' }) {
  const meta = statusMeta(status)
  return (
    <span
      className={`status-badge ${size === 'sm' ? 'status-badge--sm' : ''}`}
      style={{ color: meta.color, background: meta.bg }}
    >
      <span className="status-dot" style={{ background: meta.color }} />
      {meta.label}
    </span>
  )
}

// Read-only or interactive 1–5 heart rating.
export function HeartRating({ value = 0, onChange, size = 18 }) {
  const interactive = typeof onChange === 'function'
  return (
    <span className={`hearts ${interactive ? 'hearts--interactive' : ''}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className="heart-btn"
          tabIndex={interactive ? 0 : -1}
          aria-label={`${n} heart${n > 1 ? 's' : ''}`}
          onClick={interactive ? () => onChange(n === value ? 0 : n) : undefined}
          style={{ cursor: interactive ? 'pointer' : 'default' }}
        >
          <HeartIcon
            size={size}
            filled={n <= value}
            style={{ color: n <= value ? '#f43f5e' : '#d8d8dd' }}
          />
        </button>
      ))}
    </span>
  )
}

// Read-only or interactive 1–5 flame rating (physical chemistry).
export function FlameRating({ value = 0, onChange, size = 18 }) {
  const interactive = typeof onChange === 'function'
  return (
    <span className={`flames ${interactive ? 'flames--interactive' : ''}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className="flame-btn"
          tabIndex={interactive ? 0 : -1}
          aria-label={`${n} flame${n > 1 ? 's' : ''}`}
          onClick={interactive ? () => onChange(n === value ? 0 : n) : undefined}
          style={{ cursor: interactive ? 'pointer' : 'default' }}
        >
          <FlameIcon
            size={size}
            filled={n <= value}
            style={{ color: n <= value ? '#f97316' : '#d8d8dd' }}
          />
        </button>
      ))}
    </span>
  )
}

// Small rounded tag.
export function Chip({ children, onRemove }) {
  return (
    <span className="chip">
      {children}
      {onRemove && (
        <button type="button" className="chip-remove" onClick={onRemove} aria-label="Remove">
          ×
        </button>
      )}
    </span>
  )
}
