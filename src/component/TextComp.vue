<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { pick } from 'lodash-es'

const props = defineProps<{
  tag: string
  text?: string
  fontSize?: string
}>()

const styles = computed(() => pick(props, ['fontSize']))
</script>

<template>
  <component :is="tag" :style="styles" class="text-comp">{{ text }}</component>
</template>

<style scoped lang="less"></style>
