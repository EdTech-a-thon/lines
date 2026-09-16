<script>
  // Pages by address: the teacher sets up an activity at /, students practise
  // at /practice?… with every setting carried in the link, plus about/privacy.
  import Setup from './lib/Setup.svelte'
  import Practice from './lib/Practice.svelte'
  import About from './lib/About.svelte'
  import Privacy from './lib/Privacy.svelte'
  import Footer from './lib/Footer.svelte'
  import { settingsFromParams } from './lib/settings.js'

  const path = window.location.pathname.replace(/\/$/, '') || '/'
  const settings = settingsFromParams(new URLSearchParams(window.location.search))
</script>

<div class="shell">
  <main>
    {#if path === '/practice'}
      <Practice {settings} />
    {:else if path === '/about'}
      <About />
    {:else if path === '/privacy'}
      <Privacy />
    {:else}
      <Setup />
    {/if}
  </main>
  <Footer />
</div>

<style>
  .shell { display: flex; flex-direction: column; min-height: 100vh; }
  main { flex: 1; }
</style>
