<script setup lang="ts">
import { useEditStore } from '@/stores/edit'
import { RedoOutlined, UndoOutlined } from '@ant-design/icons-vue'
import { computed } from 'vue'

const emit = defineEmits<{ (e: 'undo'): void; (e: 'redo'): void }>()

const editorStore = useEditStore()
const { editInfo, checkRedoDisable, checkUndoDisable } = editorStore
const hisories = computed(() => editInfo.histories)
const historyIndex = computed(() => editInfo.historyIndex)
const undoDisable = computed(() => {
  return checkUndoDisable(editInfo)
})
const redoDisable = computed(() => checkRedoDisable(editInfo))

function undoHistory() {
  emit('undo')
}
function redoHistory() {
  emit('redo')
}
</script>

<template>
  <div class="history-area">
    <div class="opration-list">
      <a-tooltip>
        <template #title>撤销</template>
        <a-button shape="circle" @click="undoHistory" :disabled="undoDisable" class="leftBtn">
          <template #icon><UndoOutlined /></template>
        </a-button>
      </a-tooltip>
      <a-tooltip>
        <template #title>重做</template>
        <a-button shape="circle" @click="redoHistory" :disabled="redoDisable">
          <template #icon><RedoOutlined /></template>
        </a-button>
      </a-tooltip>
    </div>
    <li v-for="(item, index) in hisories" :key="index">
      <span :class="{ bold: index === historyIndex }">{{ item.type }}-{{ item.data }}</span>
    </li>
  </div>
</template>

<style scoped lang="less">
.opration-list {
  position: absolute;
  right: 10px;
  top: 20px;
}
.leftBtn {
  margin-right: 5px;
}
</style>
