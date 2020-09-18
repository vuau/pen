<script>
  import FileSaver from 'file-saver'
  import { user, modal, decrypt, getParentNode } from '../stores.js'
  import { whenEnter } from '../utils.js'

  let pin = $user.config ? $user.config.pin : ''
  let searchTimeout
  let isSearching = false
  let startBackup = false
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
      const decryptedData = await decrypt(data)
      if (decryptedData.type === 'folder') {
        const newPath = [
          ...(path || '').split('_').filter(p => p !== ''),
          id
        ].join('_')
        doSearch(text, newPath)
      } else {
        if (
          (decryptedData.title &&
            decryptedData.title.toLowerCase().includes(text.toLowerCase())) ||
          (decryptedData.content &&
            decryptedData.content.toLowerCase().includes(text.toLowerCase()))
        ) {
          searchResults = {
            ...searchResults,
            [id]: {
              id,
              ...decryptedData,
              path
            }
          }
          clearTimeout(searchTimeout)
        }
      }
    })
  }
  function backup () {
    searchResults = {}
    startBackup = true
    isSearching = true
    doSearch('')
  }
  $: {
    if (startBackup && !isSearching) {
      // DONE
      console.log(searchResults)
      const blob = new Blob([JSON.stringify(searchResults, null, 2)], {
        type: 'application/json'
      })
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1 // "+ 1" becouse the 1st month is 0
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
    <button on:click|preventDefault={backup}>
      {#if isSearching}Processing...{:else}Backup{/if}
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
