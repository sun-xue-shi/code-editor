export function insertAt(arr: any[], index: number, newItem: any) {
  return [...arr.slice(0, index), newItem, ...arr.slice(index)]
}

export function getParent(e: Event, className: string) {
  let el = e.target as HTMLElement
  if (el.classList.contains(className)) {
    return el
  } else {
    while (el) {
      if (el.classList && el.classList.contains(className)) {
        return el
      } else {
        el = el.parentNode as HTMLElement
      }
    }
  }
  return false
}
