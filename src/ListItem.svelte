<svelte:options immutable={true} />
<script>
  import { push } from 'svelte-spa-router'
  import { showActions, notes, movingNote } from './stores.js'
  import { whenEnter } from './utils.js'

  export let id = null
  export let title = ''
  export let type = null
  export let folderId = null

  $: isFolder = type === 'folder'

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

  function selectToMoveNote () {
    movingNote.set({
      noteId: id,
      fromFolder: folderId
    })
  }

  function moveNote() {
    if (type === 'folder') {
      notes.moveNote($movingNote.noteId, $movingNote.fromFolder, id)
      movingNote.set(null)
    }
  }
</script>

<li tabindex="0" on:click={isFolder ? viewFolder : viewNote} on:keyup={whenEnter(isFolder ? viewFolder : viewNote)} class="note-item pointer flex items-center justify-between lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30">
  <span class="dim flex items-center">
    {#if isFolder}
      <span class="icon-folder mr2 gray"></span>
    {:else}
      <span class="icon-file mr2 gray"></span>
    {/if}
    {title}
  </span>
  {#if $showActions}
    <div class="flex items-center">
      {#if !$movingNote}
        <span on:click|stopPropagation={selectToMoveNote} tabindex="0" class="dim ml1 tc w2 pointer icon-hand"></span>
        <span on:click|stopPropagation={confirmDelete} tabindex="0" class="dim ml1 tc w2 pointer icon-delete"></span>
      {:else if $movingNote.noteId !== id}
        {#if isFolder}
          <span on:click|stopPropagation={moveNote} tabindex="0" class="dim ml1 tc w2 pointer icon-vote"></span>
        {/if}
      {/if}
    </div>
  {/if}
</li>
