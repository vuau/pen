export function debounce (func, waitTime) {
  var timeout
  return function () {
    clearTimeout(timeout)
    timeout = setTimeout(func, waitTime)
  }
}
