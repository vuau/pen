<script>
  import { push } from 'svelte-spa-router';
  import { deleteNote } from './stores.js';

  function openEditNote(id) {
    push(`/notes/${id}`);
  }

  function confirmToDelete(id) {
    if (confirm('Are you sure to delete this note?')) {
      deleteNote({ id });
    }
  }

  export let id = null;
  export let title = '';
</script>

<li on:click={() => openEditNote(id) }
  class="hover-to-show pointer dim flex items-center justify-between lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30">
  <span>{title}</span>
  <span
    on:click|stopPropagation={() => confirmToDelete(id)}
    class="hover-element-to-show material-icons w2 pointer"
  >delete_outline</span>
</li>
