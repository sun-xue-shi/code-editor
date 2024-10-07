<script setup lang="ts">
import { useEditStore } from '@/stores/edit'
import { computed } from 'vue'
import { UndoOutlined, RedoOutlined } from '@ant-design/icons-vue'

const editStore = useEditStore()
const { toLastStep, toNextStep } = editStore
const histories = computed(() => editStore.editInfo.history)
const historyIndex = computed(() => editStore.editInfo.historyIndex)

//历史记录不存在 / 已经是最新的了 / 没有撤销过
const isRedoDisabled = computed(
  () =>
    histories.value.length === 0 ||
    historyIndex.value === histories.value.length ||
    historyIndex.value === -1
)

//历史记录不存在 / 撤销到刚开始的了
const isUndoDisabled = computed(() => histories.value.length === 0 || historyIndex.value === 0)
</script>

<template>
  <div class="operation-list">
    <a-tooltip title="撤销">
      <a-button shape="circle" @click="toLastStep" :disabled="isUndoDisabled">
        <template #icon><UndoOutlined /> </template>
      </a-button>
    </a-tooltip>
    <a-tooltip title="重做">
      <a-button shape="circle" @click="toNextStep" :disabled="isRedoDisabled">
        <template #icon><RedoOutlined /> </template>
      </a-button>
    </a-tooltip>

    <li v-for="(item, index) in histories" :key="item.id">
      <span> {{ historyIndex }}</span>
      <span :class="{ bold: index === historyIndex }">
        {{ item.type }} - {{ item.data.preData }}
      </span>
    </li>
  </div>
</template>

<style scoped lang="less">
.history-area {
  position: absolute;
  right: 0;
}
.operation-list {
  position: relative;
  top: 0;
  left: 45%;
}
.shortcut-list {
  list-style-type: none;
  padding: 0;
  width: 300px;
  margin: 0 auto;
}
.shortcut-list-item {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.shortcut-list .text {
  color: rgba(0, 0, 0, 0.45);
}
.operation-list button {
  margin-left: 10px;
}
.bold {
  font-weight: 700;
}
.shortcut-list .bold {
  color: #1890ff;
}
</style>
