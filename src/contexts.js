import Gun from 'gun/gun'
import SEA from 'gun/sea'
import 'gun/lib/not'
import 'gun/lib/then'
import 'gun/lib/webrtc'

let peers

if (process.env.NODE_ENV === 'production') {
  peers = [
    // https://github.com/amark/gun/wiki/volunteer.dht
    'https://www.raygun.live/gun',
    'https://gunmeetingserver.herokuapp.com/gun',
    'https://gun-us.herokuapp.com/gun',
    'https://gun-eu.herokuapp.com/gun',
    // My own relay peer
    'https://pensync.glitch.me/gun',
    'https://pvaklb.ddns.net/gun'
  ]
} else {
  peers = ['http://localhost:8765/gun']
}

const gun = new Gun({
  peers
})

const gunUser = gun.user()

if (process.env.NODE_ENV !== 'production') {
  window.gun = gun
  window.gunUser = gunUser
}

export { gun, gunUser, SEA }
