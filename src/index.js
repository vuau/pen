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

function scrollToPreventBounce (htmlElement) {
  const { scrollTop, offsetHeight, scrollHeight } = htmlElement

  // If at top, bump down 1px
  if (scrollTop <= 0) {
    htmlElement.scrollTo(0, 1)
    return
  }

  // If at bottom, bump up 1px
  if (scrollTop + offsetHeight >= scrollHeight) {
    htmlElement.scrollTo(0, scrollHeight - offsetHeight - 1)
  }
}
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
  document.htmlElement.addEventListener('touchstart', scrollToPreventBounce)
}

window.onload = init

export default app
