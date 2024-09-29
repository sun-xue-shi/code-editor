export function debounce(cb: (...args: any) => void, timeout = 1000) {
  let timer = 0
  return (...args: any) => {
    clearTimeout(timer)
    timer = window.setTimeout(() => {
      cb(...args)
    }, timeout)
  }
}
