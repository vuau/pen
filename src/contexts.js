import Gun from 'gun/gun'
import SEA from 'gun/sea'
import 'gun/lib/not'
import 'gun/lib/then'
import 'gun/lib/webrtc'

let gun

if (process.env.NODE_ENV === 'production') {
  gun = Gun(['https://pensync.glitch.me/gun'])
} else {
  gun = Gun(['http://localhost:8765/gun'])
}

const gunUser = gun.user()

if (process.env.NODE_ENV !== 'production') {
  window.gun = gun
  window.gunUser = gunUser
}

export { gun, gunUser, SEA }
