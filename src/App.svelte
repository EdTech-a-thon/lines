<script>
  import NumberLine from './NumberLine.svelte'

  // Settings
  let mode = $state(10)       // round to nearest 10 or 100
  let maxNum = $state(100)    // 100 (like the classroom number lines) or 1000
  let customInput = $state('')

  // Problem state
  let n = $state(randomNumber(10, 100))
  let step = $state(0)        // 0 start, 1 end, 2 midpoint, 3 round, 4 done
  let input = $state('')
  let feedback = $state(null) // { ok: boolean, msg: string }
  let attempts = $state(0)
  let streak = $state(0)
  let solved = $state(0)
  let inputEl = $state(null)

  const start = $derived(Math.floor(n / mode) * mode)
  const end = $derived(start + mode)
  const mid = $derived(start + mode / 2)
  const answer = $derived(n >= mid ? end : start)
  const isHalfway = $derived(n === mid)

  const steps = [
    { key: 'start', label: 'starting point', question: () => `What is the starting point? (The nearest ${mode} that is smaller than ${n})` },
    { key: 'end', label: 'end point', question: () => `What is the end point? (The nearest ${mode} that is bigger than ${n})` },
    { key: 'mid', label: 'midpoint', question: () => `What is the midpoint? (The number halfway between ${start} and ${end})` },
  ]
  const expected = $derived([start, end, mid])
  const hints = $derived([
    `Count backwards from ${n} until you land on a number that ends in ${mode === 10 ? '0' : '00'}.`,
    `Add ${mode} to the starting point, ${start}.`,
    `Halfway between ${start} and ${end} is ${start} + ${mode / 2}.`,
  ])

  function randomNumber(m, max) {
    // Pick a number that is not already a multiple of m (those don't need rounding)
    let x
    do { x = Math.floor(Math.random() * (max - 1)) + 1 } while (x % m === 0)
    return x
  }

  function loadNumber(x) {
    n = x
    step = 0
    input = ''
    feedback = null
    attempts = 0
    focusInput()
  }

  function newProblem() {
    loadNumber(randomNumber(mode, maxNum))
  }

  function useCustom() {
    const x = Number(customInput)
    if (!Number.isInteger(x) || x < 0) return
    if (x % mode === 0) {
      feedback = { ok: false, msg: `${x} is already a multiple of ${mode} — it doesn't need rounding! Try a different number.` }
      return
    }
    customInput = ''
    loadNumber(x)
  }

  function setMode(m) {
    mode = m
    newProblem()
  }

  function setMax(m) {
    maxNum = m
    newProblem()
  }

  function focusInput() {
    setTimeout(() => inputEl?.focus(), 0)
  }

  function check() {
    if (input === '' || input === null) return
    const guess = Number(input)
    if (guess === expected[step]) {
      feedback = { ok: true, msg: `Yes! The ${steps[step].label} is ${guess}.` }
      step += 1
      input = ''
      attempts = 0
      if (step < 3) focusInput()
    } else {
      attempts += 1
      feedback = { ok: false, msg: `Not quite. Hint: ${hints[step]}` }
      input = ''
      focusInput()
    }
  }

  function showMe() {
    input = String(expected[step])
    focusInput()
  }

  function chooseRound(choice) {
    if (choice === answer) {
      streak += 1
      solved += 1
      const why = isHalfway
        ? `${n} is exactly halfway, and halfway always rounds UP.`
        : choice === end
          ? `${n} is past the midpoint (${mid}), so it's closer to ${end}.`
          : `${n} is before the midpoint (${mid}), so it's closer to ${start}.`
      feedback = { ok: true, msg: `🎉 Correct! ${n} rounds to ${answer}. ${why}` }
    } else {
      streak = 0
      const why = isHalfway
        ? `${n} is exactly halfway between ${start} and ${end}. Remember the rule: halfway rounds UP to ${end}.`
        : answer === end
          ? `Look at the line: ${n} is past the midpoint (${mid}), so it's closer to ${end}.`
          : `Look at the line: ${n} is before the midpoint (${mid}), so it's closer to ${start}.`
      feedback = { ok: false, msg: `Not quite. ${why}` }
    }
    step = 4
  }

  function onKey(e) {
    if (e.key === 'Enter') check()
  }
</script>

<main>
  <header>
    <h1>📏 Rounding on a Number Line</h1>
    <div class="score">⭐ Solved: {solved} &nbsp;·&nbsp; 🔥 Streak: {streak}</div>
  </header>

  <section class="settings">
    <div class="group">
      <span>Round to the nearest:</span>
      <button class:active={mode === 10} onclick={() => setMode(10)}>10</button>
      <button class:active={mode === 100} onclick={() => setMode(100)}>100</button>
    </div>
    <div class="group">
      <span>Numbers up to:</span>
      <button class:active={maxNum === 100} onclick={() => setMax(100)}>100</button>
      <button class:active={maxNum === 1000} onclick={() => setMax(1000)}>1,000</button>
    </div>
    <div class="group">
      <span>Or pick your own:</span>
      <input type="number" min="0" bind:value={customInput} onkeydown={(e) => e.key === 'Enter' && useCustom()} />
      <button onclick={useCustom}>Go</button>
    </div>
  </section>

  <section class="problem">
    <h2>Round <span class="big">{n}</span> to the nearest {mode}</h2>

    <NumberLine {n} {start} {end} {mid}
      showStart={step > 0} showEnd={step > 1} showMid={step > 2}
      highlight={step === 4 ? answer : null} />

    {#if step < 3}
      <div class="prompt">
        <p class="question">Step {step + 1} of 4: {steps[step].question()}</p>
        <div class="row">
          <input type="number" bind:this={inputEl} bind:value={input} onkeydown={onKey} autofocus />
          <button class="primary" onclick={check}>Check</button>
          {#if attempts >= 2}
            <button class="ghost" onclick={showMe}>Show me</button>
          {/if}
        </div>
      </div>
    {:else if step === 3}
      <div class="prompt">
        <p class="question">Step 4 of 4: Is {n} closer to {start} or {end}? Which way does it round?</p>
        <div class="row">
          <button class="choice down" onclick={() => chooseRound(start)}>⬇️ Round down to {start}</button>
          <button class="choice up" onclick={() => chooseRound(end)}>⬆️ Round up to {end}</button>
        </div>
      </div>
    {:else}
      <div class="prompt">
        <button class="primary next" onclick={newProblem}>Next number ➡️</button>
      </div>
    {/if}

    {#if feedback}
      <p class="feedback" class:ok={feedback.ok} class:bad={!feedback.ok}>{feedback.msg}</p>
    {/if}
  </section>

  <footer>
    <p>Remember: find the <b>starting point</b>, the <b>end point</b>, and the <b>midpoint</b>. If the number is at the midpoint or past it, round <b>up</b>. If it's before the midpoint, round <b>down</b>.</p>
    <button class="ghost small" onclick={newProblem}>Skip this number</button>
  </footer>
</main>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }
  h1 { margin: 8px 0; font-size: 1.6rem; color: var(--blue); }
  .score { font-weight: 700; font-size: 1.1rem; }

  .settings {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 24px;
    background: white;
    padding: 12px 16px;
    border-radius: 16px;
    margin: 12px 0;
    font-weight: 600;
  }
  .group { display: flex; align-items: center; gap: 8px; }
  .group input { width: 100px; font-size: 1.1rem; padding: 6px; }
  .settings button {
    background: #e5edff;
    color: var(--blue);
    padding: 6px 14px;
    font-size: 1rem;
  }
  .settings button.active { background: var(--blue); color: white; }

  .problem {
    background: white;
    border-radius: 16px;
    padding: 16px 20px;
    text-align: center;
  }
  h2 { margin: 0 0 8px; font-size: 1.5rem; }
  .big { font-size: 2.2rem; color: var(--purple); }

  .prompt { margin-top: 12px; }
  .question { font-size: 1.25rem; font-weight: 600; margin: 8px 0 12px; }
  .row {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }
  .primary { background: var(--blue); color: white; }
  .ghost { background: transparent; border-color: #cbd5e1; color: #475569; }
  .ghost.small { font-size: 0.95rem; padding: 8px 14px; }
  .next { font-size: 1.3rem; }
  .choice { font-size: 1.25rem; padding: 16px 24px; color: white; }
  .choice.down { background: var(--orange); }
  .choice.up { background: var(--green); }

  .feedback {
    margin: 16px auto 0;
    max-width: 640px;
    font-size: 1.2rem;
    font-weight: 600;
    padding: 12px 16px;
    border-radius: 12px;
  }
  .feedback.ok { background: #dcfce7; color: #166534; }
  .feedback.bad { background: #fee2e2; color: #991b1b; }

  footer {
    margin-top: 16px;
    text-align: center;
    color: #475569;
    font-size: 1rem;
  }
</style>
