<script>
  import { onMount } from 'svelte'
  import Router from 'svelte-spa-router'

  import AppLayout from './layouts/App.svelte'

  import List from './List.svelte'
  import Form from './Form.svelte'
  import Login from './Login.svelte'
  import InputPinCode from './modals/InputPinCode.svelte'
  import { user, modal } from './stores.js'

  let isProcessing = false

  const routes = {
    '/': List,
    '/notes/folder/:path': List,
    '/notes/new/:path?': Form,
    '/notes/:id/:path?': Form
  }

  onMount(() => {
    if ($user.isLoggedIn) return

    const auth = localStorage.getItem('auth')
    if (auth) {
      isProcessing = true
      modal.set({
        noXButton: true,
        title: 'Continue your session',
        content: InputPinCode,
        onClose: () => {
          modal.set(null)
          isProcessing = false
        }
      })
    }
  })
</script>

<AppLayout>
  {#if $user.isLoggedIn}
    <Router {routes} />
  {:else}
    {#if !isProcessing}
      <Login />
    {/if}
  {/if}
</AppLayout>

{#if $modal}
  <div class="sans-serif fixed top-0 left-0 right-0 bottom-0 z-1 flex items-center justify-center bg-black-10">
    <div class="bg-white relative pa2">
      {#if !$modal.noXButton}
        <div on:click={$modal.onClose} class="absolute top-0 right-0 white bg-dark-gray w2 pvs tc flex items-center">
          <span tabindex="0" class="icon-x w2 tc pointer"></span>
        </div>
      {/if}
      <h3>{$modal.title}</h3>
      <svelte:component this={$modal.content} />
    </div>
  </div>
{/if}
