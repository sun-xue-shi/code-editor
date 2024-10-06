<script setup lang="ts">
import type { ItemType } from '@/types/edit.'
import { getParent } from '@/utils/helper'
import { onMounted, onUnmounted, ref } from 'vue'

interface ActionType {
  actionItem: ItemType[]
  id: string
  triggerClass: string
}

const props = withDefaults(defineProps<ActionType>(), { triggerClass: 'edit-wrapper' })
const compId = ref('')
const menuRef = ref<HTMLElement | null>(null)

function triggerContexMenu(e: MouseEvent) {
  const domElement = menuRef.value
  const wrapperElement = getParent(e, props.triggerClass)
  if (wrapperElement && domElement) {
    e.preventDefault()
    domElement.style.display = 'block'
    domElement.style.top = e.clientY + 'px'
    domElement.style.left = e.clientX + 'px'
    const cid = wrapperElement.getAttribute('component-id')
    if (cid) {
      compId.value = cid
    }
  }
}
function handleClick() {
  const domElement = menuRef.value
  if (domElement) {
    domElement.style.display = 'none'
  }
}
onMounted(() => {
  document.addEventListener('contextmenu', triggerContexMenu)
  document.addEventListener('click', handleClick)
})
onUnmounted(() => {
  document.removeEventListener('contextmenu', triggerContexMenu)
  document.removeEventListener('click', handleClick)
})
</script>

<template>
  <div class="menu-container" ref="menuRef">
    <div class="ant-menu">
      <li
        v-for="(action, index) in props.actionItem"
        :key="index"
        @click="action.action(compId)"
        class="ant-menu-item"
        style="height: 30px"
      >
        <span class="item-leftText">{{ action.leftText }}</span>
        <span class="item-rightText">{{ action.rightText }}</span>
      </li>
    </div>
  </div>
</template>

<style scoped lang="less">
.menu-container {
  display: none;
  position: absolute;
  background: #fff;
  z-index: 2000;
  width: 250px;
}
.menu-container .ant-menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2px;
  cursor: pointer;
}
.menu-container .ant-menu-item:hover {
  background: #efefef;
}
.ant-menu-item .item-rightText {
  color: #ccc;
}
</style>
