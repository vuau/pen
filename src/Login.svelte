<script>
  import { user } from './stores.js'

  let username, password, isRegister

  function onSubmit () {
    if (isRegister) {
      user.createUser(username, password)
    } else {
      user.login(username, password)
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
        <label for="name" class="f6 b db mb2">Username</label>
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
        <label for="name" class="f6 b db mb2">Password</label>
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
</section>
