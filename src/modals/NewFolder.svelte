<script>
  import { notes, modal } from '../stores.js'
  import { onMount } from 'svelte'
  import { SEA } from '../contexts.js'
  import { whenEnter } from '../utils.js'

  let folderName = ''
  let inputEl

  onMount(() => {
    if (inputEl) {
      inputEl.focus()
    }
  })

  async function onSubmit () {
    await notes.createFolder(folderName, $modal.path)
    $modal.onClose()
  }
</script>

<div class="black-80">
  <div class="measure">
    <label for="folder-name" class="f6 b db mb2">Folder name</label>
    <input
      bind:this={inputEl}
      bind:value={folderName}
      on:keyup={whenEnter(onSubmit)}
      type="text"
      id="folder-name"
      class="input-reset ba b--black-20 pa2 mb2 db w-100"
      aria-describedby="folder-name">
  </div>
  <div class="mt3">
    <a
      href="#0"
      on:click|preventDefault={onSubmit}
      class="f6 link dim br1 ph3 pv2 mb2 dib white bg-black">
      Save
    </a>
  </div>
</div>
