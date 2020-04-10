<svelte:options immutable={true} />
<script>
  import { push } from 'svelte-spa-router'
  import { showActions, deleteNote } from './stores.js'

  export let id = null
  export let title = ''

  const viewNote = () => {
    push(`/notes/${id}`)
  }

  async function confirmDelete () {
    if (confirm(`Are you sure to delete "${title}"?`)) {
      await deleteNote(id)
    }
  }
</script>

<li on:click={viewNote} class="hover-to-show pointer dim flex items-center justify-between lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30">
  <span>{title}</span>
  {#if $showActions}
  <span on:click|stopPropagation={confirmDelete} class="ml2 tc w2 pointer icon-delete"></span>
  {/if}
</li>
