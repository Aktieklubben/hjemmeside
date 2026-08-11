import { useMemo } from 'react'
import { computeStats } from '../stats.js'
import { Donut, HBars, VBars, Funnel } from './charts.jsx'
import { ChartIcon, ChevronLeftIcon } from '../icons.jsx'

function Kpi({ value, label, sub }) {
  return (
    <div className="kpi-card">
      <span className="kpi-value">{value}</span>
      <span className="kpi-label">{label}</span>
      {sub && <span className="kpi-sub">{sub}</span>}
    </div>
  )
}

function ChartCard({ title, children, wide }) {
  return (
    <section className={`chart-card ${wide ? 'chart-card--wide' : ''}`}>
      <h3 className="chart-title">{title}</h3>
      {children}
    </section>
  )
}

export default function Statistics({ people, onBack }) {
  const s = useMemo(() => computeStats(people), [people])

  if (s.total === 0) {
    return (
      <div className="stats-page">
        <div className="welcome">
          <div className="welcome-mark">
            <ChartIcon size={38} />
          </div>
          <h2>No data yet</h2>
          <p>Add a few people and log some dates — your stats and trends will show up here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="stats-page">
      <button className="back-btn" onClick={onBack}>
        <ChevronLeftIcon size={18} /> Back
      </button>

      <header className="stats-head">
        <h2>Statistics</h2>
        <p>Patterns across everyone you’re tracking.</p>
      </header>

      <div className="kpi-grid">
        <Kpi value={s.total} label="People" sub={`${s.active} active`} />
        <Kpi value={s.totalDates} label="Dates logged" sub={`busiest: ${s.busiest}`} />
        <Kpi
          value={s.avgRating ? s.avgRating.toFixed(1) : '—'}
          label="Avg rating"
          sub={s.ratedCount ? `from ${s.ratedCount} rated` : 'none rated'}
        />
        <Kpi
          value={s.avgChem ? s.avgChem.toFixed(1) : '—'}
          label="Avg chemistry"
          sub={s.chemCount ? `from ${s.chemCount} rated` : 'none rated'}
        />
        <Kpi value={s.topPlatform} label="Top source" sub="most matches" />
      </div>

      <div className="charts-grid">
        <ChartCard title="Status breakdown">
          <div className="donut-wrap">
            <Donut segments={s.statusSeg} centerLabel="people" />
            <ul className="legend">
              {s.statusSeg.map((seg) => (
                <li key={seg.label}>
                  <span className="legend-dot" style={{ background: seg.color }} />
                  <span className="legend-label">{seg.label}</span>
                  <span className="legend-value">{seg.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </ChartCard>

        <ChartCard title="Progression">
          <Funnel steps={s.funnel} />
        </ChartCard>

        <ChartCard title="Intimacy progression">
          <Funnel steps={s.intimacyFunnel} />
          {s.avgKissDays != null && (
            <p className="chart-caption">
              ~{s.avgKissDays} day{s.avgKissDays === 1 ? '' : 's'} from first date to first kiss, on
              average.
            </p>
          )}
        </ChartCard>

        <ChartCard title="Where you meet them">
          <HBars items={s.platforms} />
        </ChartCard>

        <ChartCard title="Ratings">
          <VBars items={s.ratingDist} color="#f43f5e" />
        </ChartCard>

        <ChartCard title="Activity (last 12 months)" wide>
          <VBars items={s.monthCounts} color="#8b5cf6" />
        </ChartCard>

        <ChartCard title="Top interests" wide>
          {s.topInterests.length ? (
            <HBars items={s.topInterests} color="#0ea5e9" />
          ) : (
            <p className="empty-hint">No interests added yet.</p>
          )}
        </ChartCard>
      </div>
    </div>
  )
}
