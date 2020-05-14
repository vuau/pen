/* global workbox, importScripts */

importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js'
)

// the following line will be replaced by workbox-cli
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST)
