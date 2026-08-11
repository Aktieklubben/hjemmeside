// De fem der har adgang til deres egen Dating CRM. Hver har deres eget
// isolerede localStorage (se storage.js) — data deles ikke mellem dem,
// selvom det er samme app/browser.
export const USERS = [
  { slug: 'lasse', name: 'Lasse' },
  { slug: 'mikkel', name: 'Mikkel' },
  { slug: 'emil', name: 'Emil' },
  { slug: 'christian', name: 'Christian' },
  { slug: 'jacob', name: 'Jacob' },
]

export function getCurrentUser() {
  const params = new URLSearchParams(window.location.search)
  const slug = params.get('user')
  return USERS.find((u) => u.slug === slug) || null
}
