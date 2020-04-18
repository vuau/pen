import Gun from 'gun/gun'
import SEA from 'gun/sea'

let gun

if (process.env.NODE_ENV === 'production') {
  gun = Gun(['https://pensync.glitch.me/gun'])
} else {
  gun = Gun(['https://gun-us.herokuapp.com/gun'])
  window.gun = gun
}

export { gun, SEA }
