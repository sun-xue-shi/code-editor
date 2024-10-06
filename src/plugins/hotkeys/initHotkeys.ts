import { computed } from 'vue'
import useHotKeys from './useHotKeys'
import { useEditStore } from '@/stores/edit'
import type { HotkeysEvent, KeyHandler } from 'hotkeys-js'

function wrap(callback: KeyHandler) {
  const wrapFn = (e: KeyboardEvent, event: HotkeysEvent) => {
    e.preventDefault()
    callback(e, event)
  }
  return wrapFn
}

export default function initHotkeys() {
  const editStore = useEditStore()
  const { editInfo, setActive, copyComponent, pasteCopyComponnet, deleteComponet, moveComponent } =
    editStore
  const currentId = computed(() => editInfo.currentElement)
  useHotKeys('ctrl+c,command+c', () => {
    copyComponent(editInfo, currentId.value)
  })
  useHotKeys('ctrl+v,command+v', () => {
    pasteCopyComponnet(editInfo)
  })
  useHotKeys('backspace,delete', () => {
    deleteComponet(editInfo, currentId.value)
  })
  useHotKeys('esc', () => {
    setActive(editInfo, '')
  })
  useHotKeys(
    'up',
    wrap(() => {
      moveComponent(editInfo, { direction: 'Up', amount: 1, id: currentId.value })
    })
  )
  useHotKeys(
    'down',
    wrap(() => {
      moveComponent(editInfo, { direction: 'Down', amount: 1, id: currentId.value })
    })
  )
  useHotKeys(
    'left',
    wrap(() => {
      moveComponent(editInfo, { direction: 'Left', amount: 1, id: currentId.value })
    })
  )
  useHotKeys(
    'right',
    wrap(() => {
      moveComponent(editInfo, { direction: 'Right', amount: 1, id: currentId.value })
    })
  )
}
