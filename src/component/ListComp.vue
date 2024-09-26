<script setup lang="ts">
import { v4 } from 'uuid'
import { TextComp, type ComponentData } from 'editor-components-sw'
import type { TextComponentProps } from '@/types/props'
import { TextPropsList } from '@/common/constants'
import ImageUploader from './ImageUploader.vue'

const emit = defineEmits<{
  (e: 'add-item', newData: ComponentData): void
}>()

const addItem = (props: Partial<TextComponentProps>) => {
  const newData: ComponentData = {
    id: v4(),
    name: 'ListComp',
    props
  }
  emit('add-item', newData)
}
</script>

<template>
  <div class="list-comp">
    <div class="list-item" v-for="item in TextPropsList" :key="item.tag">
      <TextComp v-bind="item" @click="addItem(item)" />
    </div>
    <ImageUploader />
  </div>
</template>

<style scoped lang="less">
.list-comp > * {
  margin-top: 10px;
}
</style>
