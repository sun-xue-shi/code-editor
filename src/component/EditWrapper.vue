<script setup lang="ts">
import type { EditWrapper, PositionType } from '@/types/edit.'
import { pick } from 'lodash-es'
import { computed, ref, nextTick } from 'vue'

type ResizerDirection = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
interface OriginalPosition {
  top: number
  left: number
  right: number
  bottom: number
}

const props = defineProps<EditWrapper>()
const emit = defineEmits<{
  (e: 'set-active', id: string): void
  (e: 'update-position', data: PositionType): void
}>()
const styles = computed(() => {
  return pick(props.props, ['position', 'top', 'left', 'height', 'width'])
})
const editWrapper = ref<null | HTMLElement>(null)
const gap = {
  x: 0,
  y: 0
}
const isMoving = ref(false)

function caculateMovePosition(e: MouseEvent) {
  const container = document.getElementById('canvas-area') as HTMLElement
  const left = e.clientX - gap.x - container?.getBoundingClientRect().left
  const top = e.clientY - gap.y - container.getBoundingClientRect().top + container.scrollTop
  return {
    left,
    top
  }
}

function startMove(e: MouseEvent) {
  const currentElement = editWrapper
  if (currentElement.value) {
    const { top, left } = currentElement.value.getBoundingClientRect()
    gap.x = e.clientX - left
    gap.y = e.clientY - top
  }
  function handleMove(e: MouseEvent) {
    const { left, top } = caculateMovePosition(e)
    if (currentElement.value) {
      isMoving.value = true
      currentElement.value.style.top = top + 'px'
      currentElement.value.style.left = left + 'px'
    }
  }
  function handleMouseUp(e: MouseEvent) {
    document.removeEventListener('mousemove', handleMove)
    if (isMoving.value) {
      const { left, top } = caculateMovePosition(e)
      emit('update-position', { left, top, id: props.id })
      isMoving.value = false
    }
    nextTick(() => {
      document.removeEventListener('mouseup', handleMouseUp)
    })
  }
  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleMouseUp)
}

function onItemClick(id: string) {
  emit('set-active', id)
}
function startResize(direction: ResizerDirection) {
  const currentElement = editWrapper.value as HTMLElement
  const { left, right, top, bottom } = currentElement.getBoundingClientRect()
  function handleMove(e: MouseEvent) {
    const size = caculateResizer(direction, e, { left, top, bottom, right })
    const { style } = currentElement
    if (size) {
      style.width = size.width + 'px'
      style.height = size.height + 'px'
      if (size.left) {
        style.left = size.left + 'px'
      }
      if (size.top) {
        style.top = size.top + 'px'
      }
    }
  }
  function handleMouseUp(e: MouseEvent) {
    document.removeEventListener('mousemove', handleMove)
    const size = caculateResizer(direction, e, { left, top, bottom, right })
    emit('update-position', { ...size, id: props.id })
    nextTick(() => {
      document.removeEventListener('mouseup', handleMouseUp)
    })
  }
  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleMouseUp)
}
function caculateResizer(dirction: ResizerDirection, e: MouseEvent, position: OriginalPosition) {
  const { clientX, clientY } = e
  const { left, right, top, bottom } = position
  const container = document.getElementById('canvas-area') as HTMLElement
  const rightWidth = clientX - left
  const leftWidth = right - clientX
  const bottomHeight = clientY - top
  const topHeight = bottom - clientY
  const offsetTop = clientY - container.getBoundingClientRect().top + container.scrollTop
  const offsetLeft = clientX - container.getBoundingClientRect().left
  switch (dirction) {
    case 'top-left':
      return {
        width: leftWidth,
        height: topHeight,
        top: offsetTop,
        left: offsetLeft
      }

    case 'top-right':
      return {
        width: rightWidth,
        height: topHeight,
        top: offsetTop
      }

    case 'bottom-left':
      return {
        width: leftWidth,
        height: bottomHeight,
        left: offsetLeft
      }

    case 'bottom-right':
      return {
        width: rightWidth,
        height: bottomHeight
      }
  }
}
</script>

<template>
  <div
    ref="editWrapper"
    :style="styles"
    class="edit-wrapper"
    :component-id="props.id"
    @click="onItemClick(props.id)"
    :class="{ active: props.active }"
    @mousedown="startMove"
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
  width: 100px;
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
  width: 100% !important;
  height: 100% !important;
  position: static !important;
}

.edit-wrapper.active .resizers .resizer {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: white;
  border: 3px solid #1890ff;
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
