import { usePastKeys } from '@/hooks/usePastKeys'
import { useEditStore } from '@/stores/edit'
import { computed } from 'vue'

export function initFastKeys() {
  const editStore = useEditStore()
  const { editInfo, copyComponent, pasteComponent, deleteComponent, setActive } = editStore
  const currentElement = computed(() => editInfo.currentElement)

  usePastKeys('ctrl+c', () => {
    console.log('currentElement', currentElement.value)
    copyComponent(currentElement.value)
  })

  usePastKeys('ctrl+v', () => {
    pasteComponent()
  })

  usePastKeys('delete,backspace', () => {
    deleteComponent(currentElement.value)
  })

  usePastKeys('esc', () => {
    setActive('')
  })
}
