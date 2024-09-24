<script setup lang="ts">
import {
  UnlockOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined
} from '@ant-design/icons-vue'
import { type ComponentData } from 'editor-components-sw'
import InlineEditor from './InlineEditor.vue'

defineProps<{
  list: ComponentData[]
  selectId: string
}>()

const emit = defineEmits<{
  change: [value: Object]
  select: [id: string]
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
  <ul :list="list">
    <li
      v-for="item in list"
      :key="item.id"
      class="ant-list-item"
      @click="handleClick(item.id)"
      :class="{ active: item.id === selectId }"
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
</style>
