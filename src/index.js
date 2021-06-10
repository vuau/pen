import 'core-js/stable'
import 'regenerator-runtime/runtime'

import 'tachyons'
// import 'inobounce'
import smoothscroll from 'smoothscroll-polyfill'
import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'

import 'simplemirror/dist/SimpleMirror.css'
import './styles/font-icons.css'
import './styles/main.css'
import './styles/water.css'

import App from './App.svelte'

smoothscroll.polyfill()
Sentry.init({
  dsn:
    'https://a941e90de2ce4bbbb8d508e8e8d154e1@o820605.ingest.sentry.io/5809267',
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

const app = new App({
  target: document.body
})

const init = async () => {
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

window.onload = init

export default app
