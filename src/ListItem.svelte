<script>
  import { push } from 'svelte-spa-router'
  import { bulkAction } from './stores.js'

  function openEditNote (id) {
    push(`/notes/${id}`)
  }

  export let id = null
  export let title = ''
</script>

<li on:click={() => openEditNote(id) }
  class="hover-to-show pointer dim flex items-center lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30">
  {#if $bulkAction.isSelecting}
  <input on:click|stopPropagation={() => bulkAction.select(id)} class="mr2" type="checkbox" />
  {/if}
  <span>{title}</span>
</li>
