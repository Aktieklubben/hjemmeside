import { useState, useEffect, useRef } from 'react'
import { STATUSES, PLATFORMS, INTIMACY_LEVELS } from '../constants.js'
import { HeartRating, FlameRating, Chip, Avatar } from './ui.jsx'
import { CloseIcon } from '../icons.jsx'
import { readImageFile } from '../utils.js'

function Field({ label, hint, children, full }) {
  return (
    <label className={`field ${full ? 'field--full' : ''}`}>
      <span className="field-label">
        {label}
        {hint && <span className="field-hint">{hint}</span>}
      </span>
      {children}
    </label>
  )
}

function Group({ title, children }) {
  return (
    <fieldset className="form-group">
      <legend>{title}</legend>
      <div className="form-grid">{children}</div>
    </fieldset>
  )
}

export default function PersonForm({ person, isNew, onSave, onCancel }) {
  const [draft, setDraft] = useState(person)
  const [interestInput, setInterestInput] = useState('')
  const nameRef = useRef(null)
  const photoRef = useRef(null)

  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  // Close on Escape.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  const set = (key, value) => setDraft((d) => ({ ...d, [key]: value }))

  async function onPhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const data = await readImageFile(file, { maxDim: 480, quality: 0.85 })
      set('photo', data)
    } catch {
      alert("Sorry, that image couldn't be read. Try a different file.")
    }
    e.target.value = ''
  }

  function addInterest() {
    const v = interestInput.trim()
    if (!v) return
    if (!draft.interests.includes(v)) {
      set('interests', [...draft.interests, v])
    }
    setInterestInput('')
  }

  function onInterestKey(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addInterest()
    } else if (e.key === 'Backspace' && !interestInput && draft.interests.length) {
      set('interests', draft.interests.slice(0, -1))
    }
  }

  function submit(e) {
    e.preventDefault()
    if (!draft.name.trim()) {
      nameRef.current?.focus()
      return
    }
    onSave({ ...draft, name: draft.name.trim() })
  }

  return (
    <div className="modal-overlay" onMouseDown={onCancel}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <header className="modal-head">
          <h2>{isNew ? 'Add a date' : `Edit ${person.name || 'date'}`}</h2>
          <button className="btn btn-icon" onClick={onCancel} aria-label="Close">
            <CloseIcon size={18} />
          </button>
        </header>

        <form className="modal-body" onSubmit={submit} id="person-form">
          <Group title="Basics">
            <div className="photo-field field--full">
              <Avatar person={draft} size={76} />
              <div className="photo-field-side">
                <span className="photo-field-label">Profile picture</span>
                <div className="photo-field-actions">
                  <button
                    type="button"
                    className="btn btn-soft btn-sm"
                    onClick={() => photoRef.current?.click()}
                  >
                    {draft.photo ? 'Change' : 'Upload'}
                  </button>
                  {draft.photo && (
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => set('photo', '')}>
                      Remove
                    </button>
                  )}
                </div>
                <input
                  ref={photoRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={onPhotoChange}
                />
              </div>
            </div>
            <Field label="Name" full>
              <input
                ref={nameRef}
                className="input"
                value={draft.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Who is this?"
                required
              />
            </Field>
            <Field label="Age">
              <input
                className="input"
                type="number"
                min="18"
                max="120"
                value={draft.age}
                onChange={(e) => set('age', e.target.value)}
                placeholder="—"
              />
            </Field>
            <Field label="Pronouns">
              <input
                className="input"
                value={draft.pronouns}
                onChange={(e) => set('pronouns', e.target.value)}
                placeholder="she/her, he/him…"
              />
            </Field>
            <Field label="Status">
              <select className="input" value={draft.status} onChange={(e) => set('status', e.target.value)}>
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Rating">
              <div className="field-hearts">
                <HeartRating value={draft.rating} onChange={(r) => set('rating', r)} size={22} />
              </div>
            </Field>
            <Field label="Met on">
              <select className="input" value={draft.metOn} onChange={(e) => set('metOn', e.target.value)}>
                {PLATFORMS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </Field>
            <Field label="Date matched / met">
              <input
                className="input"
                type="date"
                value={draft.metDate}
                onChange={(e) => set('metDate', e.target.value)}
              />
            </Field>
            <Field label="Location" full>
              <input
                className="input"
                value={draft.location}
                onChange={(e) => set('location', e.target.value)}
                placeholder="Neighborhood, city"
              />
            </Field>
            <Field label="Occupation" full>
              <input
                className="input"
                value={draft.occupation}
                onChange={(e) => set('occupation', e.target.value)}
                placeholder="What do they do?"
              />
            </Field>
          </Group>

          <Group title="Contact">
            <Field label="Phone">
              <input
                className="input"
                value={draft.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="+45…"
              />
            </Field>
            <Field label="Instagram / handle">
              <input
                className="input"
                value={draft.instagram}
                onChange={(e) => set('instagram', e.target.value)}
                placeholder="@…"
              />
            </Field>
          </Group>

          <Group title="Plans">
            <Field label="Last contact">
              <input
                className="input"
                type="date"
                value={draft.lastContact}
                onChange={(e) => set('lastContact', e.target.value)}
              />
            </Field>
            <Field label="Next date / plan">
              <input
                className="input"
                type="date"
                value={draft.nextDate}
                onChange={(e) => set('nextDate', e.target.value)}
              />
            </Field>
            <Field label="Plan details" full>
              <input
                className="input"
                value={draft.nextNote}
                onChange={(e) => set('nextNote', e.target.value)}
                placeholder="e.g. Dinner at Bæst, then a walk"
              />
            </Field>
          </Group>

          <Group title="Physical">
            <Field label="How far things have gone" full>
              <select
                className="input"
                value={draft.intimacy}
                onChange={(e) => set('intimacy', Number(e.target.value))}
              >
                {INTIMACY_LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Chemistry">
              <div className="field-flames">
                <FlameRating value={draft.chemistry} onChange={(v) => set('chemistry', v)} size={22} />
              </div>
            </Field>
            <Field label="First kiss">
              <input
                className="input"
                type="date"
                value={draft.firstKiss}
                onChange={(e) => set('firstKiss', e.target.value)}
              />
            </Field>
            <Field label="Notes" full>
              <textarea
                className="input"
                rows={2}
                value={draft.intimacyNotes}
                onChange={(e) => set('intimacyNotes', e.target.value)}
                placeholder="Physical chemistry, pace, anything worth remembering…"
              />
            </Field>
          </Group>

          <Group title="Interests">
            <Field label="Add interests" hint="Enter or comma to add" full>
              <input
                className="input"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={onInterestKey}
                onBlur={addInterest}
                placeholder="Pottery, jazz, trail running…"
              />
              {draft.interests.length > 0 && (
                <div className="chip-row" style={{ marginTop: 10 }}>
                  {draft.interests.map((i) => (
                    <Chip key={i} onRemove={() => set('interests', draft.interests.filter((x) => x !== i))}>
                      {i}
                    </Chip>
                  ))}
                </div>
              )}
            </Field>
          </Group>

          <Group title="About">
            <Field label="Hobbies & interests" full>
              <textarea
                className="input"
                rows={2}
                value={draft.hobbies}
                onChange={(e) => set('hobbies', e.target.value)}
                placeholder="What do they love doing?"
              />
            </Field>
            <Field label="Family" full>
              <textarea
                className="input"
                rows={2}
                value={draft.family}
                onChange={(e) => set('family', e.target.value)}
                placeholder="Siblings, parents, kids…"
              />
            </Field>
            <Field label="Friends" full>
              <textarea
                className="input"
                rows={2}
                value={draft.friends}
                onChange={(e) => set('friends', e.target.value)}
                placeholder="Names that come up, social circle…"
              />
            </Field>
          </Group>

          <Group title="Food & drink">
            <Field label="Likes" full>
              <textarea
                className="input"
                rows={2}
                value={draft.foodLikes}
                onChange={(e) => set('foodLikes', e.target.value)}
                placeholder="Favorite food, drinks, restaurants…"
              />
            </Field>
            <Field label="Dislikes" full>
              <input
                className="input"
                value={draft.foodDislikes}
                onChange={(e) => set('foodDislikes', e.target.value)}
                placeholder="What to avoid"
              />
            </Field>
            <Field label="Dietary / allergies" full>
              <input
                className="input"
                value={draft.dietary}
                onChange={(e) => set('dietary', e.target.value)}
                placeholder="Vegetarian, gluten-free, nut allergy…"
              />
            </Field>
          </Group>

          <Group title="Read on them">
            <Field label="Green flags" full>
              <textarea
                className="input"
                rows={2}
                value={draft.greenFlags}
                onChange={(e) => set('greenFlags', e.target.value)}
                placeholder="What's working / what you like"
              />
            </Field>
            <Field label="Red flags" full>
              <textarea
                className="input"
                rows={2}
                value={draft.redFlags}
                onChange={(e) => set('redFlags', e.target.value)}
                placeholder="Things to watch / dealbreakers"
              />
            </Field>
            <Field label="Notes" full>
              <textarea
                className="input"
                rows={3}
                value={draft.notes}
                onChange={(e) => set('notes', e.target.value)}
                placeholder="Anything else worth remembering"
              />
            </Field>
          </Group>
        </form>

        <footer className="modal-foot">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" form="person-form" className="btn btn-primary">
            {isNew ? 'Add date' : 'Save changes'}
          </button>
        </footer>
      </div>
    </div>
  )
}
