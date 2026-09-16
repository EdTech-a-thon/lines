// Turns the activity settings into URL text (for a shareable link) and back.

export const UNITS = [10, 100, 1000]
export const MAXES = [100, 1000, 10000]
export const MAX_QUESTIONS = 100

export const DEFAULT_SETTINGS = {
  units: [10],      // round to the nearest 10, 100, and/or 1,000
  max: 100,         // numbers go up to this (like the classroom 0–100 line)
  count: 10,        // questions in the drill
  mode: 'guided',   // 'guided' asks start, end, midpoint then round; 'quick' just asks round
  labels: false,    // number every tick mark on the line
  retry: false,     // let students try a step again after a wrong answer
}

export function settingsToQuery(s) {
  const p = new URLSearchParams()
  p.set('to', s.units.join(','))
  p.set('max', String(s.max))
  p.set('n', String(s.count))
  p.set('mode', s.mode)
  p.set('labels', s.labels ? '1' : '0')
  p.set('retry', s.retry ? '1' : '0')
  return p.toString()
}

export function settingsFromParams(params) {
  const d = DEFAULT_SETTINGS
  const max = MAXES.includes(Number(params.get('max'))) ? Number(params.get('max')) : d.max
  // Only units that fit inside the range make sense; anything else falls back.
  const units = (params.get('to') ?? '')
    .split(',')
    .map(Number)
    .filter((u) => UNITS.includes(u) && u <= max)
  const mode = params.get('mode') === 'quick' ? 'quick' : 'guided'
  return {
    units: units.length ? units : usableUnits(max, d.units),
    max,
    count: clampCount(params.get('n'), d.count),
    mode,
    labels: bool(params.get('labels'), d.labels),
    retry: bool(params.get('retry'), d.retry),
  }
}

/** Keep the chosen units inside the range, falling back to the smallest. */
export function usableUnits(max, units) {
  const kept = units.filter((u) => u <= max)
  return kept.length ? kept : [UNITS[0]]
}

export function clampCount(v, fallback) {
  const n = Math.round(Number(v))
  if (!Number.isFinite(n) || n <= 0) return fallback
  return Math.min(MAX_QUESTIONS, n)
}

function bool(v, fallback) {
  if (v === '1') return true
  if (v === '0') return false
  return fallback
}

/** A one-line summary of the settings, for the start gate and the report. */
export function describeSettings(s) {
  const units = s.units.map((u) => u.toLocaleString('en-US'))
  const unitText = units.length === 1 ? units[0] : units.slice(0, -1).join(', ') + ' or ' + units.at(-1)
  const parts = [
    `Round to the nearest ${unitText}`,
    `numbers up to ${s.max.toLocaleString('en-US')}`,
    `${s.count} question${s.count === 1 ? '' : 's'}`,
    s.mode === 'guided' ? 'guided steps' : 'quick rounding',
  ]
  if (s.labels) parts.push('every tick numbered')
  if (s.retry) parts.push('retries allowed')
  return parts.join(' · ')
}
