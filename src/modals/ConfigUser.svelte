<script>
  import FileSaver from 'file-saver'
  import { user, modal, getParentNode, decrypt } from '../stores.js'
  import { whenEnter } from '../utils.js'
  import { gunUser } from '../contexts.js'
  import Gun from 'gun/gun'

  let pin = $user.config ? $user.config.pin : ''
  let searchTimeout
  let isSearching = false
  let startBackup = false
  let startRestore = false
  let jsonData
  let searchResults = {}

  async function onSubmit () {
    await user.updateConfig({ pin })
    $modal.onClose()
  }

  function doSearch (text, path) {
    searchTimeout = setTimeout(() => {
      isSearching = false
    }, 1000)
    const node = getParentNode(path)
    node.map().once(async (data, id) => {
      if (!data) return
      if (data.type === 'folder') {
        const newPath = [
          ...(path || '').split('_').filter(p => p !== ''),
          id
        ].join('_')
        if (searchTimeout) clearTimeout(searchTimeout)
        doSearch(text, newPath)
      }
      searchResults[id] = await decrypt(data)
    })
  }
  function backup () {
    searchResults = {}
    startBackup = true
    isSearching = true
    doSearch()
  }
  async function restore () {
    startRestore = true
    const dataToRestore = JSON.parse(jsonData)
    Object.values(dataToRestore).map(async node => {
      const soul = Gun.node.soul(node)
      const path = soul.split('/').splice(1)
      if (node) {
        await gunUser
          .path(path)
          .put(node)
          .then()
      }
    })
    startRestore = false
  }
  $: {
    if (startBackup && !isSearching) {
      const blob = new Blob([JSON.stringify(searchResults, null, 2)], {
        type: 'application/json'
      })
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minutes = date.getMinutes()
      const filename = `backup-${month}.${day}.${year}-${hour}:${minutes}.json`
      FileSaver.saveAs(blob, filename)
      startBackup = false
    }
  }
</script>

<form class="black-80">
  <div class="measure">
    <label for="pin" class="f6 b db mb2">Pin Code</label>
    <input
      type="number"
      bind:value={pin}
      on:keyup={whenEnter(onSubmit)}
      id="pin"
      class="input-reset ba b--black-20 pa2 mb2 db w-100"
      aria-describedby="pin-desc" />
    <small id="pin-desc" class="f6 black-60 db mb2">Pin is used to unlock your
      session.</small>

    <label for="pin" class="f6 b db mt3 mb2">Backup</label>
    <button on:click|preventDefault={backup}>
      {#if isSearching}Processing...{:else}Backup{/if}
    </button>
    <small id="restore-desc" class="f6 black-60 db mb2 mt1">Save your data to a JSON file</small>
    <label for="pin" class="f6 b db mt3 mb2">Restore</label>
    <textarea
      class="mt1 ba"
      bind:value={jsonData}
      placeholder="Paste here json data to restore" />
    <small id="restore-desc" class="f6 black-60 db mb2 mt1">Only JSON data which belongs to this user can be restored.</small>
    <button on:click|preventDefault={restore}>
      {#if startRestore}Processing...{:else}Restore{/if}
    </button>
  </div>
  <div class="mt3">
    <a
      href="#0"
      on:click|preventDefault={onSubmit}
      class="f6 link dim br1 ph3 pv2 mb2 dib white bg-black">
      Save
    </a>
  </div>
</form>
