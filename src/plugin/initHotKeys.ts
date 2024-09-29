import { useFastKeys } from '@/hooks/useFastKeys'
import { useEditStore } from '@/stores/edit'
import type { HotkeysEvent, KeyHandler } from 'hotkeys-js'
import { computed } from 'vue'

const preventEventDefault = (cb: KeyHandler) => {
  const wrapHandler = (e: KeyboardEvent, event: HotkeysEvent) => {
    e.preventDefault()
    cb(e, event)
  }

  return wrapHandler
}

export function initFastKeys() {
  const editStore = useEditStore()
  const { editInfo, copyComponent, pasteComponent, deleteComponent, setActive, moveComponent } =
    editStore
  const currentElement = computed(() => editInfo.currentElement)

  useFastKeys('ctrl+c', () => {
    copyComponent(currentElement.value)
  })

  useFastKeys('ctrl+v', () => {
    pasteComponent()
  })

  useFastKeys('delete,backspace', () => {
    deleteComponent(currentElement.value)
  })

  useFastKeys('esc', () => {
    setActive('')
  })

  useFastKeys(
    'up',
    preventEventDefault(() => {
      moveComponent('up', { id: currentElement.value, value: '1' })
    })
  )

  useFastKeys(
    'left',
    preventEventDefault(() => {
      moveComponent('left', { id: currentElement.value, value: '1' })
    })
  )

  useFastKeys(
    'right',
    preventEventDefault(() => {
      moveComponent('right', { id: currentElement.value, value: '1' })
    })
  )

  useFastKeys(
    'down',
    preventEventDefault(() => {
      moveComponent('down', { id: currentElement.value, value: '1' })
    })
  )
}
