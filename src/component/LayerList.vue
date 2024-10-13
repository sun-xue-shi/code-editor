<script setup lang="ts">
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  UnlockOutlined,
  LockOutlined,
  DragOutlined
} from '@ant-design/icons-vue'
import InlineEdit from './InlineEdit.vue'
import draggable from 'vuedraggable'
import type { CompData } from '@/types/edit.'

interface ListType {
  list: CompData[]
  selectId: string | undefined
}

const props = defineProps<ListType>()
const emit = defineEmits<{
  change: [value: Object]
  select: [id: string]
}>()

function handleListChange(id: string, key: string, value: boolean | string) {
  const data = {
    id,
    key,
    value,
    isRoot: true
  }
  emit('change', data)
}
function handleSelect(id: string) {
  emit('select', id)
}
</script>

<template>
  <draggable
    :list="props.list"
    class="ant-list-items ant-list-bordered"
    ghost-class="ghost"
    handle=".handle"
  >
    <template #item="{ element }">
      <li
        class="ant-list-item"
        :key="element.id"
        :class="{ active: element.id === props.selectId }"
        @click="handleSelect(element.id)"
      >
        <a-tooltip :title="element.isHidden ? '隐藏' : '显示'">
          <a-button
            shape="circle"
            @click="handleListChange(element.id, 'isHidden', !element.isHidden)"
          >
            <template v-slot:icon v-if="element.isHidden"><EyeInvisibleOutlined /></template>
            <template v-slot:icon v-else><EyeOutlined /></template>
          </a-button>
        </a-tooltip>
        <a-tooltip :title="element.isLocked ? '锁定' : '解锁'">
          <a-button
            shape="circle"
            @click="handleListChange(element.id, 'isLocked', !element.isLocked)"
          >
            <template v-slot:icon v-if="element.isLocked"><LockOutlined /></template>
            <template v-slot:icon v-else><UnlockOutlined /> </template>
          </a-button>
        </a-tooltip>
        <InlineEdit
          :inline-obj="element.layerName"
          @change="
            (value = '') => {
              handleListChange(element.id, 'layerName', value)
            }
          "
        />
        <div>
          <a-tooltip title="'拖动排序'">
            <a-button shape="circle" class="handle">
              <template v-slot:icon><DragOutlined /></template>
            </a-button>
          </a-tooltip>
        </div>
      </li>
    </template>
  </draggable>
</template>

<style scoped lang="less">
.ant-list-item button {
  font-size: 12px;
}
.ant-list-item > * {
  margin-right: 10px;
}
.ant-list-item:hover {
  background-color: #e6f7ff;
}
.active {
  border: 1px solid #1890ff !important;
}
.ant-list-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  transition: all 0.5s ease-out;
  cursor: pointer;
  justify-content: normal;
  border: 1px solid #fff;
  border-bottom-color: #f0f0f0;
  .ghost {
    opacity: 0.5;
  }
}
</style>
