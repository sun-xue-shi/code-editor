<script setup lang="ts">
import { defineProps } from 'vue'
import { type TextComponentProps, textStylePropNames } from '../defaultProps'
import { useCompCommon } from '@/hooks/useCompCommon'

const props = defineProps<TextComponentProps>()

const { styleProps } = useCompCommon(props, textStylePropNames)

const handleClick = () => {
  if (props.actionType === 'url' && props.url) {
    window.location.href = props.url
  }
}
</script>

<template>
  <component :is="tag" @click="handleClick" :style="styleProps" class="text-comp">
    {{ text }}
  </component>
</template>

<style scoped lang="less">
.text-comp {
  width: 100%;
  height: 100%;
}
</style>
