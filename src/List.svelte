<script>
  import { push } from 'svelte-spa-router';
  import { notes } from './stores.js';
  import ListItem from './ListItem.svelte';

  function openNewNote() {
    push('/notes/new');
  }
</script>

<section class="mw7 h-100 center">
  <h2 class="athelas flex items-center justify-between">
    <span>
      Notes
    </span>
    <span on:click="{openNewNote}" class="material-icons w2 pointer">
      note_add
    </span>
  </h2>
  <ul class="list pl0 mt0 overflow-x-hidden">
    {#each $notes as {title, id}}
    <ListItem {title} {id}></ListItem>
    {/each}
  </ul>
</section>
