<script setup lang="ts">
import { message } from 'ant-design-vue'
import { computed, nextTick, ref, watch } from 'vue'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useKeypress } from '@/hooks/useKeyPress'

const props = defineProps<{
  value: string
}>()

const emit = defineEmits<{
  change: [value: string]
}>()

const innerValue = ref(props.value)

watch(
  () => props.value,
  (newVal) => {
    innerValue.value = newVal
  }
)
const isEditing = ref(false)

const inlineWapper = ref<null | HTMLElement>(null)
const inputRef = ref<null | HTMLElement>(null)

const isOutside = useClickOutside(inlineWapper)

const validateCheck = computed(() => {
  return innerValue.value.trim() !== ''
})

const handleClick = async () => {
  isEditing.value = true
  await nextTick()
  inputRef.value?.focus()
}

// watch(isEditing, (newval) => {
//   if (newval) {
//     isOutside.value = false
//   } else {
//     isOutside.value = true
//   }
// })

watch(isOutside, (newVal) => {
  console.log(isOutside.value)

  if (!validateCheck.value) {
    return message.error('内容不能为空!')
  }
  if (newVal && isEditing.value) {
    isEditing.value = false
    emit('change', innerValue.value)
  }
})

useKeypress('Enter', () => {
  if (!validateCheck.value) {
    return message.error('内容不能为空!')
  }
  if (isEditing.value) {
    isEditing.value = false
    emit('change', innerValue.value)
  }
})

useKeypress('Escape', () => {
  if (isEditing.value) {
    isEditing.value = false
    innerValue.value = props.value
  }
})
</script>

<template>
  <div class="inline-editor" ref="inlineWapper" @click="handleClick">
    <a-input
      v-model:value="innerValue"
      v-if="isEditing"
      :class="{ 'input-error': !validateCheck }"
      placeholder="文本内容不能为空"
      ref="inputRef"
    />
    <slot v-else>{{ innerValue }}</slot>
  </div>
</template>

<style scoped lang="less">
.ant-input {
  width: 100%;
}

.inline-editor {
  display: inline-block;
  width: 120px;
}

.input-error {
  border: 1px solid #f5222d;
}
</style>
