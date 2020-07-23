<script>
  import { onMount } from 'svelte'
  import { push } from 'svelte-spa-router'
  import { user, modal } from '../stores.js'
  import { debounce, whenEnter } from '../utils.js'

  let pin = ''
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

  function chooseNumber (number) {
    return () => {
      pin = `${pin}${number}` 
      checkSubmit(pin)
    }
  }

  function onLogin () {
    localStorage.removeItem('auth')
    location.reload()
  }
</script>

<form on:submit|preventDefault class="black-80">
  <div class="measure">
    <label for="pin" class="f6 b db mb2">Unlock by pin code</label>
    <small id="pin-desc" class="f6 black-60 db mb2">
      You can find your Pin code in the account setting
    </small>
    <input type="password" value={pin} class="input-reset ba b--black-20 pa2 mb2 db w-100" />
    <div class="numpad ba flex flex-wrap">
      {#each Array.from(Array(10), (_, i) => i >= 9 ? 0 : i + 1) as number}
        <div class="ph2 pv3 w-third tc pointer" on:click={chooseNumber(number)}>{number}</div>
      {/each}
    </div>
  </div>
  <div class="mt3">
    <a
      href="#0"
      on:click|preventDefault={onLogin}
      class="f6 link dim br1 ph3 pv2 mb2 dib white bg-black">
      or Login with password
    </a>
  </div>
</form>
