import { STATUSES } from './constants.js'

const ACTIVE_STATUSES = ['New', 'Talking', 'Dating', 'Exclusive']
// Interaction types that count as actually meeting up in person.
const MEETUP_TYPES = ['Date', 'Drinks', 'Dinner', 'Coffee', 'Hangout']

// Whole-day gap between two ISO dates, or null if either is missing/invalid.
function daysBetween(a, b) {
  if (!a || !b) return null
  const da = new Date(a + 'T00:00:00')
  const db = new Date(b + 'T00:00:00')
  if (isNaN(da.getTime()) || isNaN(db.getTime())) return null
  return Math.round((db.getTime() - da.getTime()) / 86400000)
}

function lastNMonths(n) {
  const out = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const dt = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`
    out.push({ key, label: dt.toLocaleDateString(undefined, { month: 'short' }) })
  }
  return out
}

export function computeStats(people) {
  const total = people.length
  const active = people.filter((p) => ACTIVE_STATUSES.includes(p.status)).length

  const rated = people.filter((p) => p.rating > 0)
  const avgRating = rated.length ? rated.reduce((s, p) => s + p.rating, 0) / rated.length : 0

  const allEntries = people.flatMap((p) => p.timeline || [])
  const totalDates = allEntries.length

  // Status breakdown (only statuses that are actually used).
  const statusSeg = STATUSES.map((s) => ({
    label: s.label,
    color: s.color,
    value: people.filter((p) => p.status === s.value).length,
  })).filter((s) => s.value > 0)

  // Where you meet them.
  const platMap = {}
  people.forEach((p) => {
    const k = p.metOn || 'Other'
    platMap[k] = (platMap[k] || 0) + 1
  })
  const platforms = Object.entries(platMap)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)

  // Ratings distribution (1–5 hearts).
  const ratingDist = [1, 2, 3, 4, 5].map((n) => ({
    label: '♥'.repeat(n),
    value: people.filter((p) => p.rating === n).length,
  }))

  // Most common interests across everyone.
  const intMap = {}
  people.forEach((p) =>
    (p.interests || []).forEach((i) => {
      const k = i.trim()
      if (k) intMap[k] = (intMap[k] || 0) + 1
    }),
  )
  const topInterests = Object.entries(intMap)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)

  // Activity over the last 12 months.
  const months = lastNMonths(12)
  const monthCounts = months.map((m) => ({
    label: m.label,
    value: allEntries.filter((e) => (e.date || '').slice(0, 7) === m.key).length,
  }))

  // Progression funnel.
  const hadDate = people.filter((p) => (p.timeline || []).some((t) => MEETUP_TYPES.includes(t.type)))
    .length
  const datingPlus = people.filter((p) => ['Dating', 'Exclusive'].includes(p.status)).length
  const exclusive = people.filter((p) => p.status === 'Exclusive').length
  const funnel = [
    { label: 'Matched', value: total, color: '#94a3b8' },
    { label: 'Went on a date', value: hadDate, color: '#38bdf8' },
    { label: 'Dating', value: datingPlus, color: '#f472b6' },
    { label: 'Exclusive', value: exclusive, color: '#a78bfa' },
  ]

  const busiest = monthCounts.reduce((a, b) => (b.value > (a?.value ?? -1) ? b : a), null)

  // Physical chemistry + intimacy progression.
  const chem = people.filter((p) => p.chemistry > 0)
  const avgChem = chem.length ? chem.reduce((s, p) => s + p.chemistry, 0) / chem.length : 0
  const lvl = (p) => p.intimacy || 0
  const intimacyFunnel = [
    { label: 'Matched', value: total, color: '#94a3b8' },
    { label: 'Kissed', value: people.filter((p) => lvl(p) >= 2).length, color: '#fb923c' },
    { label: 'Spent the night', value: people.filter((p) => lvl(p) >= 4).length, color: '#f43f5e' },
    { label: 'Sleeping together', value: people.filter((p) => lvl(p) >= 5).length, color: '#e11d48' },
  ]
  const kissGaps = people
    .map((p) => daysBetween(p.metDate, p.firstKiss))
    .filter((d) => d !== null && d >= 0)
  const avgKissDays = kissGaps.length
    ? Math.round(kissGaps.reduce((a, b) => a + b, 0) / kissGaps.length)
    : null

  return {
    total,
    active,
    avgRating,
    ratedCount: rated.length,
    totalDates,
    statusSeg,
    platforms,
    ratingDist,
    topInterests,
    monthCounts,
    funnel,
    avgChem,
    chemCount: chem.length,
    intimacyFunnel,
    avgKissDays,
    topPlatform: platforms[0]?.label || '—',
    busiest: busiest && busiest.value > 0 ? busiest.label : '—',
  }
}
