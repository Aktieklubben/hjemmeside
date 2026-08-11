import { AVATAR_COLORS } from './constants.js'

// Short unique id for new records / timeline entries.
export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

// First letters of the first and last word of a name, e.g. "Anna Berg" -> "AB".
export function initials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Pick a stable color from the palette based on a string (id or name).
export function colorFor(seed) {
  const str = String(seed || '')
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

// Parse an ISO date (yyyy-mm-dd) into a local Date at midnight.
function parseDate(iso) {
  if (!iso) return null
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''))
  return isNaN(d.getTime()) ? null : d
}

export function formatDate(iso, opts = { month: 'short', day: 'numeric', year: 'numeric' }) {
  const d = parseDate(iso)
  if (!d) return ''
  return d.toLocaleDateString(undefined, opts)
}

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

// Whole-day difference between an ISO date and today (negative = past).
export function daysFromToday(iso) {
  const d = parseDate(iso)
  if (!d) return null
  const ms = d.getTime() - startOfToday().getTime()
  return Math.round(ms / 86400000)
}

// Friendly relative label: "Today", "Yesterday", "In 3 days", "2 weeks ago".
export function relativeDay(iso) {
  const diff = daysFromToday(iso)
  if (diff === null) return ''
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff === -1) return 'Yesterday'
  const abs = Math.abs(diff)
  const future = diff > 0
  let value, unit
  if (abs < 7) {
    value = abs
    unit = 'day'
  } else if (abs < 30) {
    value = Math.round(abs / 7)
    unit = 'week'
  } else if (abs < 365) {
    value = Math.round(abs / 30)
    unit = 'month'
  } else {
    value = Math.round(abs / 365)
    unit = 'year'
  }
  const plural = value === 1 ? unit : unit + 's'
  return future ? `In ${value} ${plural}` : `${value} ${plural} ago`
}

// Today's date as yyyy-mm-dd, for date input defaults.
export function todayISO() {
  const d = new Date()
  const off = d.getTimezoneOffset()
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10)
}

// The most recent interaction date for a person, falling back to lastContact.
export function lastActivity(person) {
  const dates = (person.timeline || []).map((t) => t.date).filter(Boolean)
  if (person.lastContact) dates.push(person.lastContact)
  if (dates.length === 0) return null
  return dates.sort().at(-1)
}

// Read an image File, downscale it to fit `maxDim`, and return a compressed
// JPEG data URL. Downscaling matters a lot here: photos are stored in
// localStorage (a few MB budget), so we keep each one small.
export function readImageFile(file, { maxDim = 1100, quality = 0.8 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type || !file.type.startsWith('image/')) {
      reject(new Error('Not an image file'))
      return
    }
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error || new Error('Could not read file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Could not decode image'))
      img.onload = () => {
        let { width, height } = img
        if (Math.max(width, height) > maxDim) {
          if (width >= height) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          } else {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        try {
          resolve(canvas.toDataURL('image/jpeg', quality))
        } catch (err) {
          reject(err)
        }
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
