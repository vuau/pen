<script>
  import autosize from 'autosize'
  import { onMount, onDestroy, tick } from 'svelte'
  import { push } from 'svelte-spa-router'
  import { updateNote, notes } from './stores.js'

  export let params = {}

  let title, content
  let id = params.id
  const textareaEl = document.querySelector('textarea')

  onMount(() => autosize(textareaEl))

  if (id) {
    const unsubscribe = notes.subscribe((noteItems) => {
      const editingNote = noteItems.find((n) => n.id === id)
      const update = async (note) => {
        title = note.title
        content = note.content
        await tick()
        autosize(document.querySelector('textarea'))
      }
      if (editingNote) {
        update(editingNote)
      }
    })
    onDestroy(unsubscribe)
  }

  function debounce (func, waitTime) {
    var timeout
    return function () {
      clearTimeout(timeout)
      timeout = setTimeout(func, waitTime)
    }
  }

  const autosave = debounce(() => {
    console.log('saving...')
    updateNote({
      ...(id && { id }),
      title: title || 'No title',
      content: content || ''
    }).then((ack) => {
      if (!id) {
        id = ack._['#']
      }
      console.log('...saved!')
    })
  }, 500)

  function goToList () {
    push('/')
  }
</script>

<section class="mw7 center">
  <div class="ph2 pb2 ph0-ns black-80">
    <div
      class="sticky flex items-center justify-between bt-0 bl-0 br-0 bb
      b--black-20 ">
      <input
        bind:value={title}
        on:keyup={autosave}
        id="title"
        placeholder="Title"
        class="input-reset outline-transparent h3 f4 br0 bn pv3 db w-100"
        type="text"
        aria-describedby="name-desc" />
      <span on:click={goToList} class="material-icons w2 pointer">clear</span>
    </div>
    <textarea
      bind:value={content}
      on:keyup={autosave}
      id="content"
      placeholder="Content"
      name="content"
      style="resize: none"
      class="input-reset outline-transparent lh-copy pb3 db border-box
      hover-black w-100 br0 bt-0 bl-0 br-0 bb-0 pv pt3 mb2"
      aria-describedby="comment-desc" />
  </div>
</section>
