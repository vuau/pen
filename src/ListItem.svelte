<script>
  import { push } from 'svelte-spa-router'
  import { bulkAction } from './stores.js'

  export let id = null
  export let title = ''

  $: checked = $bulkAction.data.includes(id)

  const onCheck = () => {
    bulkAction.select(id)
  }

  const onClick = () => {
    if ($bulkAction.isSelecting) {
      onCheck()
    } else {
      push(`/notes/${id}`)
    }
  }
</script>

<li on:click={onClick}
  class="hover-to-show pointer dim flex items-center lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30">
  {#if $bulkAction.isSelecting}
    <span class="pa2 pl0 pointer flex items-center">
      <input type="checkbox" {checked} />
    </span>
  {/if}
  <span>{title}</span>
</li>
