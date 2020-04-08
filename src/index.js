import 'core-js/stable'
import 'regenerator-runtime/runtime'
import 'tachyons'
import 'material-design-icons/iconfont/material-icons.css'
import '@fortawesome/fontawesome-free/css/all.css'
import 'simplemirror/dist/SimpleMirror.css'
import './style.css'
import App from './App.svelte'

const app = new App({
  target: document.body,
  props: {
    name: 'Somewhere'
  }
})

export default app
