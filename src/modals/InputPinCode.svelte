<script>
  import { user, modal } from '../stores.js'
  import { whenEnter } from '../utils.js'

  let pin

  async function onSubmit () {
    let err = await user.loginWithPin(pin)
    if (err) {
      alert(err)
      return
    }
    $modal.onClose()
  }

  function onLogin () {
    localStorage.removeItem('auth')
    location.href = '/'
  }
</script>

<form on:submit|preventDefault class="black-80">
  <div class="measure">
    <label for="pin" class="f6 b db mb2">Pin Code</label>
    <input type="number" bind:value={pin} on:keyup={whenEnter(onSubmit)} id="pin" class="input-reset ba b--black-20 pa2 mb2 db w-100"
    aria-describedby="pin-desc" />
    <small id="pin-desc" class="f6 black-60 db mb2">
      You can find your Pin code in the account setting
    </small>
  </div>
  <div class="mt3">
    <a
      href="#0"
      on:click|preventDefault={onSubmit}
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
