<script>
  import {tick, onMount} from 'svelte'
  import {push, pop} from 'svelte-spa-router'
  import {
    modal, showActions, showSearch, searchKeyword, displayedNotes, user, notes, movingNote, getParentNode,
    decrypt, searchResults
  } from './stores.js'
  import ListItem from './ListItem.svelte'
  import {debounce, whenEsc, whenEnter} from './utils.js'
  import ConfigUserModal from './modals/ConfigUser.svelte'
  import NewFolderModal from './modals/NewFolder.svelte'

  export let params = {}

  const isMac = typeof navigator !== 'undefined' ? /Mac/.test(navigator.platform) : false

  let searchInput
  let path
  let unsubscribe
  let createLink

  $: {
    notes.stop(path)
    path = params.path
    createLink = `/notes/new${path ? `/${path}` : ''}`
    notes.start(path)
  }

  function goToRoot() {
    push('/')
  }

  function goUpOneLevel() {
    pop()
  }

  function openNewNote() {
    push(createLink)
  }

  function openNewFolder() {
    modal.set({
      title: 'Create folder',
      path: path,
      content: NewFolderModal,
      onClose: () => {
        modal.set(null)
      }
    })
  }

  function toggleActions() {
    showActions.update(f => !f)
    movingNote.set(null)
  }

  function configUser() {
    modal.set({
      title: 'Account',
      content: ConfigUserModal,
      onClose: () => {
        modal.set(null)
      }
    })
  }

  async function toggleSearch() {
    showSearch.update(f => !f)
    searchResults.set([])
    clearKeyword()
  }

  function doSearch(text, path) {
    const node = getParentNode(path)
    node.map().once(async (data, id) => {
      if (!data) return
      const decryptedData = await decrypt(data)
      if (decryptedData.type === 'folder') {
        let newPath = [...(path || '').split('_').filter(p => p !== ''), id].join('_')
        doSearch(text, newPath)
      } else {
        if ((decryptedData.title && decryptedData.title.includes(text)) || (decryptedData.content && decryptedData.content.includes(text))) {
          console.log('found', path, decryptedData)
          searchResults.update(arr => ([
            ...arr,
            {id, ...decryptedData, path}
          ]))
        }
      }
    })
  }

  function search() {
    searchResults.set([])
    doSearch($searchKeyword)
  }

  async function clearKeyword() {
    searchKeyword.set('')
    await tick()
    if (searchInput) {
      searchInput.focus()
    }
  }

  const pressedKeys = {}
  const handleShortcuts = async e => {
    pressedKeys[e.code] = e.type === 'keydown'

    // Open search box when pressing: Ctrl-S on Mac or Alt-S on Win
    if ((isMac && pressedKeys.ControlLeft && pressedKeys.KeyS) || (!isMac && pressedKeys.AltLeft && pressedKeys.KeyS)) {
      await toggleSearch()
    }
  }
</script>

<svelte:window on:keydown={handleShortcuts} on:keyup={handleShortcuts} />

<section class="mw7 center">
  <h2 class="h3 {$showSearch ? '' : 'sticky'} athelas ma0 ph2 pv3 ph0-ns bb b--near-black flex items-center justify-between">
    <span on:click={goToRoot} class="pointer">
      Pen
    </span>
    <div class="flex items-center">
      <span tabindex="0" on:click={openNewNote} on:keyup={whenEnter(openNewNote)} class="dim icon-create w2 tc pointer"></span>
      <span tabindex="0" on:click={openNewFolder} on:keyup={whenEnter(openNewFolder)} class="dim icon-create_folder w2 tc pointer"></span>
      {#if $displayedNotes.length > 0}
        <span tabindex="0" on:click={toggleSearch} on:keyup={whenEnter(toggleSearch)} class="dim icon-search w2 tc pointer {$showSearch ? 'blue' : ''}"></span>
        <span tabindex="0" on:click={toggleActions} on:keyup={whenEnter(toggleActions)} class="dim icon-config w2 tc pointer {$showActions ? 'blue' : ''}"></span>
      {/if}
      <span class="dib br b--black h1 ml2 mr2"></span>
      <span tabindex="0" on:click={configUser}  on:keyup={whenEnter(configUser)} class="dim icon-user w2 tc pointer"></span>
      <span tabindex="0" on:click={user.logout}  on:keyup={whenEnter(user.logout)} class="dim icon-power w2 tc pointer"></span>
    </div>
  </h2>
  {#if $showSearch}
    <div class="bg-light-gray bb b--black-20 sticky flex items-center justify-between">
      <input
        bind:this={searchInput}
        bind:value={$searchKeyword}
        on:keyup={whenEnter(search)}
        on:keyup={whenEsc(toggleSearch)}
        tabindex="0" 
        placeholder="Type to search..."
        class="input-reset bg-transparent outline-transparent br0 bn ph2 pv3 w-100"
        type="text"
        aria-describedby="name-desc"
        autocomplete="off" />
      <span
        on:click={search}
        tabindex="0" 
        class="icon-search w2 tc pointer">
      </span>
      <span
        on:click={toggleSearch}
        tabindex="0" 
        class="icon-x w2 tc pointer">
      </span>
    </div>
  {/if}
  {#if $searchResults.length > 0 }
    <ul class="list ph2 ph0-ns mt0 overflow-x-hidden">
      {#each $searchResults as {title, id, type, path}}
        <ListItem {title} {id} {type} {path}></ListItem>
      {/each}
    </ul>
  {:else}
    {#if path}
      <div
        tabindex="0"
        on:click={goUpOneLevel}
        on:keyup={whenEnter(goUpOneLevel)}
        class="note-item pointer flex items-center justify-between lh-copy pv3 ph2 ph0-ns ba bl-0 bt-0 br-0 b--dotted b--black-30"
      >
        <span>/..</span>
      </div>
    {/if}
    {#if $displayedNotes.length > 0}
      <ul class="list ph2 ph0-ns mt0 overflow-x-hidden">
        {#each $displayedNotes as {title, id, type}}
          <ListItem {title} {id} {type} {path}></ListItem>
        {/each}
      </ul>
    {:else}
      <small class="f6 black-60 db ph2 ph0-ns pt3">
        There is no notes. <a href={'/#' + createLink} class="blue link">Create one?</a>
      </small>
    {/if}
  {/if}
</section>
