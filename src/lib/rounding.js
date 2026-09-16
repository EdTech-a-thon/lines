// The maths behind one rounding question: which multiples of the unit sit on
// either side of the number, where halfway is, and which way it rounds.

export function roundingParts(n, unit) {
  const start = Math.floor(n / unit) * unit
  const end = start + unit
  const mid = start + unit / 2
  return { start, end, mid, answer: n >= mid ? end : start, halfway: n === mid }
}

/**
 * A fresh question for these settings. Numbers that are already multiples of
 * the unit are skipped (there is nothing to round), and so is the number that
 * was just asked, so the drill never shows the same thing twice in a row.
 */
export function randomProblem(settings, avoid = null) {
  const unit = settings.units[Math.floor(Math.random() * settings.units.length)]
  // Numbers smaller than the unit round to 0, which only confuses; when the
  // range allows it, start at the unit itself.
  const low = settings.max > unit ? unit : 1
  let n
  do {
    n = low + Math.floor(Math.random() * (settings.max - low))
  } while (n % unit === 0 || n === avoid)
  return { n, unit, ...roundingParts(n, unit) }
}

// The steps a guided question walks through, in order.
export const STEPS = [
  { id: 'start', label: 'starting point' },
  { id: 'end', label: 'end point' },
  { id: 'mid', label: 'midpoint' },
  { id: 'plot', label: 'plotting' },
  { id: 'round', label: 'rounding' },
]

export function stepQuestion(step, p) {
  switch (step) {
    case 'start':
      return `What is the starting point? (The nearest ${fmt(p.unit)} below ${fmt(p.n)})`
    case 'end':
      return `What is the end point? (The nearest ${fmt(p.unit)} above ${fmt(p.n)})`
    case 'mid':
      return `What is the midpoint? (Halfway between ${fmt(p.start)} and ${fmt(p.end)})`
    case 'plot':
      return `Plot ${fmt(p.n)} on the number line. Choose the tick mark closest to where it belongs.`
    default:
      return `Is ${fmt(p.n)} closer to ${fmt(p.start)} or ${fmt(p.end)}? Which way does it round?`
  }
}

export function stepHint(step, p) {
  switch (step) {
    case 'start':
      return `Count back from ${fmt(p.n)} until you reach a number that ends in ${'0'.repeat(String(p.unit).length - 1)}.`
    case 'end':
      return `Add ${fmt(p.unit)} to the starting point, ${fmt(p.start)}.`
    case 'mid':
      return `Halfway between ${fmt(p.start)} and ${fmt(p.end)} is ${fmt(p.start)} + ${fmt(p.unit / 2)}.`
    case 'plot':
      if (p.halfway) return `${fmt(p.n)} belongs right on the midpoint (${fmt(p.mid)}).`
      return `${fmt(p.n)} is ${p.n > p.mid ? 'greater than' : 'less than'} the midpoint (${fmt(p.mid)}), so choose a tick on that side.`
    default:
      return p.halfway
        ? `${fmt(p.n)} is exactly halfway. Halfway always rounds up.`
        : `${fmt(p.n)} is ${p.n > p.mid ? 'past' : 'before'} the midpoint (${fmt(p.mid)}).`
  }
}

export function stepAnswer(step, p) {
  if (step === 'plot') return nearestPlotValue(p)
  return step === 'round' ? p.answer : p[step]
}

/** The line has ten equal spaces; use the tick nearest to the target number. */
export function nearestPlotValue(p) {
  const tickSize = (p.end - p.start) / 10
  return p.start + Math.round((p.n - p.start) / tickSize) * tickSize
}

/** Why the number rounds the way it does, for the feedback after the last step. */
export function explainRounding(p) {
  if (p.halfway) return `${fmt(p.n)} is exactly halfway, and halfway always rounds up to ${fmt(p.end)}.`
  if (p.answer === p.end) return `${fmt(p.n)} is past the midpoint (${fmt(p.mid)}), so it is closer to ${fmt(p.end)}.`
  return `${fmt(p.n)} is before the midpoint (${fmt(p.mid)}), so it is closer to ${fmt(p.start)}.`
}

export function fmt(n) {
  return n.toLocaleString('en-US')
}
