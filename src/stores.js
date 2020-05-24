import { writable, derived } from 'svelte/store'
import { gunUser, SEA } from './contexts'
import { v4 as uuidv4 } from 'uuid'

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
export const movingNote = writable(null)

/* NOTES */
export const notes = (function createNoteStore () {
  const { subscribe, update, set } = writable({})
  const updateToStore = ({ id, title, content, type }, isDeleted) => {
    update((notes) => ({
      ...notes,
      [id]: !isDeleted && { title, content, type }
    }))
  }

  const updateNote = async function ({ id, title, content, folderId }) {
    const data = {
      title: await SEA.encrypt(title, salt),
      content: await SEA.encrypt(content, salt)
    }
    id = id || uuidv4()
    if (folderId) {
      await gunNotes
        .get(folderId)
        .get('children')
        .get(id)
        .put(data)
        .then()
    } else {
      await gunNotes
        .get(id)
        .put(data)
        .then()
    }
    return id
  }

  const deleteNote = async function (id) {
    await gunNotes.get(id).put(null)
  }

  const moveNote = async function (noteId, currentFolderId, newFolderId) {
    const note = gunNotes.get(noteId)

    if (newFolderId) {
      await gunNotes
        .get(newFolderId)
        .get('children')
        .get(noteId)
        .put(note)
        .then()
    } else {
      await gunNotes
        .get(noteId)
        .put(note)
        .then()
    }

    if (currentFolderId) {
      await gunNotes
        .get(currentFolderId)
        .get('children')
        .get(noteId)
        .put(null)
        .then()
    } else {
      await gunNotes
        .get(noteId)
        .put(null)
        .then()
    }
  }

  const createFolder = async function (title, parentId) {
    if (parentId) {
      return await gunNotes
        .get(parentId)
        .get('children')
        .get(uuidv4())
        .put({
          title: await SEA.encrypt(title, salt),
          type: 'folder'
        })
    }
    await gunNotes.get(uuidv4()).put({
      title: await SEA.encrypt(title, salt),
      type: 'folder'
    })
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
        : note.content,
      type: note.type
    }
    updateToStore({ ...data, id })
  }

  const start = function (folderId) {
    gunNotes = gunUser.get('notes')
    set({})
    if (!folderId) {
      gunNotes.map().on(notes.listen)
    } else {
      gunNotes
        .get(folderId)
        .get('children')
        .map()
        .on(listen)
    }
  }
  return {
    subscribe,
    set,
    listen,
    updateNote,
    createFolder,
    deleteNote,
    moveNote,
    start
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

  const createUser = (user, pass) =>
    new Promise((resolve) => {
      gunUser.create(user, pass, (ack) => {
        if (ack.err) {
          resolve(ack.err)
          return
        }
        return login(user, pass)
      })
    })

  const login = (user, pass) =>
    new Promise((resolve) => {
      gunUser.auth(user, pass, (ack) => {
        if (ack.err) {
          resolve(ack.err)
          return
        }
        finishLogin({ user, pass, ack })
        resolve()
      })
    })

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
  var titleA = a.title.toString().toUpperCase()
  var titleB = b.title.toString().toUpperCase()
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
    for (const [id, { title, content, type, children }] of Object.entries(
      $notes
    )) {
      if ($searchKeyword) {
        if (
          (title &&
            title.toLowerCase().includes($searchKeyword.toLowerCase())) ||
          (content &&
            content.toLowerCase().includes($searchKeyword.toLowerCase()))
        ) {
          arr.push({ id, title, content, type, children })
        }
      } else if (title) {
        arr.push({ id, title, content, type, children })
      }
    }
    return arr.filter((note) => note).sort(compareTitle)
  }
)
