<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import useKeyPress from '@/hooks/useKeyPress'
import useClickOutside from '@/hooks/useClickOutside'

interface InlineType {
  inlineObj: string | undefined
}

const props = defineProps<InlineType>()
const emit = defineEmits<{ change: [value: string | undefined] }>()
const innerValue = ref(props.inlineObj)
const isEditing = ref(false)
let cacheValue: string | undefined
const wrapper = ref<null | HTMLElement>(null)
const inputRef = ref<null | HTMLInputElement>(null)
const isClickOutside = useClickOutside(wrapper)

function handleClick() {
  isEditing.value = true
}
watch(
  () => props.inlineObj,
  (newVal) => {
    innerValue.value = newVal
  }
)

watch(isEditing, async (isEditing) => {
  if (isEditing) {
    cacheValue = innerValue.value
    await nextTick()
    if (inputRef.value) {
      inputRef.value.focus()
    }
  }
})

watch(isClickOutside, (newValue) => {
  if (newValue && isEditing.value) {
    isEditing.value = false
    emit('change', innerValue.value)
  }
})

useKeyPress('Enter', () => {
  if (isEditing.value) {
    isEditing.value = false
    emit('change', innerValue.value)
  }
})

useKeyPress('Escape', () => {
  if (isEditing.value) {
    isEditing.value = false
    innerValue.value = cacheValue
  }
})
</script>

<template>
  <div class="inline-edit" @click="handleClick" ref="wrapper">
    <input v-model="innerValue" placeholder="文本不能为空" ref="inputRef" v-if="isEditing" />
    <slot v-else>{{ innerValue }}</slot>
  </div>
</template>

<style scoped lang="less"></style>
