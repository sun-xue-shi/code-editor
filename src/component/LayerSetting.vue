<script setup lang="ts">
import {
  UnlockOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  DragOutlined
} from '@ant-design/icons-vue'
import draggable from 'vuedraggable'
import InlineEditor from './InlineEditor.vue'
import type { ComponentData } from '@/types/edit.'

defineProps<{
  list: ComponentData[]
  selectId: string | undefined
}>()

const emit = defineEmits<{
  change: [value: Object]
  select: [id: string]
  drop: [start: number, end: number]
}>()

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
</script>

<template>
  <draggable :list="list" ghost-class="ghost" handle=".handle" animation="1000">
    <template #item="{ element }">
      <li
        class="ant-list-item"
        @click="handleClick(element.id)"
        :class="{
          active: element.id === selectId
        }"
      >
        <a-tooltip :title="element.isHidden ? '显示' : '隐藏'">
          <a-button shape="circle" @click="handleChange(element.id, 'isHidden', !element.isHidden)">
            <template #icon v-if="element.isHidden"><EyeOutlined /> </template>
            <template #icon v-else><EyeInvisibleOutlined /> </template>
          </a-button>
        </a-tooltip>

        <a-tooltip :title="element.isLocked ? '解锁' : '锁定'">
          <a-button shape="circle" @click="handleChange(element.id, 'isLocked', !element.isLocked)">
            <template #icon v-if="element.isLocked"><UnlockOutlined /></template>
            <template #icon v-else> <LockOutlined /> </template>
          </a-button>
        </a-tooltip>

        <InlineEditor
          class="inline-editor"
          :value="element.layerName"
          @change="(value) => handleChange(element.id, 'layerName', value)"
        />
        <a-tooltip title="拖动排序">
          <a-button shape="circle" class="handle">
            <template #icon><DragOutlined /> </template>
          </a-button>
        </a-tooltip>
      </li>
    </template>
  </draggable>
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
  position: absolute;
  cursor: move;
  // margin-left: 30%;
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

.ghost {
  opacity: 0.5;
}
</style>
