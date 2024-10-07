<script setup lang="ts">
import { v4 } from 'uuid'
import { TextComp, textDefaultProps } from 'editor-components-sw'
import type { TextComponentProps } from '@/types/props'
import { TextPropsList } from '@/common/constants'
import ImageUploader from '../../../component/ImageUploader.vue'
import type { ComponentData } from '@/types/edit.'
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'add-item', newData: ComponentData): void
}>()

function createNewItem(props: Partial<TextComponentProps>) {
  const newItem: ComponentData = {
    id: v4(),
    name: 'text-comp',
    layerName: '',
    isLocked: false,
    isHidden: false,
    props: {
      ...textDefaultProps,
      ...props
    }
  }

  return newItem
}

const offsetData = {
  x: 0,
  y: 0
}

const addItem = (props: Partial<TextComponentProps>) => {
  const newItem = createNewItem(props)
  emit('add-item', newItem)
}

function handleDragstart(event: DragEvent, props: Partial<TextComponentProps>) {
  const newItem = createNewItem(props)
  event.dataTransfer!.setData('data', JSON.stringify(newItem))
  event.dataTransfer!.setData('position', JSON.stringify(offsetData))
}

function handleMousedown(e: MouseEvent, index: number) {
  const ele = document.getElementById(`dragtarget-${index}`) as HTMLElement

  const { x, y } = ele.getBoundingClientRect()
  const { clientX, clientY } = e

  offsetData.x = clientX - x
  offsetData.y = clientY - y
}
</script>

<template>
  <div class="list-comp">
    <div
      class="list-item"
      v-for="(item, index) in TextPropsList"
      :key="item.tag"
      :id="`dragtarget-${index}`"
    >
      <TextComp
        v-bind="item"
        @click="addItem(item)"
        :style="{ position: 'static' }"
        draggable="true"
        @dragstart="handleDragstart($event, item)"
        @mousedown="handleMousedown($event, index)"
      />
    </div>
    <ImageUploader />
  </div>
</template>

<style scoped lang="less">
.list-comp > * {
  margin-top: 10px;
}
.list-item {
  cursor: pointer;
}
</style>
