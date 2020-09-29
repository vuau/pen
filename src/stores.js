import { writable, derived } from 'svelte/store'
import { gunUser, SEA } from './contexts'
import { v4 as uuidv4 } from 'uuid'

let salt

const getDefaultConfig = () => {
  const randomPin = Math.floor(1000 + Math.random() * 9000)
  return {
    pin: randomPin
  }
}

export const getParentNode = (path, root = gunUser) => {
  const parts = (path || '').split('_').filter(p => p !== '')
  let node = root.get('notes')
  parts.forEach(id => {
    node = node.get(id).get('children')
  })
  return node
}

const encrypt = async data => ({
  ...data,
  ...(data.title && { title: await SEA.encrypt(data.title, salt) }),
  ...(data.content && { content: await SEA.encrypt(data.content, salt) })
})

export const decrypt = async data => ({
  ...data,
  ...(data.title && {
    title: /^SEA{/g.test(data.title)
      ? await SEA.decrypt(data.title, salt)
      : data.title
  }),
  ...(data.content && {
    content: /^SEA{/g.test(data.content)
      ? await SEA.decrypt(data.content, salt)
      : data.content
  })
})

/* ACTIONS */
export const showActions = writable(false)
export const showSearch = writable(false)
export const searchKeyword = writable('')
export const modal = writable(null)
export const movingNote = writable(null)
export const searchResults = writable({})
export const isFromNote = writable(false)

/* NOTES */
export const notes = (function createNoteStore () {
  const { subscribe, update, set } = writable({})
  const updateToStore = ({ id, ...data }, isDeleted) => {
    update(notes => {
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

  const updateNote = async function ({
    path,
    id = uuidv4(),
    title,
    content,
    slug, // slug or domain
    type, // folder or file
    mode, // private - public - shared
    headerTag,
    ...rest
  }) {
    const data = {
      ...(title && { title }),
      ...(content && { content }),
      ...(slug && { slug }),
      ...(type && { type }),
      ...(mode && { mode }),
      ...(headerTag && { headerTag }),
      updatedTime: Date.now(),
      ...rest
    }
    const dataToUpdate =
      !mode || mode !== 'public' ? await encrypt(data) : await decrypt(data)
    if (mode === 'public') {
      if (slug && slug.trim() !== '') {
        await gunUser
          .get('slugs')
          .get(slug)
          .put(`${path}_${id}`)
          .then()
      }
    }
    await getParentNode(path)
      .get(id)
      .put(dataToUpdate)
      .then()
    return id
  }

  const deleteNote = async function (id, path) {
    return await getParentNode(path)
      .get(id)
      .put(null)
  }

  const moveNote = async function (noteId, fromPath, toPath) {
    const nodeFrom = getParentNode(fromPath)
    const nodeTo = getParentNode(toPath)
    const note = nodeFrom.get(noteId)

    // Bug: insert to nodeTo before removing from nodeFrom, otherwise data will be lost
    await nodeTo
      .get(noteId)
      .put(note)
      .then()

    await nodeFrom
      .get(noteId)
      .put(null)
      .then()

    movingNote.set(null)
  }

  const createFolder = async function (title, path) {
    const data = await encrypt({
      title,
      type: 'folder',
      updatedTime: Date.now()
    })
    return await getParentNode(path)
      .get(uuidv4())
      .put(data)
  }

  const listen = async function (note, id) {
    if (!note) {
      updateToStore({ id }, true)
      return
    }
    const data = await decrypt(note)
    updateToStore({ ...data, id })
  }

  const start = function (path) {
    getParentNode(path)
      .map()
      .on(listen)
  }

  const stop = function (path = '') {
    getParentNode(path).off()
    set({})
  }

  return {
    subscribe,
    set,
    listen,
    updateNote,
    createFolder,
    deleteNote,
    moveNote,
    start,
    stop
  }
})()

/* USER */
export const user = (function createUserStore () {
  const { subscribe, set, update } = writable({
    isLoggedIn: false
  })

  const getAuthInfo = async pin => {
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
        update(user => ({ ...user, config: encryptedConfig }))
        await saveAuthInfo({ user, pass }, defaultConfig.pin)
      })
      .on(async configValue => {
        const config = await SEA.decrypt(configValue, salt)
        if (!config) return
        update(user => ({ ...user, config }))
        await saveAuthInfo({ user, pass }, config.pin)
      })
    update(user => ({ ...user, isLoggedIn: true }))
  }

  const createUser = (user, pass) =>
    new Promise(resolve => {
      gunUser.create(user, pass, ack => {
        if (ack.err) {
          resolve(ack.err)
          return
        }
        return login(user, pass)
      })
    })

  const login = (user, pass) =>
    new Promise(resolve => {
      gunUser.auth(user, pass, ack => {
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

function compare (a, b) {
  // if (a.updatedTime > b.updatedTime) return -1
  // if (a.updatedTime < b.updatedTime) return 1

  if (!a.title && b.title) return -1
  if (a.title && !b.title) return 1

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

export const displayedNotes = derived([notes], ([$notes]) => {
  const folders = []
  const files = []
  for (const [id, note] of Object.entries($notes)) {
    if (note && note.title) {
      if (note.type === 'folder') {
        folders.push({ id, ...note })
      } else {
        files.push({ id, ...note })
      }
    }
  }
  return [...files.sort(compare), ...folders.sort(compare)]
})
