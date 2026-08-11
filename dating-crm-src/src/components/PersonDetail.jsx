import { useState, useEffect, useRef } from 'react'
import { Avatar, StatusBadge, HeartRating, FlameRating, Chip } from './ui.jsx'
import { INTERACTION_TYPES, INTIMACY_LEVELS, intimacyMeta } from '../constants.js'
import {
  EditIcon,
  TrashIcon,
  CalendarIcon,
  MapPinIcon,
  BriefcaseIcon,
  PhoneIcon,
  SparkIcon,
  PlusIcon,
  ChevronLeftIcon,
  CloseIcon,
  WandIcon,
} from '../icons.jsx'
import { formatDate, relativeDay, daysFromToday, todayISO, uid, readImageFile } from '../utils.js'

// Full-screen image viewer with keyboard + arrow navigation.
function Lightbox({ images, index, onClose, onStep }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') onStep(1)
      else if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onStep])

  return (
    <div className="lightbox" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Close">
        <CloseIcon size={22} />
      </button>
      {images.length > 1 && (
        <button
          className="lightbox-nav lightbox-prev"
          onClick={(e) => {
            e.stopPropagation()
            onStep(-1)
          }}
          aria-label="Previous"
        >
          ‹
        </button>
      )}
      <img className="lightbox-img" src={images[index]} alt="" onClick={(e) => e.stopPropagation()} />
      {images.length > 1 && (
        <button
          className="lightbox-nav lightbox-next"
          onClick={(e) => {
            e.stopPropagation()
            onStep(1)
          }}
          aria-label="Next"
        >
          ›
        </button>
      )}
    </div>
  )
}

function Section({ title, action, children }) {
  return (
    <section className="card">
      <div className="card-head">
        <h3>{title}</h3>
        {action}
      </div>
      {children}
    </section>
  )
}

// One labeled fact (icon + label + value). Renders nothing if empty.
function Fact({ icon, label, value }) {
  if (!value) return null
  return (
    <div className="fact">
      <span className="fact-icon">{icon}</span>
      <div>
        <span className="fact-label">{label}</span>
        <span className="fact-value">{value}</span>
      </div>
    </div>
  )
}

// A block of free text with a heading. Renders nothing if empty.
function TextBlock({ label, value }) {
  if (!value || !value.trim()) return null
  return (
    <div className="text-block">
      <span className="text-block-label">{label}</span>
      <p className="text-block-body">{value}</p>
    </div>
  )
}

function AddInteraction({ onAdd, onCancel }) {
  const [entry, setEntry] = useState({
    date: todayISO(),
    type: 'Date',
    title: '',
    notes: '',
  })
  const set = (k, v) => setEntry((e) => ({ ...e, [k]: v }))

  function submit(e) {
    e.preventDefault()
    onAdd({ id: uid(), ...entry })
  }

  return (
    <form className="inline-form" onSubmit={submit}>
      <div className="inline-form-row">
        <input
          type="date"
          value={entry.date}
          onChange={(e) => set('date', e.target.value)}
          className="input"
        />
        <select value={entry.type} onChange={(e) => set('type', e.target.value)} className="input">
          {INTERACTION_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <input
        className="input"
        placeholder="Title (e.g. Drinks at Lidkoeb)"
        value={entry.title}
        onChange={(e) => set('title', e.target.value)}
        autoFocus
      />
      <textarea
        className="input"
        placeholder="How did it go? What did you talk about?"
        rows={2}
        value={entry.notes}
        onChange={(e) => set('notes', e.target.value)}
      />
      <div className="inline-form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Log it
        </button>
      </div>
    </form>
  )
}

export default function PersonDetail({ person, onEdit, onDelete, onPatch, onDesignDate, onBack }) {
  const [adding, setAdding] = useState(false)
  const [viewer, setViewer] = useState(null) // { images, index }
  const galleryRef = useRef(null)

  const photos = person.photos || []
  const timeline = [...(person.timeline || [])].sort((a, b) => (b.date || '').localeCompare(a.date || ''))

  async function onAddPhotos(e) {
    const files = [...(e.target.files || [])]
    e.target.value = ''
    if (!files.length) return
    const added = []
    for (const file of files) {
      try {
        added.push(await readImageFile(file, { maxDim: 1200, quality: 0.8 }))
      } catch {
        /* skip unreadable files */
      }
    }
    if (added.length) onPatch({ photos: [...photos, ...added] })
  }

  function removePhoto(idx) {
    onPatch({ photos: photos.filter((_, i) => i !== idx) })
  }

  function makeProfile(src) {
    onPatch({ photo: src })
  }

  function openViewer(images, index) {
    setViewer({ images, index })
  }

  function stepViewer(delta) {
    setViewer((v) => (v ? { ...v, index: (v.index + delta + v.images.length) % v.images.length } : v))
  }

  function addInteraction(entry) {
    const nextTimeline = [...(person.timeline || []), entry]
    const patch = { timeline: nextTimeline }
    // Keep "last contact" in sync with the most recent logged date.
    if (entry.date && (!person.lastContact || entry.date > person.lastContact)) {
      patch.lastContact = entry.date
    }
    onPatch(patch)
    setAdding(false)
  }

  function removeInteraction(id) {
    onPatch({ timeline: (person.timeline || []).filter((t) => t.id !== id) })
  }

  const nextDiff = person.nextDate ? daysFromToday(person.nextDate) : null
  const nextOverdue = nextDiff !== null && nextDiff < 0

  return (
    <div className="detail">
      <button className="back-btn" onClick={onBack}>
        <ChevronLeftIcon size={18} /> Back
      </button>

      <header className="detail-head">
        <Avatar
          person={person}
          size={84}
          onClick={person.photo ? () => openViewer([person.photo], 0) : undefined}
        />
        <div className="detail-head-main">
          <div className="detail-title">
            <h2>{person.name || 'Unnamed'}</h2>
            {person.age ? <span className="detail-age">{person.age}</span> : null}
            {person.pronouns ? <span className="detail-pronouns">{person.pronouns}</span> : null}
          </div>
          <div className="detail-sub">
            <StatusBadge status={person.status} />
            <HeartRating value={person.rating} onChange={(r) => onPatch({ rating: r })} />
          </div>
        </div>
        <div className="detail-actions">
          <button className="btn btn-primary" onClick={onDesignDate}>
            <WandIcon size={16} /> Design a date
          </button>
          <button className="btn btn-soft" onClick={onEdit}>
            <EditIcon size={16} /> Edit
          </button>
          <button className="btn btn-icon btn-danger-ghost" onClick={onDelete} aria-label="Delete">
            <TrashIcon size={16} />
          </button>
        </div>
      </header>

      <div className="facts">
        <Fact
          icon={<SparkIcon size={16} />}
          label="Met on"
          value={[person.metOn, person.metDate ? formatDate(person.metDate) : null]
            .filter(Boolean)
            .join(' · ')}
        />
        <Fact icon={<MapPinIcon size={16} />} label="Location" value={person.location} />
        <Fact icon={<BriefcaseIcon size={16} />} label="Work" value={person.occupation} />
        <Fact
          icon={<PhoneIcon size={16} />}
          label="Contact"
          value={[person.phone, person.instagram].filter(Boolean).join(' · ')}
        />
      </div>

      {/* Next plan — the most action-oriented card, pinned near the top. */}
      <section className={`card next-card ${nextOverdue ? 'next-card--overdue' : ''}`}>
        <div className="next-card-icon">
          <CalendarIcon size={20} />
        </div>
        <div className="next-card-body">
          <span className="next-card-label">Next plan</span>
          {person.nextDate || person.nextNote ? (
            <>
              <span className="next-card-when">
                {person.nextDate ? (
                  <>
                    {formatDate(person.nextDate)}
                    <span className="next-card-rel">{relativeDay(person.nextDate)}</span>
                  </>
                ) : (
                  'No date set'
                )}
              </span>
              {person.nextNote && <span className="next-card-note">{person.nextNote}</span>}
            </>
          ) : (
            <span className="next-card-empty">Nothing planned — add one via Edit.</span>
          )}
        </div>
      </section>

      {/* Photos */}
      <Section
        title="Photos"
        action={
          <button className="btn btn-soft btn-sm" onClick={() => galleryRef.current?.click()}>
            <PlusIcon size={15} /> Add
          </button>
        }
      >
        <input ref={galleryRef} type="file" accept="image/*" multiple hidden onChange={onAddPhotos} />
        {photos.length === 0 ? (
          <p className="empty-hint">No photos yet — add a few to remember the vibe.</p>
        ) : (
          <div className="gallery">
            {photos.map((src, i) => (
              <div className="gallery-item" key={i}>
                <img src={src} alt="" loading="lazy" onClick={() => openViewer(photos, i)} />
                <div className="gallery-actions">
                  <button
                    type="button"
                    className={`gallery-btn ${person.photo === src ? 'is-profile' : ''}`}
                    title={person.photo === src ? 'Current profile picture' : 'Set as profile picture'}
                    onClick={() => makeProfile(src)}
                  >
                    {person.photo === src ? '★' : '☆'}
                  </button>
                  <button
                    type="button"
                    className="gallery-btn gallery-btn--del"
                    title="Remove photo"
                    onClick={() => removePhoto(i)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Timeline */}
      <Section
        title="Timeline"
        action={
          !adding && (
            <button className="btn btn-soft btn-sm" onClick={() => setAdding(true)}>
              <PlusIcon size={15} /> Log
            </button>
          )
        }
      >
        {adding && <AddInteraction onAdd={addInteraction} onCancel={() => setAdding(false)} />}
        {timeline.length === 0 && !adding ? (
          <p className="empty-hint">No interactions logged yet.</p>
        ) : (
          <ol className="timeline">
            {timeline.map((t) => (
              <li key={t.id} className="timeline-item">
                <span className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-top">
                    <span className="timeline-type">{t.type}</span>
                    <span className="timeline-date">{formatDate(t.date)}</span>
                    <button
                      className="timeline-del"
                      onClick={() => removeInteraction(t.id)}
                      aria-label="Delete entry"
                    >
                      ×
                    </button>
                  </div>
                  {t.title && <p className="timeline-title">{t.title}</p>}
                  {t.notes && <p className="timeline-notes">{t.notes}</p>}
                </div>
              </li>
            ))}
          </ol>
        )}
      </Section>

      {/* Physical */}
      <Section title="Physical">
        <div className="intimacy">
          <div className="intimacy-top">
            <span className="intimacy-stage" style={{ color: intimacyMeta(person.intimacy).color }}>
              {intimacyMeta(person.intimacy).label}
            </span>
            {person.firstKiss && (
              <span className="intimacy-kiss">First kiss · {formatDate(person.firstKiss)}</span>
            )}
          </div>
          <div className="intimacy-bar">
            {INTIMACY_LEVELS.slice(1).map((l) => (
              <button
                key={l.value}
                type="button"
                className={`intimacy-seg ${person.intimacy >= l.value ? 'is-on' : ''}`}
                style={person.intimacy >= l.value ? { background: l.color } : undefined}
                title={l.label}
                onClick={() => onPatch({ intimacy: l.value })}
              />
            ))}
          </div>
          <div className="intimacy-chem">
            <span className="intimacy-chem-label">Chemistry</span>
            <FlameRating value={person.chemistry} onChange={(v) => onPatch({ chemistry: v })} />
          </div>
          {person.intimacyNotes && person.intimacyNotes.trim() && (
            <p className="text-block-body intimacy-notes">{person.intimacyNotes}</p>
          )}
        </div>
      </Section>

      {/* Interests */}
      {person.interests && person.interests.length > 0 && (
        <Section title="Interests">
          <div className="chip-row">
            {person.interests.map((i) => (
              <Chip key={i}>{i}</Chip>
            ))}
          </div>
        </Section>
      )}

      {/* About */}
      {(person.hobbies || person.family || person.friends) && (
        <Section title="About">
          <TextBlock label="Hobbies & interests" value={person.hobbies} />
          <TextBlock label="Family" value={person.family} />
          <TextBlock label="Friends" value={person.friends} />
        </Section>
      )}

      {/* Food */}
      {(person.foodLikes || person.foodDislikes || person.dietary) && (
        <Section title="Food & drink">
          <TextBlock label="Likes" value={person.foodLikes} />
          <TextBlock label="Dislikes" value={person.foodDislikes} />
          <TextBlock label="Dietary" value={person.dietary} />
        </Section>
      )}

      {/* Flags */}
      {(person.greenFlags || person.redFlags) && (
        <Section title="Flags">
          {person.greenFlags && (
            <div className="flag flag--green">
              <span className="flag-label">Green flags</span>
              <p>{person.greenFlags}</p>
            </div>
          )}
          {person.redFlags && (
            <div className="flag flag--red">
              <span className="flag-label">Red flags</span>
              <p>{person.redFlags}</p>
            </div>
          )}
        </Section>
      )}

      {/* Notes */}
      {person.notes && person.notes.trim() && (
        <Section title="Notes">
          <p className="text-block-body">{person.notes}</p>
        </Section>
      )}

      <footer className="detail-foot">
        {person.lastContact && <span>Last contact {formatDate(person.lastContact)}</span>}
        {person.createdAt && <span>Added {formatDate(person.createdAt.slice(0, 10))}</span>}
      </footer>

      {viewer && (
        <Lightbox
          images={viewer.images}
          index={viewer.index}
          onClose={() => setViewer(null)}
          onStep={stepViewer}
        />
      )}
    </div>
  )
}
