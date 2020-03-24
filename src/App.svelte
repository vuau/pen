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

<main class="w-100 pa4 pa0-l sans-serif bg-white">
  <section class="mw7 center">
    <Router {routes} />
  </section>
</main>
