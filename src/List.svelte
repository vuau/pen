<script>
  import { push } from 'svelte-spa-router';
  import { notes } from './stores.js';
  import ListItem from './ListItem.svelte';

  function openNewNote() {
    push('/notes/new');
  }
</script>
<style>
  .sticky {
    position: sticky;
    top: 0;
    background: white;
  }
</style>

<section class="mw7 h-100 center">
  <h2 class="h3 sticky athelas ma0 ph2 pv3 ph0-ns bb b--near-black flex items-center justify-between">
    <span>
      Notes
    </span>
    <span on:click="{openNewNote}" class="material-icons w2 pointer">
      note_add
    </span>
  </h2>
  <ul class="list ph2 ph0-ns mt0 overflow-x-hidden">
    {#each $notes as {title, id}}
    <ListItem {title} {id}></ListItem>
    {/each}
  </ul>
</section>
