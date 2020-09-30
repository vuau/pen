import 'core-js/stable'
import 'regenerator-runtime/runtime'

import 'tachyons'
// import 'inobounce'
import smoothscroll from 'smoothscroll-polyfill'

import 'simplemirror/dist/SimpleMirror.css'
import './styles/font-icons.css'
import './styles/main.css'
import './styles/water.css'

import App from './App.svelte'

smoothscroll.polyfill()

const app = new App({
  target: document.body
})

const init = async () => {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    const { Workbox } = await import('workbox-window')
    const wb = new Workbox('/sw.js')
    wb.addEventListener('installed', event => {
      if (event.isUpdate) {
        if (confirm('New app is available!. Click OK to refresh')) {
          window.location.reload()
        }
      }
    })
    wb.register()
  }
}

window.onload = init

export default app
