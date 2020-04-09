import 'core-js/stable'
import 'regenerator-runtime/runtime'

import 'tachyons'
import 'simplemirror/dist/SimpleMirror.css'
import './styles/font-icons.css'
import './styles/main.css'
import './styles/water.css'

import App from './App.svelte'

const app = new App({
  target: document.body
})

export default app
