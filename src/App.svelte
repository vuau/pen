<script>
  import Router from 'svelte-spa-router'
  import List from './List.svelte'
  import Form from './Form.svelte'
  import Login from './Login.svelte'
  import { user } from './stores.js'

  const routes = {
    '/': List,
    '/notes/new': Form,
    '/notes/:id': Form
  }
</script>

<main class="w-100 h-100 sans-serif bg-white">
  {#if $user.isLoggedIn}
    <Router {routes} />
  {:else}
    <Login />
  {/if}
</main>
