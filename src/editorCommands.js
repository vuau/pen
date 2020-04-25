export default {
  undo: {
    shortcuts: ['Mod-z'],
    className: 'icon-undo'
  },
  redo: {
    shortcuts: ['Shift-Mod-Z'],
    className: 'icon-redo'
  },
  bold: {
    className: 'icon-bold',
    shortcuts: ['Mod-b', 'Mod-B']
  },
  italic: {
    className: 'icon-italic',
    shortcuts: ['Mod-i', 'Mod-I']
  },
  strikethrough: {
    className: 'icon-strikethrough',
    shortcuts: ['Mod-s', 'Mod-S']
  },
  h1: {
    text: 'H1',
    className: 'avenir',
    inputRule: /^#\s/
  },
  h2: {
    text: 'H2',
    className: 'avenir',
    inputRule: /^##\s/
  },
  h3: {
    text: 'H3',
    inputRule: /^###\s/
  },
  h4: {
    text: 'H4',
    className: 'avenir',
    inputRule: /^####\s/
  },
  orderedList: {
    className: 'icon-ordered-list',
    inputRule: /^(\d+)\.\s$/
  },
  unorderedList: {
    className: 'icon-unordered-list',
    inputRule: /^\s*([-+*])\s$/
  },
  indent: {
    className: 'icon-indent'
  },
  outdent: {
    className: 'icon-outdent'
  },
  quote: {
    className: 'icon-quote'
  },
  code: {
    className: 'icon-code'
  }
}
