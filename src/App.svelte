<script>
  import Router from 'svelte-spa-router';
  import List from './List.svelte';
  import Form from './Form.svelte';

  const routes = {
    '/': List,
    '/notes/new': Form,
    '/notes/:id': Form
  };
</script>

<main class="w-100 h-100 pa4 sans-serif bg-white">
  <Router {routes} />
</main>
