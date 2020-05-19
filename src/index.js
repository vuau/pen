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

const initServiceWorker = async () => {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    const { Workbox } = await import('workbox-window')
    const wb = new Workbox('/sw.js')
    wb.addEventListener('installed', (event) => {
      if (event.isUpdate) {
        if (confirm('New app is available!. Click OK to refresh')) {
          window.location.reload()
        }
      }
    })
    wb.register()
  }
}

window.onload = initServiceWorker

export default app
