<script>
  import { user } from './stores.js'

  let username, password, isRegister, isLoading

  function onSubmit () {
    isLoading = true
    if (isRegister) {
      user.createUser(username, password).then(() => { isLoading = false })
    } else {
      user.login(username, password).then(() => { isLoading = false })
    }
  }

  function checkEnter (e) {
    if (e.code === 'Enter') {
      onSubmit()
    }
  }

  function toggle () {
    isRegister = !isRegister
  }
</script>

<section class="mw6 h-100 center flex items-center">
  <div class="w-100 pa3 pt0">
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
          on:keypress={checkEnter}
          id="username"
          class="input-reset ba b--black-20 pa2 mb2 db w-100"
          type="text"
          aria-describedby="username"
          autocomplete="off" />
      </div>
      <div class="pb3">
        <label for="password" class="f6 b db mb2">Password</label>
        <input
          bind:value={password}
          on:keypress={checkEnter}
          id="password"
          class="input-reset ba b--black-20 pa2 mb2 db w-100"
          type="password"
          aria-describedby="password"
          autocomplete="off" />
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
