/* global workbox, importScripts */

importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js'
)

// Updating SW lifecycle to update the app after user triggered refresh
workbox.core.skipWaiting()
workbox.core.clientsClaim()

// the following line will be replaced by workbox-cli
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST)
