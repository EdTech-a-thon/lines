<script>
  let open = $state(false)

  function close() {
    open = false
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') close()
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="help-widget no-print">
  <button
    type="button"
    class="help-button"
    aria-expanded={open}
    aria-controls="help-dialog"
    onclick={() => (open = !open)}
  >
    <span class="help-mark" aria-hidden="true">?</span>
    Help
  </button>
</div>

{#if open}
  <button class="help-backdrop" type="button" aria-label="Close help" onclick={close}></button>
  <div id="help-dialog" class="help-dialog card" role="dialog" aria-modal="true" aria-labelledby="help-title">
    <div class="dialog-heading">
      <div>
        <p class="eyebrow">Need a hand?</p>
        <h2 id="help-title">How rounding practice works</h2>
      </div>
      <button type="button" class="close" aria-label="Close help" onclick={close}>×</button>
    </div>

    <div class="help-copy">
      <section>
        <h3>For teachers</h3>
        <p>Choose what to round to, the number range, and how many questions to include. Then copy or share the practice link (or its QR code) with students.</p>
      </section>
      <section>
        <h3>For students</h3>
        <p>In <b>Guided</b> mode, find the start, end, and halfway point before rounding. In <b>Quick</b> mode, choose which end of the number line is closer.</p>
      </section>
      <section>
        <h3>After the drill</h3>
        <p>The results page shows the score, time, and any missed steps. Turn on retries if students should get another try after a wrong answer.</p>
      </section>
    </div>

    <button type="button" class="btn-primary done" onclick={close}>Got it</button>
  </div>
{/if}

<style>
  .help-widget {
    position: fixed;
    z-index: 20;
    top: 1rem;
    right: 1rem;
  }
  .help-button {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.6rem 0.9rem;
    border: 1.5px solid var(--blue-border);
    border-radius: 999px;
    background: #fff;
    box-shadow: var(--shadow);
    color: var(--blue-dark);
    font: inherit;
    font-size: 0.9rem;
    font-weight: 800;
  }
  .help-button:hover { background: var(--blue-soft); border-color: var(--blue); }
  .help-mark {
    display: grid;
    width: 1.25rem;
    height: 1.25rem;
    place-items: center;
    border-radius: 50%;
    background: var(--blue);
    color: #fff;
    font-size: 0.8rem;
    line-height: 1;
  }

  .help-backdrop {
    position: fixed;
    z-index: 29;
    inset: 0;
    border: 0;
    background: rgba(31, 41, 55, 0.2);
    cursor: default;
  }
  .help-dialog {
    position: fixed;
    z-index: 30;
    top: 4.5rem;
    right: 1rem;
    width: min(25rem, calc(100vw - 2rem));
    padding: 1.25rem;
  }
  .dialog-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
  .eyebrow {
    margin: 0 0 0.2rem;
    color: var(--blue-dark);
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  h2 { font-size: 1.25rem; font-weight: 800; }
  .close {
    width: 2rem;
    height: 2rem;
    flex: none;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--muted);
    font-size: 1.7rem;
    line-height: 1;
  }
  .close:hover { background: var(--blue-soft); color: var(--blue-dark); }
  .help-copy { display: grid; gap: 0.85rem; margin: 1.1rem 0; }
  .help-copy section + section { padding-top: 0.85rem; border-top: 1px solid var(--border); }
  h3 { margin: 0 0 0.2rem; font-size: 0.95rem; font-weight: 800; }
  .help-copy p { margin: 0; color: var(--muted); font-size: 0.9rem; }
  .help-copy b { color: var(--ink); }
  .done { width: 100%; }

  @media (max-width: 30rem) {
    .help-widget { top: 0.75rem; right: 0.75rem; }
    .help-dialog { top: 4rem; right: 0.75rem; width: calc(100vw - 1.5rem); }
  }
</style>
