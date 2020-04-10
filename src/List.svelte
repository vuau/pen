<script>
  import { tick } from 'svelte'
  import { push } from 'svelte-spa-router'
  import { showActions, showSearch, notes, user } from './stores.js'
  import ListItem from './ListItem.svelte'
  import { debounce } from './utils.js'

  let searchKeyword
  let searchInput
  let displayedNotes = $notes

  function openNewNote () {
    push('/notes/new')
  }

  function toggleActions () {
    showActions.update(f => !f)
  }

  async function toggleSearch () {
    showSearch.update(f => !f)
    searchKeyword = ''
    await tick()
    searchInput.focus()
  }

  async function clearKeyword () {
    searchKeyword = ''
    displayedNotes = $notes
    await tick()
    searchInput.focus()
  }

  const search = debounce(() => {
    if (searchKeyword) {
      displayedNotes = $notes.filter(({ title, content }) =>
        title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        content.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    }
  }, 300)
</script>

<section class="mw7 center">
  <h2 class="h3 {$showSearch ? '' : 'sticky'} athelas ma0 ph2 pv3 ph0-ns bb b--near-black flex items-center justify-between">
    <span>
      Pen
    </span>
    <div class="flex items-center">
      <span on:click={openNewNote} class="icon-create w2 tc pointer"></span>
      {#if $notes.length > 0}
        <span on:click={toggleSearch} class="icon-search w2 tc pointer {$showSearch ? 'blue' : ''}"></span>
        <span on:click={toggleActions} class="icon-config w2 tc pointer {$showActions ? 'blue' : ''}"></span>
      {/if}
      <span class="dib br b--black h1 ml2 mr2"></span>
      <span on:click={user.logout} class="icon-power w2 tc pointer"></span>
    </div>
  </h2>
  {#if $showSearch}
    <div class="bb b--black-20 sticky flex items-center justify-between">
      <input
        bind:this={searchInput}
        bind:value={searchKeyword}
        on:keyup={search}
        placeholder="Type to search..."
        class="input-reset outline-transparent br0 bn pa2 w-100"
        type="text"
        aria-describedby="name-desc"
        autocomplete="off" />
      <span
        on:click={clearKeyword}
        class="icon-x w2 tc pointer">
      </span>
    </div>
  {/if}
  {#if $notes.length > 0}
    <ul class="list ph2 ph0-ns mt0 overflow-x-hidden">
      {#each displayedNotes as {title, id}}
        <ListItem {title} {id}></ListItem>
      {/each}
    </ul>
  {:else}
    <small class="f6 black-60 db ph2 ph0-ns pt4">
      There is no notes. <a href="/#/notes/new" class="blue link">Create one?</a>
    </small>
  {/if}
</section>
