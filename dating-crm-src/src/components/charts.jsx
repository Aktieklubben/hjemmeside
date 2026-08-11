// Lightweight, dependency-free charts built from SVG + CSS.

// Donut chart with a centered total. `segments` = [{ label, value, color }].
export function Donut({ segments, size = 148, thickness = 20, centerLabel = '' }) {
  const total = segments.reduce((s, x) => s + x.value, 0)
  const r = (size - thickness) / 2
  const c = 2 * Math.PI * r
  let offset = 0
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="donut">
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={thickness} />
        {total > 0 &&
          segments
            .filter((s) => s.value > 0)
            .map((s, i) => {
              const len = (s.value / total) * c
              const el = (
                <circle
                  key={i}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={thickness}
                  strokeDasharray={`${len} ${c - len}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="butt"
                />
              )
              offset += len
              return el
            })}
      </g>
      <text textAnchor="middle">
        <tspan x={size / 2} y={size / 2 - 2} className="donut-num">
          {total}
        </tspan>
        <tspan x={size / 2} y={size / 2 + 17} className="donut-sub">
          {centerLabel}
        </tspan>
      </text>
    </svg>
  )
}

// Horizontal bars. `items` = [{ label, value, color? }].
export function HBars({ items, color = 'var(--accent)', suffix = '' }) {
  const max = Math.max(1, ...items.map((i) => i.value))
  return (
    <div className="hbars">
      {items.map((it, i) => (
        <div className="hbar-row" key={i}>
          <span className="hbar-label" title={it.label}>
            {it.label}
          </span>
          <div className="hbar-track">
            <div
              className="hbar-fill"
              style={{ width: `${(it.value / max) * 100}%`, background: it.color || color }}
            />
          </div>
          <span className="hbar-value">
            {it.value}
            {suffix}
          </span>
        </div>
      ))}
    </div>
  )
}

// Vertical bars. `items` = [{ label, value, color? }].
export function VBars({ items, color = 'var(--accent)' }) {
  const max = Math.max(1, ...items.map((i) => i.value))
  return (
    <div className="vbars">
      {items.map((it, i) => (
        <div className="vbar-col" key={i}>
          <span className="vbar-num">{it.value > 0 ? it.value : ''}</span>
          <div className="vbar-track">
            <div
              className="vbar-fill"
              style={{ height: `${(it.value / max) * 100}%`, background: it.color || color }}
            />
          </div>
          <span className="vbar-label">{it.label}</span>
        </div>
      ))}
    </div>
  )
}

// Funnel. `steps` = [{ label, value, color? }]; widths are relative to step 0.
export function Funnel({ steps }) {
  const base = Math.max(1, steps[0]?.value || 1)
  return (
    <div className="funnel">
      {steps.map((s, i) => {
        const pct = Math.round((s.value / base) * 100)
        return (
          <div className="funnel-row" key={i}>
            <div
              className="funnel-bar"
              style={{ width: `${Math.max(10, (s.value / base) * 100)}%`, background: s.color || 'var(--accent)' }}
            >
              <span className="funnel-val">{s.value}</span>
            </div>
            <span className="funnel-label">
              {s.label} <span className="funnel-pct">{pct}%</span>
            </span>
          </div>
        )
      })}
    </div>
  )
}
