import Gun from 'gun/gun'
import SEA from 'gun/sea'

let gun

if (process.env.NODE_ENV === 'production') {
  gun = Gun(['https://pensync.glitch.me/gun'])
} else {
  localStorage.clear()
  gun = Gun()
}
window.gun = gun

export { gun, SEA }
