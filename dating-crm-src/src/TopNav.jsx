import { useEffect, useRef, useState } from 'react'
import { USERS } from './users.js'

// Peger på Aktieklubbens hovedside. Dating CRM'en ligger altid præcis ét
// niveau under site-roden (fx /dating-crm/ eller /repo-navn/dating-crm/),
// så relative "../"-links virker uanset base path.
const LINKS = [
  { href: '../', label: 'Forside' },
  { href: '../aktie-oversigt/', label: 'Aktie-oversigt' },
  { href: '../aktiepraesentationer/', label: 'Aktiepræsentationer' },
  { href: '../aktieklub-rejser/', label: 'Aktieklub rejser' },
  { href: '../album/', label: 'Album' },
]

export default function TopNav({ currentUserSlug }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onClickOutside)
    return () => document.removeEventListener('click', onClickOutside)
  }, [])

  return (
    <header className="topnav" ref={ref}>
      <a className="topnav-brand" href="../">
        📈 Aktieklubben
      </a>
      <nav className="topnav-links">
        {LINKS.map((link) => (
          <a key={link.href} href={link.href} className="topnav-link">
            {link.label}
          </a>
        ))}
        <div className="topnav-dropdown">
          <button
            type="button"
            className="topnav-link topnav-link--active"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            Dating CRM <span className="topnav-caret">▾</span>
          </button>
          {open && (
            <ul className="topnav-menu">
              {USERS.map((u) => (
                <li key={u.slug}>
                  <a
                    href={`?user=${u.slug}`}
                    className={u.slug === currentUserSlug ? 'is-active' : ''}
                    onClick={() => setOpen(false)}
                  >
                    {u.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>
    </header>
  )
}
