import { writable, derived } from 'svelte/store'
import { gunUser, SEA } from './contexts'

let gunNotes
let salt

const getDefaultConfig = () => {
  const randomPin = Math.floor(1000 + Math.random() * 9000)
  return {
    pin: randomPin
  }
}

/* ACTIONS */
export const showActions = writable(false)
export const showSearch = writable(false)
export const searchKeyword = writable('')
export const modal = writable(null)

/* NOTES */
export const notes = (function createNoteStore () {
  const { subscribe, update, set } = writable({})
  const updateToStore = ({ id, title, content }, isDeleted) => {
    update((notes) => ({
      ...notes,
      [id]: !isDeleted && { title, content }
    }))
  }

  const updateNote = async function ({ id, title, content }) {
    const data = {
      title: await SEA.encrypt(title, salt),
      content: await SEA.encrypt(content, salt)
    }
    if (id) {
      return await gunNotes
        .get(id)
        .put(data)
        .then()
    } else {
      return await gunNotes.set(data).then()
    }
  }

  const deleteNote = async function (id) {
    await gunNotes.get(id).put(null)
  }

  const listen = async function (note, id) {
    if (!note) {
      updateToStore({ id }, true)
      return
    }
    const data = {
      title: /^SEA{/g.test(note.title)
        ? await SEA.decrypt(note.title, salt)
        : note.title,
      content: /^SEA{/g.test(note.content)
        ? await SEA.decrypt(note.content, salt)
        : note.content
    }
    updateToStore({ ...data, id })
  }
  return {
    subscribe,
    set,
    listen,
    updateNote,
    deleteNote
  }
})()

/* USER */
export const user = (function createUserStore () {
  const { subscribe, set, update } = writable({
    isLoggedIn: false
  })

  const getAuthInfo = async (pin) => {
    const encryptedAuth = localStorage.getItem('auth')
    if (encryptedAuth) {
      return await SEA.decrypt(encryptedAuth, pin)
    }
    return null
  }
  const saveAuthInfo = async ({ user, pass }, pin) => {
    const authEncrypted = await SEA.encrypt({ user, pass }, pin)
    localStorage.setItem('auth', authEncrypted)
  }

  const finishLogin = ({ user, pass, ack }) => {
    gunNotes = gunUser.get('notes')
    gunNotes.map().on(notes.listen)
    notes.set({})
    salt = ack.sea
    gunUser
      .get('config')
      .not(async function () {
        const defaultConfig = getDefaultConfig()
        const encryptedConfig = await SEA.encrypt(defaultConfig, salt)
        gunUser.get('config').put(encryptedConfig)
        update((user) => ({ ...user, config: encryptedConfig }))
        await saveAuthInfo({ user, pass }, defaultConfig.pin)
      })
      .on(async (configValue) => {
        const config = await SEA.decrypt(configValue, salt)
        if (!config) return
        update((user) => ({ ...user, config }))
        await saveAuthInfo({ user, pass }, config.pin)
      })
    update((user) => ({ ...user, isLoggedIn: true }))
  }

  const createUser = async (user, pass) => {
    return await new Promise((resolve) => {
      gunUser.create(user, pass, async (ack) => {
        if (ack.err) return resolve(ack.err)
        return await login(user, pass)
      })
    })
  }

  const login = async (user, pass) => {
    return await new Promise((resolve) => {
      gunUser.auth(user, pass, (ack) => {
        if (ack.err) return resolve(ack.err)
        resolve()
        finishLogin({ user, pass, ack })
      })
    })
  }
  const logout = () => {
    gunUser.leave()
    set({ isLoggedIn: false })
    localStorage.removeItem('auth')
  }
  const loginWithPin = async function (pin) {
    const authInfo = await getAuthInfo(pin)
    if (authInfo) {
      return await login(authInfo.user, authInfo.pass)
    }
    return SEA.err
  }

  const updateConfig = async (config, cb) => {
    const encryptedConfig = await SEA.encrypt(config, salt)
    gunUser.get('config').put(encryptedConfig, cb)
  }

  return {
    subscribe,
    createUser,
    login,
    logout,
    loginWithPin,
    updateConfig
  }
})()

function compareTitle (a, b) {
  var titleA = a.title.toUpperCase()
  var titleB = b.title.toUpperCase()
  if (titleA < titleB) {
    return -1
  }
  if (titleA > titleB) {
    return 1
  }
  return 0
}

export const displayedNotes = derived(
  [notes, searchKeyword],
  ([$notes, $searchKeyword]) => {
    const arr = []
    for (const [id, { title, content }] of Object.entries($notes)) {
      if ($searchKeyword) {
        if (
          (title &&
            title.toLowerCase().includes($searchKeyword.toLowerCase())) ||
          (content &&
            content.toLowerCase().includes($searchKeyword.toLowerCase()))
        ) {
          arr.push({ id, title, content })
        }
      } else if (title) {
        arr.push({ id, title, content })
      }
    }
    return arr.filter((note) => note).sort(compareTitle)
  }
)
