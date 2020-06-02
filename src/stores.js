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
  const updateToStore = ({ id, ...data }, isDeleted) => {
    update((notes) => {
      if (isDeleted) {
        delete notes[id]
        return notes
      }
      return {
        ...notes,
        [id]: data
      }
    })
  }

  const updateNote = async function ({ id, title, content, path = '' }) {
    const data = {
      title: await SEA.encrypt(title, salt),
      content: await SEA.encrypt(content, salt)
    }
    id = id || uuidv4()
    const parts = path.split('_').filter((p) => p !== '')
    let node = gunNotes
    parts.forEach((id) => {
      node = node.get(id).get('children')
    })
    await node
      .get(id)
      .put(data)
      .then()
    return id
  }

  const deleteNote = async function (id, path) {
    let node = gunNotes
    if (path) {
      path
        .split('_')
        .filter((p) => p !== '')
        .forEach((id) => {
          node = node.get(id).get('children')
        })
    } else {
      node = node.get(id)
    }
    return await node.put(null)
  }

  const moveNote = async function (noteId, fromPath, toPath) {
    let nodeFrom = gunNotes
    fromPath
      .split('_')
      .filter((p) => p !== '')
      .forEach((id) => {
        nodeFrom = nodeFrom.get(id).get('children')
      })

    let nodeTo = gunNotes
    toPath
      .split('_')
      .filter((p) => p !== '')
      .forEach((id) => {
        nodeTo = nodeTo.get(id).get('children')
      })

    const note = nodeFrom.get(noteId)

    if (fromPath) {
      await nodeFrom
        .get(noteId)
        .put(null)
        .then()
    } else {
      await gunNotes
        .get(noteId)
        .put(null)
        .then()
    }

    if (toPath) {
      await nodeTo
        .get(noteId)
        .put(note)
        .then()
    } else {
      await gunNotes
        .get(noteId)
        .put(note)
        .then()
    }

    movingNote.set(null)
  }

  const createFolder = async function (title, path) {
    if (path) {
      const parts = path.split('_')
      let node = gunNotes
      parts.forEach((id) => {
        node = node.get(id).get('children')
      })
      return await node.get(uuidv4()).put({
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

  const start = function (path) {
    gunNotes = gunUser.get('notes')
    set({})
    if (!path) {
      gunNotes.map().on(notes.listen)
    } else {
      const parts = path.split('_')
      let node = gunNotes
      parts.forEach((id) => {
        node = node.get(id).get('children')
      })
      node.map().on(listen)
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
