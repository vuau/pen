import { writable } from 'svelte/store'
import { gun } from './contexts'

const gunUser = gun.user()

let gunNotes

/* ACTIONS */
const bulkAction = (() => {
  const { subscribe, update } = writable({
    isSelecting: false,
    data: []
  })
  return {
    subscribe,
    toggleSelect: () => {
      update(b => ({ ...b, isSelecting: !b.isSelecting, data: [] }))
    },
    select: item => {
      update(({ isSelecting, data }) => ({
        isSelecting,
        data: data.includes(item) ? data.filter(i => i !== item) : [
          ...data,
          item
        ]
      }))
    }
  }
})()

export { bulkAction }

/* NOTES */
const notes = (function createNoteStore () {
  const { subscribe, update } = writable([])
  const listen = function (note, id) {
    if (!note) {
      update((notes) => notes.filter((n) => n.id !== id))
      return
    }
    update((notes) => {
      const foundIndex = notes.findIndex((n) => n.id === id)
      if (foundIndex !== -1) {
        notes[foundIndex] = {
          id,
          title: note.title,
          content: note.content
        }
      } else {
        notes.push({ ...note, id })
      }
      return notes
    })
  }
  return {
    subscribe,
    listen
  }
})()

const updateNote = async function ({ id, title, content }) {
  if (id) {
    return await gunNotes.get(id).put({
      title,
      content
    })
  } else {
    return await gunNotes.set({
      title,
      content
    })
  }
}

const deleteNote = async function (id) {
  await gunNotes.get(id).put(null)
}

export { notes, updateNote, deleteNote }

/* USER */
const user = (function createUserStore () {
  const { subscribe, set } = writable({
    isLoggedIn: false
  })
  const createUser = (user, pass, cb) => {
    return gunUser.create(user, pass, (ack) => {
      if (ack.err) {
        if (cb) cb(ack.err)
      } else {
        set({ isLoggedIn: true })
        if (cb) cb()
      }
    })
  }
  const finishLogin = cb => ack => {
    if (ack.err) {
      if (cb) cb(ack.err)
    } else {
      gunNotes = gunUser.get('notes')
      gunNotes.map().on(notes.listen)
      set({ isLoggedIn: true })
      if (cb) cb()
    }
  }
  const login = (user, pass, cb) => {
    return gunUser.auth(user, pass, finishLogin(cb))
  }
  const logout = () => {
    gunUser.leave()
    set({ isLoggedIn: false })
    window.localStorage.removeItem('gun/')
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

export { user }
