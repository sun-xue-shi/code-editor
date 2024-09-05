<script setup lang="ts">
import { DEFAULT_COLOR } from '@/common/constants'

export interface Props {
  value: string
  colors: string[]
}

withDefaults(defineProps<Props>(), {
  colors: () => DEFAULT_COLOR,
  value: ''
})

const emit = defineEmits<{
  change: [color: string]
}>()

const onChange = (color: string) => {
  emit('change', color)
}
</script>

<template>
  <div class="color-picker">
    <div class="color-container">
      <input type="color" :value="value" @input="onChange($event.target.value)" />
    </div>
    <ul class="default-color-list">
      <li
        v-for="(item, index) in colors"
        :key="item"
        :class="`item-${index}`"
        @click.prevent="onChange(item)"
      >
        <div
          v-if="item.startsWith('#')"
          :style="{ backgroundColor: item }"
          class="color-item"
        ></div>
        <div v-else class="color-item transparent-color"></div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="less">
.color-picker {
  display: flex;
}
.color-container {
  width: 40%;
}
.color-container input[type='color'] {
  width: 100%;
  cursor: pointer;
  height: 50px;
  border: 0;
  padding: 0;
  background-color: transparent;
}
.default-color-list {
  padding: 0 0 0 5px;
  margin: 0;
  width: 60%;
  display: flex;
  list-style-type: none;
  flex-wrap: wrap;
  justify-content: space-between;
}
.default-color-list li {
  flex: 1;
  width: 20%;
  min-width: 20%;
  max-width: 20%;
}
.color-item {
  padding: 3px;
  width: 20px;
  height: 20px;
  border-radius: 3px;
  margin-right: 5px;
  cursor: pointer;
  border: 1px solid #ccc;
}
.transparent-color {
  background: url('../assets/transparent.png') no-repeat;
}
</style>
