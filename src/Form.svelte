<script>
  import { onMount, onDestroy } from 'svelte'
  import { push } from 'svelte-spa-router'
  import SimpleMirror from 'simplemirror'

  import { updateNote, notes } from './stores.js'
  import commands from './editorCommands.js'

  export let params = {}

  let title, content
  let id = params.id
  let editor
  let unsubscribe
  let showFormatTool = false

  onMount(() => {
    if (id) {
      unsubscribe = notes.subscribe((noteItems) => {
        const editingNote = noteItems.find((n) => n.id === id)
        if (editingNote) {
          title = editingNote.title
          content = editingNote.content
          createEditor(content)
        }
      })
    } else {
      createEditor()
    }
  })

  onDestroy(() => {
    if (editor) editor.remove()
    if (unsubscribe) unsubscribe()
  })

  function createEditor (value) {
    if (editor) return
    editor = new SimpleMirror({
      selector: '#content',
      value: value || '',
      onChange: value => {
        content = value
        autosave()
      },
      commands
    })
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

  function toggleFormatTool () {
    showFormatTool = !showFormatTool
  }
</script>

<section class="mw7 center">
  <div class="ph2 pb2 ph0-ns black-80">
    <div
      class="flex items-center justify-between bt-0 bl-0 br-0 bb
      b--black-20 {showFormatTool ? '' : 'sticky'}">
      <input
        bind:value={title}
        on:keyup={autosave}
        id="title"
        placeholder="Title"
        class="input-reset outline-transparent h3 f4 br0 bn pv3 mr2 db w-100"
        type="text"
        aria-describedby="name-desc"
        autocomplete="off" />

      <div class="flex items-center f4">
        <span on:click={toggleFormatTool} class="icon-format w2 pv2 tc pointer no-select fix-icon {showFormatTool ? 'blue' : ''}"></span>
        <span on:click={goToList} class="icon-x w2 pv2 tc pointer no-select"></span>
      </div>
    </div>
    <div
      id="content"
      class="flex flex-column outline-transparent lh-copy {showFormatTool ? 'showMenu' : ''}"
      />
  </div>
</section>
