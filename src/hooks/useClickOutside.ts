import { onMounted, onUnmounted, ref, type Ref } from 'vue'

const useClickOutside = (elementRef: Ref<null | HTMLElement>) => {
  const isClickOutside = ref(false)
  const handle = (e: MouseEvent) => {
    if (elementRef.value && e.target) {
      if (elementRef.value.contains(e.target as HTMLElement)) {
        isClickOutside.value = false
      } else {
        isClickOutside.value = true
      }
    }
  }
  onMounted(() => {
    document.addEventListener('click', handle)
  })
  onUnmounted(() => {
    document.removeEventListener('click', handle)
  })
  return isClickOutside
}

export default useClickOutside
