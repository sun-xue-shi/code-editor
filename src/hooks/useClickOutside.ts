import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export function useClickOutside(elementRef: Ref<null | HTMLElement>) {
  const isOutside = ref(false)
  const handler = (e: MouseEvent) => {
    if (elementRef.value && e.target) {
      if (elementRef.value.contains(e.target as HTMLElement)) {
        isOutside.value = false
      } else {
        isOutside.value = true
      }
    }
  }

  onMounted(() => {
    document.addEventListener('click', handler)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })

  return isOutside
}
