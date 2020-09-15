import Gun from '@gooddollar/gun/gun'
import SEA from '@gooddollar/gun/sea'
import '@gooddollar/gun/lib/not'
import '@gooddollar/gun/lib/then'

let peers

if (process.env.NODE_ENV === 'production') {
  peers = ['https://pensync.glitch.me/gun']
} else {
  peers = ['http://localhost:8765/gun']
}

const gun = new Gun({
  peers
})

const gunUser = gun.user()

window.gun = gun
if (process.env.NODE_ENV !== 'production') {
  window.gunUser = gunUser
}

export { gun, gunUser, SEA }
