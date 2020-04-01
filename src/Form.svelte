<script>
  import { onDestroy } from 'svelte'
  import { push } from 'svelte-spa-router'
  import { updateNote, notes } from './stores.js'

  export let params = {}
  let title, content
  let id = params.id

  if (id) {
    const unsubscribe = notes.subscribe(noteItems => {
      let editingNote = noteItems.find(n => n.id === id)
      if (editingNote) {
        title = editingNote.title
        content = editingNote.content
      }
    });
    onDestroy(unsubscribe);
  }

  function debounce(func, waitTime) {
    var timeout
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(func, waitTime);
    }
  }

  let autosave = debounce(() => {
    console.log('saving...')
    updateNote({
      ...(id && { id }),
      title: title || 'No title',
      content,
    }).then(ack => {
      if (!id) {
        id = ack['_']['#']
      }
      console.log('...saved!')
    })
  }, 500)

  function goToList() {
    push('/')
  }
</script>

<section class="mw7 h-100 center flex flex-column">
  <form class="ph2 pb2 ph0-ns black-80 flex-auto flex flex-column">
    <input
      bind:value={title}
      on:keyup={autosave}
      id="title"
      placeholder="Title"
      class="input-reset outline-transparent h3 f4 br0 bt-0 bl-0 br-0 bb b--black-20 pv3 db w-100"
      type="text"
      aria-describedby="name-desc"
      autocomplete="new-password" />
    <textarea
      bind:value={content}
      on:keyup={autosave}
      id="content"
      placeholder="Content"
      name="content"
      style="resize: none"
      class="input-reset outline-transparent lh-copy pb3 flex-auto db border-box hover-black w-100 br0 bt-0 bl-0 br-0 bb-0 pv pt3 mb2"
      aria-describedby="comment-desc"
      autocomplete="new-password" />
    <div>
      <a
        on:click|preventDefault={goToList}
        class="f6 link dim br1 ph3 pv2 mb2 dib white bg-black"
        href="#0">
        Done
      </a>
    </div>
  </form>
</section>
