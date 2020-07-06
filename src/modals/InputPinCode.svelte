<script>
  import { onMount } from 'svelte'
  import { push } from 'svelte-spa-router'
  import { user, modal } from '../stores.js'
  import { debounce, whenEnter } from '../utils.js'

  let pin
  let inputEl
  let isProcessing

  async function checkSubmit () {
    if (!pin || String(pin).length < 4 || isProcessing) return;
    isProcessing = true
    let err = await user.loginWithPin(pin)
    isProcessing = false
    if (err) {
      alert(err)
      return
    }
    $modal.onClose()
  }

  function onLogin () {
    localStorage.removeItem('auth')
    location.reload()
  }

  onMount(() => {
    if (inputEl) inputEl.focus()
  })
</script>

<form on:submit|preventDefault class="black-80">
  <div class="measure">
    <label for="pin" class="f6 b db mb2">Unlock by pin code</label>
    <input type="number" bind:this={inputEl} bind:value={pin} on:keyup={debounce(checkSubmit, 100)} id="pin" class="input-reset ba b--black-20 pa2 mb2 db w-100"
    aria-describedby="pin-desc" />
    <small id="pin-desc" class="f6 black-60 db mb2">
      You can find your Pin code in the account setting
    </small>
  </div>
  <div class="mt3">
    <a
      href="#0"
      on:click|preventDefault={checkSubmit}
      class="f6 link dim br1 ph3 pv2 mb2 dib white bg-black">
      Verify
    </a>
    <a
      href="#0"
      on:click|preventDefault={onLogin}
      class="f6 link dim br1 ph2 pv2 mb2 dib black">
      or Login with password
    </a>
  </div>
</form>
