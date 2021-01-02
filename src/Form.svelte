<script>
  import { onMount, onDestroy } from 'svelte'
  import { pop } from 'svelte-spa-router'
  import { v4 as uuidv4 } from 'uuid'
  import SimpleMirror from 'simplemirror'

  import { notes, getParentNode, decrypt, isFromNote } from './stores.js'
  import config from './editorCommands.js'
  import { debounce, whenEsc } from './utils.js'

  export let params = {}

  let title, content, mode
  const id = params.id || uuidv4()
  const path = params.path
  let editor
  let unsubscribe
  let showFormatTool = false
  let titleInput

  onMount(async () => {
    isFromNote.set(true)
    if ($notes[id]) {
      const data = $notes[id]
      const editingNote = data.mode === 'public' ? data : await decrypt(data)
      title = editingNote.title
      content = editingNote.content
      mode = editingNote.mode
      createEditor(content)
    } else {
      getParentNode(path)
        .get(id)
        .once(async data => {
          let editingNote
          if (data) {
            editingNote = data.mode === 'public' ? data : await decrypt(data)
            title = editingNote.title
            content = editingNote.content
            mode = editingNote.mode
          }
          createEditor(content)
          if (!title) {
            titleInput.focus()
          }
        })
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
      config
    })
  }

  const autosave = debounce(() => {
    if (!content && !title) return
    notes.updateNote({
      id,
      path,
      title,
      content,
      mode
    })
  }, 500)

  function goToList () {
    pop()
  }

  function toggleFormatTool () {
    showFormatTool = !showFormatTool
  }
</script>

<svelte:window on:keyup={whenEsc(goToList)} />

<section class="h-100 flex flex-column center black-80 nobounce">
  <div class="mh5-ns">
    <div
      class="flex items-center justify-between bt-0 bl-0 br-0 bb
      b--black-20">
      <span
        on:click={goToList}
        class="icon-back w2 pl3 pr2 pv2 tc pointer no-select" />
      <input
        bind:this={titleInput}
        bind:value={title}
        on:keyup={autosave}
        id="title"
        placeholder="Title"
        class="input-reset outline-transparent h3 f4 br0 bn pv3 mr2 db w-100"
        type="text"
        aria-describedby="name-desc"
        autocomplete="off" />

      <div class="flex items-center f4">
        <span
          on:click={toggleFormatTool}
          class="icon-format w2 ph3 pv2 tc pointer no-select fix-icon {showFormatTool ? 'blue' : ''}" />
      </div>
    </div>
  </div>
  <div
    id="content"
    class="flex flex-column flex-auto outline-transparent lh-copy {showFormatTool ? 'showMenu' : ''}" />
</section>
