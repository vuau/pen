<script>
  import { user } from './stores.js'
  import { whenEnter } from './utils.js'

  let username, password, isRegister, isLoading

  async function onSubmit () {
    if (isLoading) return
    isLoading = true
    let err 
    if (isRegister) {
      err = await user.createUser(username, password)
    } else {
      err = await user.login(username, password)
    }
    if (err) {
      alert(err)
    }
    isLoading = false
  }

  function toggle () {
    isRegister = !isRegister
  }
</script>

<section class="mw6 h-100 center flex items-center" on:keyup={whenEnter(onSubmit)}>
  <div class="w-100 pa3 pt0">
    <h1 class="f2 fw7 ttu tracked lh-title mt0 mb2 avenir tc">
      deNOTE 
    </h1>
    <h4 class="f5 fw1 i lh-title mt0 tc mb5">A decentralized note taking app</h4>

    <h2 class="mt0 athelas flex items-center justify-between">
      <span>
        {#if isRegister}Create an account{:else}Login{/if}
      </span>
    </h2>

    <form class="black-80 flex-auto flex flex-column" autocomplete="off">
      <div class="pb3">
        <label for="username" class="f6 b db mb2">Username</label>
        <input
          bind:value={username}
          id="username"
          class="input-reset ba b--black-20 pa2 mb2 db w-100"
          type="text"
          aria-describedby="username"
          autocomplete="new-password" />
      </div>
      <div class="pb3">
        <label for="password" class="f6 b db mb2">Password</label>
        <input
          bind:value={password}
          id="password"
          class="input-reset ba b--black-20 pa2 mb2 db w-100"
          type="password"
          aria-describedby="password"
          autocomplete="new-password" />
        {#if isRegister}
          <small id="password-desc" class="f6 black-60 db mb2">
            Be careful! You cannot reset your password if you forgot it.
          </small>
        {/if}
      </div>
      <div>
        <a
          href="#0"
          on:click|preventDefault={onSubmit}
          class="f6 link dim br1 ph3 pv2 mb2 dib white bg-black">
          {#if isRegister}Create{:else}Login{/if}
        </a>
        <a
          href="#0"
          on:click|preventDefault={toggle}
          class="f6 link dim br1 ph2 pv2 mb2 dib black">
          {#if isRegister}Cancel{:else}or Create an account{/if}
        </a>
      </div>
    </form>
  </div>
  {#if isLoading}
    <div class="loader">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
         width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
      <path fill="#000" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
        <animateTransform attributeType="xml"
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="0.6s"
          repeatCount="indefinite"/>
        </path>
      </svg>
    </div>
  {/if}
</section>
