import { writable } from 'svelte/store'
import { gun } from './contexts'

/* NOTES */

const gunNotes = gun.get('notes')

const notes = (function createNoteStore() {
  const { subscribe, update } = writable([])
  const listen = function(note, id) {
    if (!note) {
      update(notes => notes.filter(n => n.id !== id))
      return
    }
    update(notes => {
      let foundIndex = notes.findIndex(n => n.id === id)
      if (foundIndex !== -1) {
        notes[foundIndex] = {
          id,
          title: note.title,
          content: note.content,
        }
      } else {
        notes.push({ ...note, id })
      }
      return notes
    })
  }
  gunNotes.map().on(listen)
  return {
    subscribe,
    listen,
  }
})()

const updateNote = async function({ id, title, content }) {
  if (id) {
    await gunNotes.get(id).put({
      title,
      content,
    })
  } else {
    await gunNotes.set({
      title,
      content,
    })
  }
}

const deleteNote = async function({ id }) {
  await gunNotes.get(id).put(null)
}

export { notes, updateNote, deleteNote }

/* USER */
const gunUser = gun.user()

const user = (function createUserStore() {
  const { subscribe, set } = writable({
    isLoggedIn: false,
  })
  const createUser = (user, pass, cb) => {
    gunUser.create(user, pass, ack => {
      if (ack.err) {
        alert(ack.err)
        return
      }
      set({ isLoggedIn: true })
      cb()
    })
  }
  const login = (user, pass, cb) => {
    gunUser.auth(
      user,
      pass,
      ack => {
        if (ack.err) {
          alert(ack.err)
          return
        }
        set({ isLoggedIn: true })
        cb()
      },
      { sessionStorage: true },
    )
  }
  const logout = () => {
    gunUser.leave()
    set({ isLoggedIn: false })
  }
  const checkLogin = function() {
    return new Promise(resolve => {
      gunUser.recall({ sessionStorage: true }, ack => {
        if (ack.err) {
          alert(ack.err)
          resolve(false)
        }
        set({ isLoggedIn: gunUser.is })
        resolve(true)
      })
    })
  }
  return {
    subscribe,
    createUser,
    login,
    logout,
    checkLogin,
  }
})()

export { user }
