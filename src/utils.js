export function debounce (func, waitTime) {
  var timeout
  return function () {
    clearTimeout(timeout)
    timeout = setTimeout(func, waitTime)
  }
}

export const whenEnter = (cb) => (e) => e.code === 'Enter' && cb()
export const whenEsc = (cb) => (e) => e.code === 'Escape' && cb()
