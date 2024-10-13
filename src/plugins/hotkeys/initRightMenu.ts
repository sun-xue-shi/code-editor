import createContexMenu from '@/hooks/createContexMenu'
import { useEditStore } from '@/stores/edit'
import type { ItemType } from '@/types/edit.'
import { onMounted, onUnmounted } from 'vue'

function initRightMenu() {
  const editStore = useEditStore()
  const { editInfo, deleteComponet, copyComponent, pasteCopyComponnet } = editStore
  const actionItem: ItemType[] = [
    {
      action: (id: string | undefined) => {
        if (id) copyComponent(editInfo, id)
      },
      rightText: 'ctrl + c',
      leftText: '复制'
    },
    {
      action: () => {
        pasteCopyComponnet(editInfo)
      },
      rightText: 'ctrl + v',
      leftText: '粘贴'
    },
    {
      leftText: '删除图层',
      rightText: 'Backspace/Delete',
      action: (id: string | undefined) => {
        if (id) {
          deleteComponet(editInfo, id)
        }
      }
    }
  ]

  let destroy: () => void

  onMounted(() => {
    destroy = createContexMenu(actionItem)
  })
  onUnmounted(() => {
    destroy()
  })
}

export default initRightMenu
