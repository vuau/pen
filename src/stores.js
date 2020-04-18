import { writable, derived } from 'svelte/store'
import { gun, SEA } from './contexts'

const gunUser = gun.user()

let gunNotes
let salt

/* ACTIONS */
export const showActions = writable(false)
export const showSearch = writable(false)
export const searchKeyword = writable('')

/* NOTES */
export const notes = (function createNoteStore () {
  const { subscribe, update, set } = writable({})
  const updateToStore = ({ id, title, content }) => {
    update((notes) => ({
      ...notes,
      [id]: { title, content }
    }))
  }

  const updateNote = async function ({ id, title, content }) {
    const data = {
      title: await SEA.encrypt(title, salt),
      content: await SEA.encrypt(content, salt)
    }
    if (id) {
      return await gunNotes.get(id).put(data)
    } else {
      return await gunNotes.set(data)
    }
  }

  const deleteNote = async function (id) {
    await gunNotes.get(id).put(null)
  }

  const listen = async function (note, id) {
    if (!note) {
      // maybe deleted or bad data
      update((notes) => notes.filter((n) => n.id !== id))
      return
    }
    const data = {
      title: /^SEA{/g.test(note.title)
        ? await SEA.decrypt(note.title, salt)
        : note.title,
      content: /^SEA{/g.test(note.title)
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
  const { subscribe, set } = writable({
    isLoggedIn: false
  })
  const finishLogin = (cb) => (ack) => {
    if (ack.err) {
      if (cb) cb(ack.err)
    } else {
      gunNotes = gunUser.get('notes')
      gunNotes.map().on(notes.listen)
      salt = ack.sea
      set({ isLoggedIn: true })
      if (cb) cb()
    }
  }
  const createUser = (user, pass, cb) => {
    return gunUser.create(user, pass, (ack) => {
      if (ack.err) {
        if (cb) cb(ack.err)
      } else {
        login(user, pass, cb)
      }
    })
  }
  const login = (user, pass, cb) => {
    return gunUser.auth(user, pass, finishLogin(cb))
  }
  const logout = () => {
    gunUser.leave()
    set({ isLoggedIn: false })
  }
  const checkLogin = function () {
    gunUser.recall({ sessionStorage: true }, finishLogin())
  }
  return {
    subscribe,
    createUser,
    login,
    logout,
    checkLogin
  }
})()

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
      } else {
        arr.push({ id, title, content })
      }
    }
    return arr
  }
)
