import SimpleMirror from 'simplemirror'

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
    inputRule: SimpleMirror.builtInInputRules.headingRule
  },
  h2: {
    text: 'H2',
    className: 'avenir'
  },
  h3: {
    text: 'H3'
  },
  h4: {
    text: 'H4',
    className: 'avenir'
  },
  orderedList: {
    className: 'icon-ordered-list',
    inputRule: SimpleMirror.builtInInputRules.orderedListRule
  },
  unorderedList: {
    className: 'icon-unordered-list',
    inputRule: SimpleMirror.builtInInputRules.unorderedListRule
  },
  indent: {
    className: 'icon-indent',
    shortcuts: ['Tab']
  },
  outdent: {
    className: 'icon-outdent',
    shortcuts: ['Shift-Tab']
  },
  quote: {
    className: 'icon-quote',
    inputRule: SimpleMirror.builtInInputRules.quoteRule
  },
  code: {
    className: 'icon-code',
    inputRule: SimpleMirror.builtInInputRules.codeRule
  },
  enter: {
    shortcuts: ['Enter']
  },
  break: {
    shortcuts: ['Shift-Enter', 'Ctrl-Enter']
  },
  exit: {
    shortcuts: ['Mod-Enter']
  },
  backspace: {
    shortcuts: ['Backspace', 'Mod-Backspace']
  },
  delete: {
    shortcuts: ['Delete', 'Mod-Delete']
  },
  selectAll: {
    shortcuts: ['Mod-a']
  }
}
