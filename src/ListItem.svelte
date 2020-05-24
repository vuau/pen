<svelte:options immutable={true} />
<script>
  import { push } from 'svelte-spa-router'
  import { showActions, notes } from './stores.js'
  import { whenEnter } from './utils.js'

  export let id = null
  export let title = ''
  export let type = null

  const viewNote = () => {
    push(`/notes/${id}`)
  }

  const viewFolder = () => {
    push(`/notes/folder/${id}`)
  }

  async function confirmDelete () {
    if (confirm(`Are you sure to delete "${title}"?`)) {
      await notes.deleteNote(id)
    }
  }

  async function confirmPublish () {
    if (confirm(`Are you sure to publish "${title}"?`)) {
      alert('Oops! Not implemented yet.');
    }
  }
</script>

{#if type === 'folder'}
  <li tabindex="0" on:click={viewFolder} on:keyup={whenEnter(viewFolder)} class="note-item pointer flex items-center justify-between lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30">
    <span class="dim flex items-center">
      <span class="icon-folder mr2"></span>
      {title}
    </span>
  </li>
{:else}
  <li tabindex="0" on:click={viewNote} on:keyup={whenEnter(viewNote)} class="note-item pointer flex items-center justify-between lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30">
    <span class="dim flex items-center">
      <span class="icon-file mr2"></span>
      {title}
    </span>
    {#if $showActions}
      <div class="flex items-center">
        <span on:click|stopPropagation={confirmPublish} tabindex="0" class="dim ml2 tc w2 pointer icon-public"></span>
        <span on:click|stopPropagation={confirmDelete} tabindex="0" class="dim ml2 tc w2 pointer icon-delete"></span>
      </div>
    {/if}
  </li>
{/if}
