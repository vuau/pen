<script>
  import { user, modal } from '../stores.js'

  let pin = ''
  let isProcessing

  async function checkSubmit () {
    if (!pin || String(pin).length < 4 || isProcessing) return
    isProcessing = true
    const err = await user.loginWithPin(pin)
    isProcessing = false
    if (err) {
      alert(err)
      pin = ''
      return
    }
    $modal.onClose()
  }

  function chooseNumber (number) {
    return () => {
      pin = `${pin}${number}`
      checkSubmit()
    }
  }

  function onLogin () {
    localStorage.removeItem('auth')
    location.reload()
  }

  function clear () {
    pin = pin.substr(0, pin.length - 1)
  }

  function clearAll () {
    pin = ''
  }

  const handleKey = async e => {
    if (e.code === 'Escape') {
      $modal.onClose()
      return
    }
    if (e.code.search('Digit') !== -1) {
      pin = `${pin}${e.code.split('Digit')[1]}`
      checkSubmit()
    }
  }
</script>

<svelte:window on:keyup={handleKey} />

<form on:submit|preventDefault class="black-80">
  <div class="measure">
    <label for="pin" class="f6 b db mb2">Unlock by pin code</label>
    <small id="pin-desc" class="f6 black-60 db mb2">
      You can find your Pin code in the account setting
    </small>
    <input
      type="password"
      readonly
      autocomplete="new-password"
      value={pin}
      class="input-reset ba b--black-20 pa2 mb2 db w-100" />
    <div class="numpad ba flex flex-wrap">
      {#each Array.from(Array(10), (_, i) => (i >= 9 ? 0 : i + 1)) as number}
        <button
          class="pv3 w-third tc pointer f3 no-select"
          on:click={chooseNumber(number)}>
          {number}
        </button>
      {/each}
      <button class="pv3 w-third tc pointer f4 ttu no-select" on:click={clear}>
        Del
      </button>
      <button
        class="pv3 w-third tc pointer f4 ttu no-select"
        on:click={clearAll}>
        Clear
      </button>
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
