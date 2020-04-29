import Gun from 'gun/gun'
import SEA from 'gun/sea'
import 'gun/lib/not'
import 'gun/lib/then'

let gun

if (process.env.NODE_ENV === 'production') {
  gun = Gun(['https://pensync.glitch.me/gun'])
} else {
  gun = Gun()
  window.gun = gun
  localStorage.clear()
}

const gunUser = gun.user()

export { gun, gunUser, SEA }
