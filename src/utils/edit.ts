import type { ActionData } from '@/types/rightMenu'
import { createVNode, render } from 'vue'
import RightMenu from '@/component/RightMenu.vue'

export function debounce(cb: (...args: any) => void, timeout = 1000) {
  let timer = 0
  return (...args: any) => {
    clearTimeout(timer)
    timer = window.setTimeout(() => {
      cb(...args)
    }, timeout)
  }
}

export function clickInsideElement(e: Event, className: string) {
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

export function createRightMenu(actionData: ActionData[], className = 'edit-wrapper') {
  const container = document.createElement('div')
  const vm = createVNode(RightMenu, { actionData, className })
  render(vm, container)
  document.body.appendChild(container)

  return () => {
    render(null, container)
    document.body.removeChild(container)
  }
}
