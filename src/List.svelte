<script>
  import { push } from 'svelte-spa-router';
  import { notes, deleteNote, bulkAction, user } from './stores.js';
  import ListItem from './ListItem.svelte';

  function openNewNote() {
    push('/notes/new');
  }

  async function deleteNotes() {
    let deletingNoteNames = $bulkAction.data.map(
      id => $notes.find(n => n.id === id)['title']
    ).join(',');
    if (confirm(`Are you sure to delete "${deletingNoteNames}"?`)) {
      await $bulkAction.data.forEach(deleteNote);
    }
    bulkAction.toggleSelect();
  }
</script>
<style>
  .sticky {
    position: sticky;
    position: -webkit-sticky;
    top: 0;
    background: white;
  }
</style>

<section class="mw7 h-100 center">
  <h2 class="h3 sticky athelas ma0 ph2 pv3 ph0-ns bb b--near-black flex items-center justify-between">
    <span>
      Notes
    </span>
    <div class="flex items-center">
      <span on:click="{openNewNote}" class="material-icons w2 pointer">
        create
      </span>
      <span on:click={bulkAction.toggleSelect} class="material-icons w2 pointer">
        check_box_outline_blank
      </span>
      <span on:click={user.logout} class="material-icons w2 pointer">
        exit_to_app
      </span>
      {#if $bulkAction.isSelecting && $bulkAction.data.length}
        <span class="w1 tc f5">|</span>
        <span on:click={deleteNotes} class="material-icons w2 pointer">
          delete_outline
        </span>
      {/if}
    </div>
  </h2>
  <ul class="list ph2 ph0-ns mt0 overflow-x-hidden">
    {#each $notes as {title, id}}
    <ListItem {title} {id}></ListItem>
    {/each}
  </ul>
</section>
