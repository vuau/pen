<script>
  import { fade } from 'svelte/transition'
  import { push } from 'svelte-spa-router'
  import { showActions, notes, movingNote, modal } from './stores.js'
  import { whenEnter } from './utils.js'
  import NodeInfo from './modals/NodeInfo.svelte'

  export let id = null
  export let title = ''
  export let type = null
  export let path = ''
  export let mode

  $: isFolder = type === 'folder'

  const viewNote = () => {
    push(`/notes/${id}/${path || ''}`)
  }

  const viewFolder = () => {
    const newPath = [...path.split('_').filter(p => p !== ''), id]
    push(`/notes/folder/${newPath.join('_')}`)
  }

  async function confirmDelete () {
    if (confirm(`Are you sure to delete "${title}"?`)) {
      await notes.deleteNote(id, path)
    }
  }

  async function openInfo () {
    modal.set({
      title: `Settings of "${title}"`,
      data: {
        id,
        path,
        mode
      },
      content: NodeInfo,
      onClose: () => {
        modal.set(null)
      }
    })
  }

  function selectToMoveNote () {
    movingNote.set({
      noteId: id,
      fromPath: path
    })
  }

  function moveNote () {
    if (type === 'folder') {
      const toPath = [...path.split('_').filter(p => p !== ''), id].join('_')
      notes.moveNote($movingNote.noteId, $movingNote.fromPath, toPath)
    }
  }
</script>

<svelte:options immutable={true} />
<li
  transition:fade|local
  tabindex="0"
  on:click={isFolder ? viewFolder : viewNote}
  on:keyup={whenEnter(isFolder ? viewFolder : viewNote)}
  class="note-item mh5-ns pointer flex items-center justify-between lh-copy pv3
  ba bl-0 bt-0 br-0 b--dotted b--black-30">
  <span class="dim flex items-center">
    {#if isFolder}
      <span class="icon-folder mr2 gray" />
    {:else}
      <span class="icon-file mr2 gray" />
    {/if}
    {#if mode === 'public'}
      <span class="icon-public mr2 green" />
    {/if}
    {title}
  </span>
  {#if $showActions}
    <div class="flex items-center">
      {#if !$movingNote}
        <span
          on:click|stopPropagation={selectToMoveNote}
          tabindex="0"
          class="dim ml1 tc w2 pointer icon-hand" />
        <span
          on:click|stopPropagation={confirmDelete}
          tabindex="0"
          class="dim ml1 tc w2 pointer icon-delete" />
        <span
          on:click|stopPropagation={openInfo}
          tabindex="0"
          class="dim ml1 tc w2 pointer icon-info" />
      {:else if $movingNote.noteId !== id}
        {#if isFolder}
          <span
            on:click|stopPropagation={moveNote}
            tabindex="0"
            class="dim ml1 tc w2 pointer icon-vote" />
        {/if}
      {/if}
    </div>
  {/if}
</li>
