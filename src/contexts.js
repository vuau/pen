import Gun from 'gun/gun'
import 'gun/sea'

const gun = Gun(['https://pensync.glitch.me/gun'])
window.gun = gun

export { gun }
