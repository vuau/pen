import { writable } from 'svelte/store';
import { gun } from './contexts';

const gunNotes = gun.get('notes');
gunNotes.on(data => console.log('DEBUG CHANGE NOTES', data));

const notes = (function createNoteStore() {
  const { subscribe, update } = writable([]);
  const listen = function(note, id) {
    if (!note) {
      update(notes => notes.filter(n => n.id !== id));
      return;
    }
    update(notes => {
      let foundIndex = notes.findIndex(n => n.id === id);
      if (foundIndex !== -1) {
        notes[foundIndex] = {
          id,
          title: note.title,
          content: note.content
        };
      } else {
        notes.push({ ...note, id });
      }
      return notes;
    });
  };
  gunNotes.map().on(listen);
  return {
    subscribe,
    listen
  };
})();

const updateNote = async function({ id, title, content }) {
  if (id) {
    await gunNotes.get(id).put({
      title,
      content
    });
  } else {
    await gunNotes.set({
      title,
      content
    });
  }
};

const deleteNote = async function({ id }) {
  await gunNotes.get(id).put(null);
};

export { notes, updateNote, deleteNote };
