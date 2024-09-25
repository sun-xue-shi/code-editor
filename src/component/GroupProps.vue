<script setup lang="ts">
import type { AllComponentProps } from '@/types/props'
import { difference } from 'lodash-es'
import { computed, ref } from 'vue'
import { DefaultGroupProps } from '@/common/constants'
import PropsTable from '@/component/PropsTable.vue'

export interface GroupProp {
  name: string
  items: string[]
}

const props = withDefaults(
  defineProps<{
    props: AllComponentProps
    groupProps?: GroupProp[]
  }>(),
  {
    groupProps: () => DefaultGroupProps
  }
)

const emit = defineEmits<{
  change: [value: Record<string, any>]
}>()

const activeKey = ref('item-0')

const newGroups = computed(() => {
  const normalProps = props.groupProps.reduce((pre, cur) => {
    return [...pre, ...cur.items]
  }, [] as string[])

  const specialProps = difference(Object.keys(props.props), normalProps)

  return [
    {
      name: '特殊属性',
      items: specialProps
    },
    ...props.groupProps
  ]
})

const editProps = computed(() => {
  return newGroups.value.map((group) => {
    const propsMap = {} as AllComponentProps
    group.items.forEach((item) => {
      const key = item as keyof AllComponentProps
      propsMap[key] = props.props[key]!
    })

    return {
      ...group,
      props: propsMap
    }
  })
})

function handleChange(e: any) {
  emit('change', e)
}
</script>

<template>
  <a-collapse v-model:activeKey="activeKey" accordion>
    <a-collapse-panel v-for="(item, index) in editProps" :key="`item-${index}`" :header="item.name">
      <PropsTable :props="item.props" @change="handleChange" />
    </a-collapse-panel>
  </a-collapse>
</template>

<style scoped lang="less"></style>
