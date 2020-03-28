<script>
  import { push } from 'svelte-spa-router'
  import { updateNote, notes } from './stores.js'
  import { createKey } from './contexts.js'

  export let params = {}
  let title, content
  let isEdit = params.id

  if (isEdit) {
    let editingNote = $notes.find(n => n.id === params.id)
    if (editingNote) {
      title = editingNote.title
      content = editingNote.content
    }
  }

  function onSave() {
    updateNote({
      ...(params.id && { id: params.id }),
      title,
      content,
    }).then(goToList)
  }

  function goToList() {
    push('/')
  }
</script>

<section class="mw7 h-100 center flex flex-column">
  <h2 class="athelas flex items-center justify-between">
    <span>
      {#if isEdit}Edit note{:else}New note{/if}
    </span>
  </h2>
  <form class="black-80 flex-auto flex flex-column">
    <div class="pb3">
      <label for="name" class="f6 b db mb2">Title</label>
      <input
        bind:value={title}
        id="name"
        class="input-reset ba b--black-20 pa2 mb2 db w-100"
        type="text"
        aria-describedby="name-desc" />
    </div>
    <div class="pb3 flex-auto flex flex-column">
      <label for="comment" class="f6 b db mb2">Content</label>
      <textarea
        bind:value={content}
        id="comment"
        name="comment"
        class="flex-auto db border-box hover-black w-100 ba b--black-20 pa2 mb2"
        aria-describedby="comment-desc" />
    </div>
    <div>
      <a
        on:click|preventDefault={onSave}
        class="f6 link dim br1 ph3 pv2 mb2 dib white bg-black"
        href="#0">
        Save
      </a>
      <a
        on:click|preventDefault={goToList}
        class="f6 link dim br1 ph3 pv2 mb2 dib black"
        href="#0">
        Cancel
      </a>
    </div>
  </form>
</section>
