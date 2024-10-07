<template>
  <TemplateList :list="templateStore.templateInfo" />
</template>

<script setup lang="ts">
import TemplateList from '@/views/home/TemplateList.vue'
import { getWorkList } from '@/request/work'
import { useTemplateStore } from '@/stores/template'
import { onMounted } from 'vue'

const templateStore = useTemplateStore()

const { setTemplate } = templateStore

async function getWorks() {
  const res = await getWorkList()

  setTemplate(res.data.list)
}

onMounted(async () => {
  await getWorks()
})
</script>

<style scoped lang="less"></style>
