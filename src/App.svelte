<script>
  import { onMount } from 'svelte';
  import Router, { wrap, replace } from 'svelte-spa-router';
  import List from './List.svelte';
  import Form from './Form.svelte';
  import Login from './Login.svelte';
  import { user } from './stores.js';

  let checkLogin = user.checkLogin();

  function checkAuth() {
    return $user.isLoggedIn;
  }

  const routes = {
    '/': wrap(List, checkAuth),
    '/notes/new': wrap(Form, checkAuth),
    '/notes/:id': wrap(Form, checkAuth),
    '/login': Login
  };
</script>

{#await checkLogin} ... {:then}
  <main class="w-100 h-100 pa4 sans-serif bg-white">
    <Router {routes} on:conditionsFailed={() => replace('/login')} />
  </main>
{/await}
