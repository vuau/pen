<script>
  import { tick, onMount } from 'svelte'
  import { push } from 'svelte-spa-router'
  import { showActions, showSearch, searchKeyword, displayedNotes, user } from './stores.js'
  import ListItem from './ListItem.svelte'
  import { debounce, whenEsc, whenEnter } from './utils.js'

  const isMac = typeof navigator !== 'undefined' ? /Mac/.test(navigator.platform) : false
  let searchInput

  function openNewNote () {
    push('/notes/new')
  }

  function toggleActions () {
    showActions.update(f => !f)
  }

  async function toggleSearch () {
    showSearch.update(f => !f)
    clearKeyword()
  }

  async function clearKeyword () {
    searchKeyword.set('')
    await tick()
    if (searchInput) {
      searchInput.focus()
    }
  }

  const pressedKeys = {}
  const handleShortcuts = async e => {
    pressedKeys[e.code] = e.type === 'keydown'
    if ((isMac && pressedKeys.ControlLeft && pressedKeys.KeyS) || (!isMac && pressedKeys.AltLeft && pressedKeys.KeyS)) {
      await toggleSearch()
    }
  }
</script>

<svelte:window on:keydown={handleShortcuts} on:keyup={handleShortcuts} />

<section class="mw7 center">
  <h2 class="h3 {$showSearch ? '' : 'sticky'} athelas ma0 ph2 pv3 ph0-ns bb b--near-black flex items-center justify-between">
    <span>
      Pen
    </span>
    <div class="flex items-center">
      <span tabindex="0" on:click={openNewNote} on:keyup={whenEnter(openNewNote)} class="icon-create w2 tc pointer"></span>
      {#if $displayedNotes.length > 0}
        <span tabindex="0" on:click={toggleSearch} on:keyup={whenEnter(toggleSearch)} class="icon-search w2 tc pointer {$showSearch ? 'blue' : ''}"></span>
        <span tabindex="0" on:click={toggleActions} on:keyup={whenEnter(toggleActions)} class="icon-config w2 tc pointer {$showActions ? 'blue' : ''}"></span>
      {/if}
      <span class="dib br b--black h1 ml2 mr2"></span>
      <span tabindex="0" on:click={user.logout}  on:keyup={whenEnter(user.logout)} class="icon-power w2 tc pointer"></span>
    </div>
  </h2>
  {#if $showSearch}
    <div class="bb b--black-20 sticky flex items-center justify-between">
      <input
        bind:this={searchInput}
        bind:value={$searchKeyword}
        on:keyup={whenEsc(toggleSearch)}
        tabindex="0" 
        placeholder="Type to search..."
        class="input-reset outline-transparent br0 bn pa2 w-100"
        type="text"
        aria-describedby="name-desc"
        autocomplete="off" />
      <span
        on:click={clearKeyword}
        tabindex="0" 
        class="icon-x w2 tc pointer">
      </span>
    </div>
  {/if}
  {#if $displayedNotes.length > 0}
    <ul class="list ph2 ph0-ns mt0 overflow-x-hidden">
      {#each $displayedNotes as {title, id}}
        <ListItem {title} {id}></ListItem>
      {/each}
    </ul>
  {:else}
    <small class="f6 black-60 db ph2 ph0-ns pt4">
      There is no notes. <a href="/#/notes/new" class="blue link">Create one?</a>
    </small>
  {/if}
</section>
