<script>
  import { notes, modal, getParentNode } from '../stores.js'
  import { gunUser } from '../contexts.js'
  import { decrypt } from '../stores.js'
  import { onMount } from 'svelte'

  const { id, path } = $modal.data
  const modes = ['private', 'public']
  let slug
  let selectedMode
  let title, content, type, headerTag
  const isProduction = process.env.NODE_ENV === 'production'

  onMount(() => {
    getParentNode(path)
      .get(id)
      .once(async v => {
        const data = await decrypt(v)
        selectedMode = data.mode || 'private'
        slug = data.slug
        title = data.title
        content = data.content
        type = data.type
        headerTag = data.headerTag
      })
  })

  function onSubmit () {
    notes.updateNote({ path, id, title, content, slug, mode: selectedMode, headerTag })
    $modal.onClose()
  }

  function onCopyURL () {
    let url

    if (isProduction) {
      url = `https://nicepage.now.sh/${slug}/${gunUser.is.pub}`
    } else {
      url = `http://${location.hostname}:3000/${slug}/${gunUser.is.pub}`
    }

    window.prompt('Copy to clipboard: Ctrl+C, Enter', url)
  }
</script>

<div class="modal black-80">
  <div class="mt3">
    <label for="Name" class="f6 b db mb2">Name</label>
    <input
      bind:value={title}
      type="text"
      id="title"
      class="input-reset ba b--black-20 pa2 mb2 db w-100"
      aria-describedby="title" />
  </div>
  <div class="mt3">
    <label class="f6 b db mb2">Visibility</label>
    {#each modes as value}
      <label class="mr2">
        <input bind:group={selectedMode} name="type" type="radio" {value} />
        <span class="ttu">{value}</span>
      </label>
    {/each}
  </div>
  {#if selectedMode === 'public'}
    <div class="mt3">
      <label for="slug" class="f6 b db mb2">Slug</label>
      <input
        bind:value={slug}
        type="text"
        id="slug"
        class="input-reset ba b--black-20 pa2 mb2 db w-100"
        aria-describedby="slug" />
      <span
        class="f6 link dim br3 ba ph3 pv2 mb2 dib black"
        on:click|preventDefault={onCopyURL}>
        Show URL
      </span>
    </div>
    {#if type === 'folder'}
      <div class="mt3">
        <label for="headerTag" class="f6 b db mb2">Header Tag</label>
        <textarea
          bind:value={headerTag}
          id="headerTag"
          class="input-reset ba b--black-20 pa2 mb2 db w-100"
          aria-describedby="headerTag" />
      </div>
    {/if}
  {/if}
  <div class="mt3">
    <a
      href="#0"
      on:click|preventDefault={onSubmit}
      class="f6 link dim br1 ph3 pv2 mb2 dib white bg-black">
      Save
    </a>
  </div>
</div>
