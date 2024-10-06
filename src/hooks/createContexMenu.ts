import { createVNode, render } from 'vue'
import ContextMenu from '@/component/ContextMenu.vue'
import type { ItemType } from '@/types/edit.'

function createContexMenu(actionItem: ItemType[], triggerClass = 'edit-wrapper') {
  const container = document.createElement('div')
  const options = {
    actionItem,
    triggerClass
  }
  const vm = createVNode(ContextMenu, options)
  render(vm, container)
  document.body.appendChild(container)
  return () => {
    render(null, container)
    document.body.removeChild(container)
  }
}

export default createContexMenu
