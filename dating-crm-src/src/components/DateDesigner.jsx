import { useState, useMemo, useEffect } from 'react'
import { designDates, INTENT_META, EFFORT_LABEL } from '../dateIdeas.js'
import { WandIcon, CloseIcon, CalendarIcon, MapPinIcon } from '../icons.jsx'
import { Chip } from './ui.jsx'

function IdeaCard({ idea, onUse }) {
  const meta = INTENT_META[idea.intent]
  return (
    <article className="idea-card">
      <div className="idea-top">
        <span className="idea-intent" style={{ color: meta.color, background: meta.bg }}>
          {meta.label}
        </span>
        <span className="idea-vibe">{idea.vibeLabel}</span>
      </div>
      <h4 className="idea-title">{idea.title}</h4>
      <p className="idea-blurb">{idea.blurb}</p>

      <ul className="idea-why">
        {idea.why.map((w, i) => (
          <li key={i}>{w}</li>
        ))}
      </ul>

      {idea.food && (
        <div className="idea-food">
          <span className="idea-food-label">Food</span>
          {idea.food}.
        </div>
      )}

      <div className="idea-foot">
        <div className="idea-tags">
          <span className="idea-tag">{EFFORT_LABEL[idea.effort]}</span>
          <span className="idea-tag">{'€'.repeat(idea.cost)}</span>
          <span className="idea-tag">
            <MapPinIcon size={12} /> {idea.outdoor ? 'Outdoors' : 'Indoors'}
          </span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => onUse(idea)}>
          <CalendarIcon size={14} /> Make this the plan
        </button>
      </div>
    </article>
  )
}

export default function DateDesigner({ person, onClose, onUsePlan }) {
  const [seed, setSeed] = useState(0)
  const { ideas, context } = useMemo(() => designDates(person, seed), [person, seed])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function use(idea) {
    onUsePlan(`${idea.title} — ${idea.blurb}`)
  }

  const interests = person.interests || []

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal modal--wide" onMouseDown={(e) => e.stopPropagation()}>
        <header className="modal-head">
          <div className="designer-head">
            <span className="designer-mark">
              <WandIcon size={18} />
            </span>
            <div>
              <h2>Date designer</h2>
              <p className="designer-sub">
                Ideas for {person.name || 'your date'}, from{' '}
                {interests.length ? `${interests.length} interest${interests.length > 1 ? 's' : ''}` : 'what you know'}
                {context.pastCount > 0
                  ? ` and your ${context.pastCount} date${context.pastCount > 1 ? 's' : ''} so far`
                  : ''}
                .
              </p>
            </div>
          </div>
          <button className="btn btn-icon" onClick={onClose} aria-label="Close">
            <CloseIcon size={18} />
          </button>
        </header>

        <div className="modal-body">
          {interests.length > 0 && (
            <div className="chip-row designer-interests">
              {interests.map((i) => (
                <Chip key={i}>{i}</Chip>
              ))}
            </div>
          )}

          {ideas.length === 0 ? (
            <p className="empty-hint">
              Add a few interests to {person.name || 'this person'} and I’ll tailor some ideas.
            </p>
          ) : (
            <div className="idea-list">
              {ideas.map((idea) => (
                <IdeaCard key={idea.intent + idea.id} idea={idea} onUse={use} />
              ))}
            </div>
          )}
        </div>

        <footer className="modal-foot modal-foot--split">
          <button className="btn btn-soft" onClick={() => setSeed((s) => s + 1)}>
            <WandIcon size={15} /> New ideas
          </button>
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
  )
}
