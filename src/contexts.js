import Gun from '@gooddollar/gun/gun'
import SEA from '@gooddollar/gun/sea'
import '@gooddollar/gun/lib/not'
import '@gooddollar/gun/lib/then'
import '@gooddollar/gun/lib/path'

Gun.on('opt', function (ctx) {
  if (ctx.once) {
    return
  }
  ctx.on('out', function (msg) {
    var to = this.to
    // Adds headers for put
    msg.headers = {
      token: 'thisIsTheTokenForRealsAuAuAu'
    }
    to.next(msg) // pass to next middleware
  })
})

let peers

if (process.env.NODE_ENV === 'production') {
  peers = ['https://pensync.glitch.me/gun', 'https://gun-us.herokuapp.com/gun', 'https://iris.cx/gun']
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
