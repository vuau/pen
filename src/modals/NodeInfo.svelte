<script>
  import { notes, modal, getParentNode } from '../stores.js'
  import { gunUser } from '../contexts.js'
  import { decrypt } from '../stores.js'
  import { onMount } from 'svelte'
  import slugify from 'slugify'
  import Clipboard from 'clipboard'

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
        slug = data.slug || slugify(data.title).toLowerCase()
        title = data.title
        content = data.content
        type = data.type
        headerTag = data.headerTag
      })
    const clipboard = new Clipboard('#URL') //eslint-disable-line
    clipboard.on('success', function () {
      alert('URL copied!')
    })
  })

  function onSubmit () {
    notes.updateNote({
      path,
      id,
      title,
      content,
      slug,
      mode: selectedMode,
      headerTag
    })
    $modal.onClose()
  }

  function getURL () {
    if (isProduction) {
      return `https://denote.link/${slug}/${gunUser.is.pub}`
    }
    return `http://${location.hostname}:5001/${slug}/${gunUser.is.pub}`
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
    <span class="f6 b db mb2">Visibility</span>
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
      <div class="flex">
        <input
          bind:value={slug}
          type="text"
          id="slug"
          class="input-reset ba b--black-20 pa2 db w-100"
          aria-describedby="slug" />
        <span
          id="URL"
          data-clipboard-text={getURL()}
          class="f6 link dim ba b--black-20 bl-0 ph2 pv2 w4 dib black pointer lh-title tc">
          Copy URL
        </span>
      </div>
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
