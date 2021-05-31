<script>
  import { onMount, onDestroy } from 'svelte'
  import { pop } from 'svelte-spa-router'
  import { v4 as uuidv4 } from 'uuid'
  import SimpleMirror from 'simplemirror'

  import NodeInfo from './modals/NodeInfo.svelte'
  import { notes, modal, getParentNode, decrypt, isFromNote } from './stores.js'
  import config from './editorCommands.js'
  import { debounce, whenEsc } from './utils.js'

  export let params = {}

  let title, content, mode
  let editor
  let unsubscribe
  let showFormatTool = false
  let titleInput
  let editingNote

  const id = params.id || uuidv4()
  const path = params.path
  const createdTime = !params.id ? new Date().getTime() : null

  onMount(async () => {
    isFromNote.set(true)
    if ($notes[id]) {
      const data = $notes[id]
      editingNote = data.mode === 'public' ? data : await decrypt(data)
      title = editingNote.title
      content = editingNote.content
      mode = editingNote.mode
      createEditor(content)
      if (!title) {
        titleInput.focus()
      }
    } else {
      getParentNode(path)
        .get(id)
        .once(async (data) => {
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
      onChange: (value) => {
        content = value
        /* autosave() */
      },
      config
    })
  }

  const save = () => {
    if (!content && !title) return
    notes.updateNote({
      id,
      path,
      title,
      content,
      mode,
      ...(createdTime && { createdTime })
    })
    goToList()
  }

  const autosave = debounce(() => {
    save()
  }, 500)

  function goToList () {
    pop()
  }

  function checkToSave (cb) {
    return () => {
      if (editingNote?.content !== content && confirm(`Save your changes?`)) {
        save()
      }
      cb()
    }
  }

  function toggleFormatTool () {
    showFormatTool = !showFormatTool
  }

  async function confirmDelete () {
    if (confirm(`Are you sure to delete "${title}"?`)) {
      await notes.deleteNote(id, path)
      goToList()
    }
  }

  async function openInfo () {
    modal.set({
      title: 'Settings',
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
</script>

<svelte:window on:keyup={whenEsc(checkToSave(goToList))} />

<section class="h-100 flex flex-column center black-80 nobounce">
  <div class="mh5-ns">
    <div
      class="flex items-center justify-between bt-0 bl-0 br-0 bb
      b--black-20">
      <span
        on:click={checkToSave(goToList)}
        class="icon-back w2 pl3 pr2 pv2 tc pointer no-select" />
      <input
        bind:this={titleInput}
        bind:value={title}
        id="title"
        placeholder="Title"
        class="input-reset outline-transparent h3 f4 br0 bn pv3 mr2 db w-100"
        type="text"
        aria-describedby="name-desc"
        autocomplete="off" />

      <div class="flex items-center f4">
        <span
          on:click={toggleFormatTool}
          class="icon-format pa2 tc pointer no-select fix-icon {showFormatTool ? 'blue' : ''}" />
        <span
          on:click|stopPropagation={confirmDelete}
          tabindex="0"
          class="dim ml1 tc pa2 pointer icon-delete" />
        <span
          on:click|stopPropagation={openInfo}
          tabindex="0"
          class="dim ml1 tc pa2 pointer icon-info" />
        <span
          on:click|stopPropagation={save}
          class="f6 link dim br1 ph3 pv2 ml2 pointer dib white bg-near-black"
          tabindex="0">SAVE</span>
      </div>
    </div>
  </div>
  <div
    id="content"
    class="flex flex-column flex-auto outline-transparent lh-copy {showFormatTool ? 'showMenu' : ''}" />
</section>
