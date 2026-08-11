// Relationship status options. Each has a label plus a foreground/background
// color used by the status badges throughout the UI.
export const STATUSES = [
  { value: 'New', label: 'New', color: '#2563eb', bg: '#eff6ff' },
  { value: 'Talking', label: 'Talking', color: '#b45309', bg: '#fffbeb' },
  { value: 'Dating', label: 'Dating', color: '#db2777', bg: '#fdf2f8' },
  { value: 'Exclusive', label: 'Exclusive', color: '#7c3aed', bg: '#f5f3ff' },
  { value: 'Paused', label: 'Paused', color: '#5b6370', bg: '#f4f4f5' },
  { value: 'Ended', label: 'Ended', color: '#dc2626', bg: '#fef2f2' },
  { value: 'Ghosted', label: 'Ghosted', color: '#475569', bg: '#f1f5f9' },
]

export function statusMeta(value) {
  return STATUSES.find((s) => s.value === value) || STATUSES[0]
}

// Where the date came from.
export const PLATFORMS = [
  'Tinder',
  'Hinge',
  'Bumble',
  'Raya',
  'OkCupid',
  'Coffee Meets Bagel',
  'In person',
  'Through friends',
  'Other',
]

// Kinds of logged interactions in the timeline.
export const INTERACTION_TYPES = [
  'Date',
  'Drinks',
  'Dinner',
  'Coffee',
  'Call',
  'Text',
  'Video call',
  'Hangout',
  'Other',
]

// Deterministic palette for generated avatars.
export const AVATAR_COLORS = [
  '#f43f5e',
  '#ec4899',
  '#d946ef',
  '#a855f7',
  '#8b5cf6',
  '#6366f1',
  '#3b82f6',
  '#0ea5e9',
  '#06b6d4',
  '#14b8a6',
  '#10b981',
  '#f59e0b',
  '#f97316',
  '#ef4444',
]

// Physical-intimacy progression. A warm gradient from amber (early) to deep
// rose (most intimate); level 0 is neutral grey.
export const INTIMACY_LEVELS = [
  { value: 0, label: 'Not yet', color: '#9b999f' },
  { value: 1, label: 'Flirting', color: '#f59e0b' },
  { value: 2, label: 'First kiss', color: '#fb923c' },
  { value: 3, label: 'Making out', color: '#f97316' },
  { value: 4, label: 'Spent the night', color: '#ef4444' },
  { value: 5, label: 'Sleeping together', color: '#e11d48' },
]

export function intimacyMeta(value) {
  return INTIMACY_LEVELS[value] || INTIMACY_LEVELS[0]
}

export const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently active' },
  { value: 'upcoming', label: 'Upcoming plans' },
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'rating', label: 'Top rated' },
  { value: 'added', label: 'Newest added' },
]
