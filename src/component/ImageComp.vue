<script setup lang="ts">
import {
  transformToComponentProps,
  imageDefaultProps,
  imageStylePropsNames
} from '@/common/defaultProps'
import { useCompCommon } from '@/hooks/useCompCommon'
import type { ImageComponentProps, TextComponentProps } from '@/types/props'

const defaultProps = transformToComponentProps(imageDefaultProps)

const props = withDefaults(defineProps<ImageComponentProps>(), {})

const { handleClick, styleProps } = useCompCommon(props, imageStylePropsNames)
</script>

<template>
  <img :style="styleProps" :src="props.src" @click="handleClick" />
</template>

<style scoped lang="less"></style>
