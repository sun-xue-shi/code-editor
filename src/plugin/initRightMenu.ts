import { useEditStore } from '@/stores/edit'
import type { ActionData } from '@/types/rightMenu'
import { createRightMenu } from '@/utils/edit'
import { onMounted, onUnmounted } from 'vue'

const editStore = useEditStore()
const { copyComponent, pasteComponent, deleteComponent } = editStore

export function initRightMenu() {
  let distoryRightMenu: Function
  const testActions: ActionData[] = [
    {
      action: (componentId: string) => {
        copyComponent(componentId)
      },
      shortCut: 'ctrl + c',
      text: '复制'
    },
    {
      action: () => {
        pasteComponent()
      },
      shortCut: 'ctrl + v',
      text: '粘贴'
    },
    {
      action: (componentId: string) => {
        deleteComponent(componentId)
      },
      shortCut: 'delete',
      text: '删除'
    }
  ]

  onMounted(() => {
    distoryRightMenu = createRightMenu(testActions)
  })

  onUnmounted(() => {
    if (typeof distoryRightMenu === 'function') {
      distoryRightMenu()
    }
  })
}
