#!/usr/bin/env node
// Henter historiske kurser fra Yahoo Finance (ingen API-nøgle krævet) for
// hvert medlems beholdninger + S&P 500 og OMXC25, og beregner performance
// for i dag / 7 dage / 1 måned / 3 måneder / 6 måneder / 1 år.
//
// Output: src/data/performance.json (bruges statisk af Aktie-oversigt-siden)
//
// Kør: node scripts/fetch-performance.mjs

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MEMBERS_DIR = path.join(ROOT, "data", "members");
const OUTPUT_FILE = path.join(ROOT, "src", "data", "performance.json");

const INDICES = [
  { id: "sp500", name: "S&P 500", symbol: "^GSPC" },
  { id: "omxc25", name: "OMXC25 (Danmark)", symbol: "^OMXC25" },
];

const PERIODS = [
  { id: "1d", label: "I dag", days: 1 },
  { id: "7d", label: "7 dage", days: 7 },
  { id: "1m", label: "1 måned", days: 30 },
  { id: "3m", label: "3 måneder", days: 91 },
  { id: "6m", label: "6 måneder", days: 182 },
  { id: "1y", label: "1 år", days: 365 },
];

const DAY_MS = 24 * 60 * 60 * 1000;

async function loadMembers() {
  const files = await readdir(MEMBERS_DIR);
  const members = [];
  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const raw = await readFile(path.join(MEMBERS_DIR, file), "utf-8");
    members.push(JSON.parse(raw));
  }
  return members;
}

async function fetchSeries(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    symbol
  )}?range=2y&interval=1d`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (aktieklub-website performance script)" },
  });
  if (!res.ok) {
    throw new Error(`Kunne ikke hente ${symbol}: HTTP ${res.status}`);
  }
  const json = await res.json();
  const result = json?.chart?.result?.[0];
  if (!result) {
    throw new Error(`Intet data for ${symbol} (muligvis forkert ticker)`);
  }
  const timestamps = result.timestamp ?? [];
  const closes = result.indicators?.quote?.[0]?.close ?? [];
  const series = [];
  for (let i = 0; i < timestamps.length; i++) {
    if (closes[i] == null) continue;
    series.push({ t: timestamps[i] * 1000, close: closes[i] });
  }
  series.sort((a, b) => a.t - b.t);
  return series;
}

// Finder seneste kendte kurs på eller før targetMs (fremad-udfyldning for
// helligdage/weekender/manglende data).
function valueOnOrBefore(series, targetMs) {
  let candidate = null;
  for (const point of series) {
    if (point.t <= targetMs) {
      candidate = point;
    } else {
      break;
    }
  }
  return candidate ? candidate.close : null;
}

function computePeriodChanges(series) {
  if (series.length === 0) return {};
  const latest = series[series.length - 1];
  const changes = {};
  for (const period of PERIODS) {
    const targetMs = latest.t - period.days * DAY_MS;
    const past = valueOnOrBefore(series, targetMs);
    changes[period.id] =
      past && past !== 0 ? ((latest.close - past) / past) * 100 : null;
  }
  return changes;
}

// Bygger en normaliseret (start = 100) tidsserie for det seneste år,
// samplet på de datoer hvor S&P 500 har handlet (fælles kalender).
function normalizedYearSeries(series, calendarDates) {
  if (series.length === 0) return [];
  const oneYearAgo = calendarDates[0];
  const startValue = valueOnOrBefore(series, oneYearAgo);
  if (!startValue) return [];
  return calendarDates.map((ms) => {
    const value = valueOnOrBefore(series, ms);
    return {
      date: new Date(ms).toISOString().slice(0, 10),
      value: value ? Number(((value / startValue) * 100).toFixed(2)) : null,
    };
  });
}

// En holding tæller kun med på datoer fra og med boughtDate til og med
// soldDate (eller til i dag, hvis den ikke er solgt endnu). Solgte
// beholdninger forsvinder fra opgørelsen efter salget — der tracks ingen
// kontantbeholdning.
function isHoldingActive(holding, ms) {
  const boughtMs = holding.boughtDate ? Date.parse(holding.boughtDate) : null;
  const soldMs = holding.soldDate ? Date.parse(holding.soldDate) : null;
  if (boughtMs != null && ms < boughtMs) return false;
  if (soldMs != null && ms > soldMs) return false;
  return true;
}

function portfolioValueSeries(holdings, seriesBySymbol, dates) {
  return dates
    .map((ms) => {
      let total = 0;
      let hasAny = false;
      for (const holding of holdings) {
        if (!isHoldingActive(holding, ms)) continue;
        const series = seriesBySymbol.get(holding.symbol);
        if (!series) continue;
        const price = valueOnOrBefore(series, ms);
        if (price != null) {
          total += price * holding.shares;
          hasAny = true;
        }
      }
      return hasAny ? { t: ms, close: total } : { t: ms, close: null };
    })
    .filter((p) => p.close != null);
}

async function main() {
  const members = await loadMembers();
  if (members.length === 0) {
    console.warn("Ingen medlemsfiler fundet i data/members/. Springer over.");
  }

  const uniqueSymbols = new Set();
  for (const member of members) {
    for (const holding of member.holdings) uniqueSymbols.add(holding.symbol);
  }
  for (const index of INDICES) uniqueSymbols.add(index.symbol);

  const seriesBySymbol = new Map();
  for (const symbol of uniqueSymbols) {
    process.stdout.write(`Henter ${symbol}... `);
    try {
      const series = await fetchSeries(symbol);
      seriesBySymbol.set(symbol, series);
      console.log(`OK (${series.length} datapunkter)`);
    } catch (err) {
      console.log(`FEJL: ${err.message}`);
    }
    // Vær pænt ved Yahoo's API
    await new Promise((r) => setTimeout(r, 300));
  }

  // Fælles kalender: handelsdage for S&P 500 det seneste år.
  const sp500Series = seriesBySymbol.get("^GSPC") ?? [];
  const now = Date.now();
  const oneYearAgoMs = now - 365 * DAY_MS;
  const calendarDates = sp500Series
    .filter((p) => p.t >= oneYearAgoMs)
    .map((p) => p.t);

  const membersOut = members.map((member) => {
    const holdingsSeries = portfolioValueSeries(
      member.holdings,
      seriesBySymbol,
      sp500Series.map((p) => p.t)
    );
    return {
      id: member.id,
      name: member.name,
      changes: computePeriodChanges(holdingsSeries),
      series: normalizedYearSeries(holdingsSeries, calendarDates),
    };
  });

  const indicesOut = INDICES.map((index) => {
    const series = seriesBySymbol.get(index.symbol) ?? [];
    return {
      id: index.id,
      name: index.name,
      changes: computePeriodChanges(series),
      series: normalizedYearSeries(series, calendarDates),
    };
  });

  const output = {
    generatedAt: new Date().toISOString(),
    periods: PERIODS.map(({ id, label }) => ({ id, label })),
    members: membersOut,
    indices: indicesOut,
  };

  await mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await writeFile(OUTPUT_FILE, JSON.stringify(output, null, 2), "utf-8");
  console.log(`Skrev ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
