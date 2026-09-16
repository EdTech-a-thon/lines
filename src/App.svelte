<script>
  // Two pages: the teacher sets up an activity at /, students practise at
  // /practice?… with every setting carried in the link.
  import Setup from './lib/Setup.svelte'
  import Practice from './lib/Practice.svelte'
  import { settingsFromParams } from './lib/settings.js'

  const isPractice = window.location.pathname.replace(/\/$/, '') === '/practice'
  const settings = settingsFromParams(new URLSearchParams(window.location.search))
</script>

<div class="shell">
  <main>
    {#if isPractice}
      <Practice {settings} />
    {:else}
      <Setup />
    {/if}
  </main>
  <footer class="no-print">
    <a href="https://edtechathon.com" target="_blank" rel="noopener noreferrer">Built by the EdTech-a-thon</a>
    {#if isPractice}
      <a href="/">Make your own drill</a>
    {/if}
  </footer>
</div>

<style>
  .shell { display: flex; flex-direction: column; min-height: 100vh; }
  main { flex: 1; }
  footer {
    display: flex;
    justify-content: center;
    gap: 1.25rem;
    padding: 1.5rem 1.25rem 2rem;
    font-size: 0.9rem;
  }
  footer a { color: var(--muted); text-decoration: none; }
  footer a:hover { color: var(--blue-dark); }
</style>
