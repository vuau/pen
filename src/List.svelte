<script>
  import { push } from 'svelte-spa-router'
  import { showActions, notes, user } from './stores.js'
  import ListItem from './ListItem.svelte'

  function openNewNote () {
    push('/notes/new')
  }

  function toggleActions () {
    showActions.update(f => !f)
  }
</script>

<section class="mw7 center">
  <h2 class="h3 sticky athelas ma0 ph2 pv3 ph0-ns bb b--near-black flex items-center justify-between">
    <span>
      Pen
    </span>
    <div class="flex items-center">
      <span on:click={openNewNote} class="icon-create w2 tc pointer"></span>
      <span class="icon-search w2 tc pointer"></span>
      <span on:click={toggleActions} class="icon-config w2 tc pointer {$showActions ? 'blue' : ''}"></span>
      <span class="dib br b--black h1 ml2 mr2"></span>
      <span on:click={user.logout} class="icon-power w2 tc pointer"></span>
    </div>
  </h2>
  {#if $notes.length > 0}
    <ul class="list ph2 ph0-ns mt0 overflow-x-hidden">
      {#each $notes as {title, id}}
      <ListItem {title} {id}></ListItem>
      {/each}
    </ul>
  {:else}
    <small class="f6 black-60 db ph2 ph0-ns pt4">
      There is no notes. <a href="/#/notes/new" class="blue link">Create one?</a>
    </small>
  {/if}
</section>
