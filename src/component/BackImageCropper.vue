<script setup lang="ts">
import { watch } from 'vue'
import ImageCropper from './ImageCropper.vue'
import ImageUploader from './ImageUploader.vue'

const props = defineProps<{
  value: string
}>()

const emit = defineEmits<{
  change: [value: string]
}>()
</script>

<template>
  <div class="back-cropper">
    <ImageUploader v-if="!value" :style="{ width: '160px' }" :is-page-uploader="true" />
    <ImageCropper v-else :value="value[1]" :is-page-cropper="true" />
  </div>
</template>

<style scoped lang="less"></style>
