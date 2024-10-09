<script setup lang="ts">
import {
  UnlockOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined
} from '@ant-design/icons-vue'
import { reactive } from 'vue'
import * as arrayMove from 'array-move'
import InlineEditor from './InlineEditor.vue'
import type { ComponentData } from '@/types/edit.';

const props = defineProps<{
  list: ComponentData[]
  selectId: string
}>()

const emit = defineEmits<{
  change: [value: Object]
  select: [id: string]
  drop: [start: number, end: number]
}>()

let start = 0
let end = 0

const dragData = reactive({
  currentDragElementId: '',
  currentIndex: -1
})

function handleChange(id: string, key: string, value: boolean | string) {
  const data = {
    id,
    key,
    value,
    isRoot: true
  }
  emit('change', data)
}

function handleClick(id: string) {
  emit('select', id)
}

function onDragStart(event: DragEvent, id: string, index: number) {
  dragData.currentDragElementId = id
  dragData.currentIndex = index
}

function onDragEnter(index: number) {
  if (dragData.currentIndex !== index) {
    arrayMove.arrayMoveMutable(props.list, dragData.currentIndex, index)
    dragData.currentIndex = index
    end = index
  }
}

function onDrop() {
  emit('drop', start, end)
  dragData.currentDragElementId = ''
}

function onDropOver(e: DragEvent) {
  e.preventDefault()
}
</script>

<template>
  <ul :list="list">
    <li
      v-for="(item, index) in list"
      :key="item.id"
      class="ant-list-item"
      @click="handleClick(item.id)"
      :class="{
        active: item.id === selectId,
        tranparent: item.id === dragData.currentDragElementId
      }"
      draggable="true"
      @dragstart="onDragStart($event, item.id, index)"
      @drop="onDrop"
      @dragover="onDropOver"
      @dragenter="onDragEnter(index)"
      :data-index="index"
    >
      <a-tooltip :title="item.isHidden ? '显示' : '隐藏'">
        <a-button shape="circle" @click="handleChange(item.id, 'isHidden', !item.isHidden)">
          <template #icon v-if="item.isHidden"><EyeOutlined /> </template>
          <template #icon v-else><EyeInvisibleOutlined /> </template>
        </a-button>
      </a-tooltip>

      <a-tooltip :title="item.isLocked ? '解锁' : '锁定'">
        <a-button shape="circle" @click="handleChange(item.id, 'isLocked', !item.isLocked)">
          <template #icon v-if="item.isLocked"><UnlockOutlined /></template>
          <template #icon v-else> <LockOutlined /> </template>
        </a-button>
      </a-tooltip>

      <InlineEditor
        :value="item.layerName"
        @change="(value) => handleChange(item.id, 'layerName', value)"
      />
    </li>
  </ul>
</template>

<style scoped lang="less">
.ant-list-item {
  padding: 10px 15px;
  transition: all 0.5s ease-out;
  cursor: pointer;

  border: 1px solid #fff;
  border-bottom-color: #f0f0f0;
}
.ant-list-item .handle {
  cursor: move;
  margin-left: auto;
}
.ant-list-item.active {
  border: 1px solid #1890ff;
}
.ant-list-item:hover {
  background: #e6f7ff;
}
.ant-list-item > * {
  margin-right: 10px;
}
.ant-list-item button {
  font-size: 12px;
}

.tranparent {
  opacity: 0.5;
}
</style>
