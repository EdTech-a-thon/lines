<script>
  // Draws the segment of the number line between start and end, with 10 equal
  // spaces (11 tick marks). Labels are revealed as the student finds them.
  let { n, start, end, mid, showStart = false, showEnd = false, showMid = false, highlight = null } = $props()

  const W = 1000
  const H = 190
  const PAD = 70
  const LINE_Y = 100
  const ticks = Array.from({ length: 11 }, (_, i) => i)

  const xOf = (v) => PAD + ((v - start) / (end - start)) * (W - 2 * PAD)
  const dotX = $derived(xOf(n))
</script>

<svg viewBox="0 0 {W} {H}" role="img" aria-label="Number line from {start} to {end} showing {n}">
  <!-- main line -->
  <line x1={PAD - 40} y1={LINE_Y} x2={W - PAD + 40} y2={LINE_Y} stroke="#1f2937" stroke-width="5" stroke-linecap="round" />
  <polygon points="{PAD - 52},{LINE_Y} {PAD - 36},{LINE_Y - 9} {PAD - 36},{LINE_Y + 9}" fill="#1f2937" />
  <polygon points="{W - PAD + 52},{LINE_Y} {W - PAD + 36},{LINE_Y - 9} {W - PAD + 36},{LINE_Y + 9}" fill="#1f2937" />

  <!-- tick marks -->
  {#each ticks as i}
    {@const x = PAD + (i / 10) * (W - 2 * PAD)}
    {@const major = i === 0 || i === 5 || i === 10}
    <line x1={x} y1={LINE_Y - (major ? 22 : 12)} x2={x} y2={LINE_Y + (major ? 22 : 12)}
      stroke={i === 5 ? '#7c3aed' : '#1f2937'} stroke-width={major ? 5 : 3} stroke-linecap="round" />
  {/each}

  <!-- start label -->
  <g class="label" class:found={showStart} class:winner={highlight === start}>
    <text x={PAD} y={LINE_Y + 58} text-anchor="middle">{showStart ? start : '?'}</text>
    <text class="tag" x={PAD} y={LINE_Y + 82} text-anchor="middle">start</text>
  </g>

  <!-- end label -->
  <g class="label" class:found={showEnd} class:winner={highlight === end}>
    <text x={W - PAD} y={LINE_Y + 58} text-anchor="middle">{showEnd ? end : '?'}</text>
    <text class="tag" x={W - PAD} y={LINE_Y + 82} text-anchor="middle">end</text>
  </g>

  <!-- midpoint label -->
  <g class="label mid" class:found={showMid}>
    <text x={W / 2} y={LINE_Y + 58} text-anchor="middle">{showMid ? mid : '?'}</text>
    <text class="tag" x={W / 2} y={LINE_Y + 82} text-anchor="middle">midpoint (halfway)</text>
  </g>

  <!-- the number being rounded -->
  <g class="dot">
    <line x1={dotX} y1={LINE_Y - 30} x2={dotX} y2={LINE_Y} stroke="#dc2626" stroke-width="3" stroke-dasharray="6 5" />
    <circle cx={dotX} cy={LINE_Y} r="13" fill="#dc2626" stroke="white" stroke-width="4" />
    <text x={dotX} y={LINE_Y - 42} text-anchor="middle" class="n">{n}</text>
  </g>

  <!-- arrow showing the rounding direction once solved -->
  {#if highlight !== null}
    {@const tx = xOf(highlight)}
    {@const dir = tx > dotX ? 1 : -1}
    <line x1={dotX + dir * 18} y1={LINE_Y - 4} x2={tx - dir * 12} y2={LINE_Y - 4}
      stroke="#16a34a" stroke-width="6" stroke-linecap="round" opacity="0.85" />
    <polygon points="{tx - dir * 4},{LINE_Y - 4} {tx - dir * 22},{LINE_Y - 16} {tx - dir * 22},{LINE_Y + 8}" fill="#16a34a" />
  {/if}
</svg>

<style>
  svg {
    width: 100%;
    height: auto;
    display: block;
    margin: 8px 0;
  }
  .label text {
    font-size: 40px;
    font-weight: 800;
    fill: #94a3b8;
  }
  .label .tag {
    font-size: 20px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .label.found text { fill: #1f2937; }
  .label.mid.found text { fill: #7c3aed; }
  .label.winner text { fill: #16a34a; }
  .dot .n {
    font-size: 34px;
    font-weight: 800;
    fill: #dc2626;
  }
</style>
