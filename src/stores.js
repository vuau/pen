import { writable } from 'svelte/store'
import { gun } from './contexts'

const gunUser = gun.user()
let gunNotes

/* ACTIONS */
const bulkAction = (() => {
  const { subscribe, update } = writable({
    isSelecting: false,
    data: []
  });
  return {
    subscribe,
    toggleSelect: () => {
      update(b => ({...b, isSelecting: !b.isSelecting}));
    },
    select: item => {
      update(({ isSelecting, data }) => ({
        isSelecting,
        data: data.includes(item) ? data.filter(i => i !== item) : [
          ...data,
          item,
        ]
      }));
    }
  };
})();

export { bulkAction };

/* NOTES */
const notes = (function createNoteStore() {
  const { subscribe, update } = writable([])
  const listen = function (note, id) {
    if (!note) {
      update((notes) => notes.filter((n) => n.id !== id))
      return
    }
    update((notes) => {
      let foundIndex = notes.findIndex((n) => n.id === id)
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
  return {
    subscribe,
    listen,
  }
})()

const updateNote = async function ({ id, title, content }) {
  if (id) {
    return await gunNotes.get(id).put({
      title,
      content,
    })
  } else {
    return await gunNotes.set({
      title,
      content,
    })
  }
}

const deleteNote = async function (id) {
  await gunNotes.get(id).put(null)
}

export { notes, updateNote, deleteNote }

/* USER */
const user = (function createUserStore() {
  const { subscribe, set } = writable({
    isLoggedIn: false,
  })
  const createUser = (user, pass) => {
    gunUser.create(user, pass, (ack) => {
      if (ack.err) {
        alert(ack.err)
        return
      }
      set({ isLoggedIn: true })
    })
  }
  const finishLogin = ack => {
    if (ack.err) {
      alert(ack.err)
      return
    }
    gunNotes = gunUser.get('notes')
    gunNotes.map().on(notes.listen)
    set({ isLoggedIn: true })
  }
  const login = (user, pass) => {
    gunUser.auth(user, pass, finishLogin)
  }
  const logout = () => {
    gunUser.leave()
    set({ isLoggedIn: false })
  }
  const checkLogin = function () {
    gunUser.recall({ sessionStorage: true }, finishLogin)
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
