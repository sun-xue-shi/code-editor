<script setup lang="ts">
import type { EditWrapper } from '@/types/edit.'

const props = defineProps<EditWrapper>()
const emit = defineEmits<{
  (e: 'set-active', id: string): void
}>()

function onItemClick(id: string) {
  emit('set-active', id)
}
</script>

<template>
  <div class="edit-wrapper" @click="onItemClick(props.id)" :class="{ active: props.active }">
    <slot></slot>
  </div>
</template>

<style scoped lang="less">
.edit-wrapper {
  padding: 0px;
  cursor: pointer;
  border: 1px solid transparent;
  user-select: none;
}
.edit-wrapper:hover {
  border: 1px dashed #ccc;
}
.active {
  border: 1px solid #1890ff;
  user-select: none;
  z-index: 1500;
}
</style>
