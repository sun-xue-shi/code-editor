import hotkeys, { type KeyHandler } from 'hotkeys-js'
import { onMounted, onUnmounted } from 'vue'

const useHotKeys = (key: string, callback: KeyHandler) => {
  onMounted(() => {
    hotkeys(key, callback)
  })
  onUnmounted(() => {
    hotkeys.unbind(key, callback)
  })
}

export default useHotKeys
