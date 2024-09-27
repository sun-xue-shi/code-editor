import hotkeys from 'hotkeys-js'
import { type KeyHandler } from 'hotkeys-js'
import { onMounted, onUnmounted } from 'vue'

export const usePastKeys = (key: string, cb: KeyHandler) => {
  onMounted(() => {
    hotkeys(key, cb)
  })

  onUnmounted(() => {
    hotkeys.unbind(key, cb)
  })
}
