<script setup lang="ts">
import type { EditWrapper } from '@/types/edit.'
import { pick } from 'lodash-es'
import { computed, ref, nextTick } from 'vue'

const props = defineProps<EditWrapper>()
const emit = defineEmits<{
  setActive: [id: string]
  updatePosition: [value: Record<string, any>]
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

const styles = computed(() =>
  pick(props.props, ['top', 'left', 'position', 'width', 'height', 'fontSize'])
)

function calcPosition(e: MouseEvent) {
  const container = document.getElementById('canvas-area') as HTMLElement

  const { x, y } = container.getBoundingClientRect()

  const left = e.clientX - offsetData.x - x
  const top = e.clientY - offsetData.y - y + container.scrollTop //有滚动条要加上滚动的距离

  return {
    left,
    top
  }
}

function handleMousedown(e: MouseEvent) {
  const currentElement = editWapper.value
  if (currentElement) {
    //元素相对于视口的位置
    const { left, top } = currentElement.getBoundingClientRect()

    //鼠标点击处相对于视口位置 - 元素本身相对于视口位置 ----- 点击处在元素内部的相对位置(偏移量)
    offsetData.x = e.clientX - left
    offsetData.y = e.clientY - top

    const handleMove = (e: MouseEvent) => {
      isMoved = true

      const { left, top } = calcPosition(e)
      if (currentElement) {
        currentElement.style.top = top + 'px'
        currentElement.style.left = left + 'px'
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      document.removeEventListener('mousemove', handleMove)

      if (isMoved) {
        const { left, top } = calcPosition(e)
        emit('updatePosition', { left, top, id: props.id })
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

function calcSize(
  location: string,
  e: MouseEvent,
  originalPosition: {
    top: number
    left: number
    right: number
    bottom: number
    fontSize?: string
    height?: number
  }
) {
  const container = document.getElementById('canvas-area') as HTMLElement
  const { bottom, left, right, top, fontSize, height } = originalPosition
  const { clientX, clientY } = e

  let topFontSize
  let downFontSize
  const upHeight = bottom - clientY
  const downHeight = clientY - top
  const rightWidth = clientX - left
  const leftWidth = right - clientX
  const leftOffset = clientX - container.offsetLeft
  const topOffset = clientY - container.offsetTop + container.scrollTop //有滚动条时要加上滚动的距离
  // console.log('fontSize', parseInt(fontSize))
  if (fontSize && height) {
    topFontSize = parseInt(fontSize) * (upHeight / height)
    downFontSize = parseInt(fontSize) * (downHeight / height)
  }

  switch (location) {
    case 'top-left':
      return {
        width: leftWidth,
        height: upHeight,
        top: topOffset,
        left: leftOffset,
        fontSize: topFontSize
      }

    case 'top-right':
      return {
        width: rightWidth,
        height: upHeight,
        top: topOffset,
        fontSize: topFontSize
      }

    case 'bottom-left':
      return {
        width: leftWidth,
        height: downHeight,
        left: leftOffset,
        fontSize: downFontSize
      }

    case 'bottom-right':
      return {
        width: rightWidth,
        height: downHeight,
        fontSize: downFontSize
      }
  }
}

function startResize(location: string) {
  const currentElement = editWapper.value as HTMLElement
  const fontSize = currentElement.style.fontSize
  const { left, top, bottom, right, height } = currentElement.getBoundingClientRect()

  const handleMove = (e: MouseEvent) => {
    const size = calcSize(location, e, { left, right, top, bottom })

    const { style } = currentElement
    if (size) {
      style.width = size.width + 'px'
      style.height = size.height + 'px'
      size.left && (style.left = size.left + 'px')
      size.top && (style.top = size.top + 'px')
    }
  }

  const handleMouseUp = (e: MouseEvent) => {
    document.removeEventListener('mousemove', handleMove)
    const size = calcSize(location, e, { left, right, top, bottom, fontSize, height })

    emit('updatePosition', { ...size, id: props.id })
    nextTick(() => {
      document.removeEventListener('mouseup', handleMouseUp)
    })
  }

  document.addEventListener('mouseup', handleMouseUp)
  document.addEventListener('mousemove', handleMove)
}
</script>

<template>
  <div
    class="edit-wrapper"
    :style="styles"
    :data-component-id="id"
    @click="onItemClick(props.id)"
    @mousedown="handleMousedown"
    ref="editWapper"
    :class="{ active: props.active }"
  >
    <slot></slot>

    <div class="resizers">
      <div class="resizer top-left" @mousedown.stop="startResize('top-left')"></div>
      <div class="resizer top-right" @mousedown.stop="startResize('top-right')"></div>
      <div class="resizer bottom-left" @mousedown.stop="startResize('bottom-left')"></div>
      <div class="resizer bottom-right" @mousedown.stop="startResize('bottom-right')"></div>
    </div>
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
  border: 2px solid #1890ff;
  user-select: none;
  z-index: 2;
}

.edit-wrapper > * {
  position: static !important;
}

.edit-wrapper.active .resizers .resizer {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: white;
  border: 1px solid #1890ff;
  position: absolute;
  display: block;
}
.edit-wrapper .resizers .resizer.top-left {
  left: -5px;
  top: -5px;
  cursor: nwse-resize;
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
