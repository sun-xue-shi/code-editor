<template>
  <div class="context-menu-component menu-container" ref="menuRef">
    <a-menu mode="vertical" style="width: 220px; border: 1px solid #ccc" :selectable="false">
      <a-menu-item
        v-for="action in actionData"
        :key="action.text"
        @click="action.action(componentId)"
      >
        <span class="item-text">{{ action.text }}</span>
        <span class="item-shortcut">{{ action.shortCut }}</span>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script lang="ts" setup>
import type { ActionData } from '@/types/rightMenu'
import { clickInsideElement } from '@/utils/edit'
import { onMounted, onUnmounted } from 'vue'
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    actionData: ActionData[]
    className: string
  }>(),
  {
    className: 'edit-wrapper'
  }
)

const menuRef = ref<null | HTMLElement>(null)
const componentId = ref('')

const handleRightMenu = (e: MouseEvent) => {
  const rightDom = menuRef.value as HTMLElement
  const editWapperElement = clickInsideElement(e, props.className)
  if (editWapperElement) {
    e.preventDefault()
    rightDom.style.display = 'block'
    rightDom.style.left = e.clientX + 'px'
    rightDom.style.top = e.clientY + 'px'
    componentId.value = editWapperElement.dataset.componentId as string
  }
}

const handleClick = () => {
  const rightDom = menuRef.value as HTMLElement
  rightDom.style.display = 'none'
}

onMounted(() => {
  document.addEventListener('contextmenu', handleRightMenu)
  document.addEventListener('click', handleClick)
})

onUnmounted(() => {
  console.log('unmounted')

  document.removeEventListener('contextmenu', handleRightMenu)
  document.removeEventListener('click', handleClick)
})
</script>

<style>
.menu-container {
  display: none;
  position: absolute;
  background: #fff;
  z-index: 2000;
}
.menu-container .ant-menu-item {
  display: flex;
  justify-content: space-between;
}
.menu-container .ant-menu-item:hover {
  background: #efefef;
}
.ant-menu-item .item-shortcut {
  color: #ccc;
}
</style>
