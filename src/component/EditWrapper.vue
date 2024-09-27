<script setup lang="ts">
import type { EditWrapper } from '@/types/edit.'
import { pick } from 'lodash-es'
import { nextTick } from 'vue'
import { computed, ref } from 'vue'

const props = defineProps<EditWrapper>()
const emit = defineEmits<{
  setActive: [id: string]
  updatePosition: [{ id: string; innerTop: number; innerLeft: number }]
}>()

let isMoved = false
const editWapper = ref<null | HTMLElement>(null)
const offsetData = {
  x: 0,
  y: 0
}

function onItemClick(id: string) {
  emit('setActive', id)
}

const styles = computed(() => pick(props.props, ['top', 'left', 'position', 'width', 'height']))

function calcPosition(e: MouseEvent) {
  const container = document.getElementById('canvas-area') as HTMLElement

  const { x, y } = container.getBoundingClientRect()

  const innerLeft = e.clientX - offsetData.x - x
  const innerTop = e.clientY - offsetData.y - y

  return {
    innerLeft,
    innerTop
  }
}

function startMove(e: MouseEvent) {
  const currentElement = editWapper.value
  if (currentElement) {
    //元素相对于视口的位置
    const { left, top } = currentElement.getBoundingClientRect()

    //鼠标点击处相对于视口位置 - 元素本身相对于视口位置 ----- 点击处在元素内部的相对位置(偏移量)
    offsetData.x = e.clientX - left
    offsetData.y = e.clientY - top

    const handleMove = (e: MouseEvent) => {
      console.log('moving')

      isMoved = true
      console.log(isMoved)

      const { innerLeft, innerTop } = calcPosition(e)
      if (currentElement) {
        currentElement.style.top = innerTop + 'px'
        currentElement.style.left = innerLeft + 'px'
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      console.log('endmove')

      document.removeEventListener('mousemove', handleMove)

      console.log('delete move event')

      if (isMoved) {
        const { innerLeft, innerTop } = calcPosition(e)
        emit('updatePosition', { innerLeft, innerTop, id: props.id })
        isMoved = false
      }
      nextTick(() => {
        document.removeEventListener('mouseup', handleMouseUp)
      })
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleMouseUp)
  }
}
</script>

<template>
  <div
    class="edit-wrapper"
    :style="styles"
    @click="onItemClick(props.id)"
    @mousedown="startMove"
    ref="editWapper"
    :class="{ active: props.active }"
  >
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
.edit-wrapper.active {
  border: 1px solid #1890ff;
  user-select: none;
  z-index: 1500;
}
.edit-wrapper .l-text-component,
.edit-wrapper .l-image-component,
.edit-wrapper .l-shape-component {
  position: static !important;
}
.edit-wrapper.active .resizers .resizer {
  width: 10px;
  height: 10px;
  border-radius: 50%; /*magic to turn square into circle*/
  background: white;
  border: 3px solid #1890ff;
  position: absolute;
  display: block;
}
.edit-wrapper .resizers .resizer.top-left {
  left: -5px;
  top: -5px;
  cursor: nwse-resize; /*resizer cursor*/
}
.edit-wrapper .resizers .resizer.top-right {
  right: -5px;
  top: -5px;
  cursor: nesw-resize;
}
.edit-wrapper .resizers .resizer.bottom-left {
  left: -5px;
  bottom: -5px;
  cursor: nesw-resize;
}
.edit-wrapper .resizers .resizer.bottom-right {
  right: -5px;
  bottom: -5px;
  cursor: nwse-resize;
}
</style>
