<script>
  import { onMount, onDestroy } from 'svelte'
  import { pop } from 'svelte-spa-router'
  import SimpleMirror from 'simplemirror'

  import { gunUser } from './contexts.js'
  import { notes, getParentNode, decrypt } from './stores.js'
  import config from './editorCommands.js'
  import { debounce, whenEsc } from './utils.js'

  export let params = {}

  let title, content
  let id = params.id
  let path = params.path
  let editor
  let unsubscribe
  let showFormatTool = false
  let titleInput

  onMount(() => {
    if (id) {
      getParentNode(path).get(id).once(async (data, id) => {
        const editingNote = await decrypt(data)
        if (editingNote) {
          title = editingNote.title
          content = editingNote.content
          createEditor(content)
        }
      })
    } else {
      createEditor()
      if (titleInput) {
        titleInput.focus()
      }
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
      content: content || ''
    }).then(createdId => {
      if (!id) {
        id = createdId
      }
    })
  }, 500)

  function goToList () {
    /* push('/') */
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
      <input
        bind:this={titleInput}
        bind:value={title}
        on:keyup={autosave}
        id="title"
        placeholder="Title"
        class="input-reset outline-transparent h3 f4 br0 bn pv3 ph2 mr2 db w-100"
        type="text"
        aria-describedby="name-desc"
        autocomplete="off" />

      <div class="flex items-center f4">
        <span on:click={toggleFormatTool} class="icon-format w2 pv2 tc pointer no-select fix-icon {showFormatTool ? 'blue' : ''}"></span>
        <span on:click={goToList} class="icon-x w2 pv2 tc pointer no-select"></span>
      </div>
    </div>
  </div>
  <div
    id="content"
    class="flex flex-column outline-transparent lh-copy {showFormatTool ? 'showMenu' : ''}"
    />
</section>
