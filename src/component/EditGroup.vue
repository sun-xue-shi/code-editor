<script setup lang="ts">
import type { GroupProps } from '@/types/edit.'
import type { AllComponentProps } from '@/types/props'
import { difference } from 'lodash-es'
import { defaultGroupProps } from '@/common/constants'
import { computed, ref } from 'vue'
import PropsTable from './PropsTable.vue'

interface EditGroupType {
  props: AllComponentProps
  groups: GroupProps[]
}

const emit = defineEmits<{ change: [e: any] }>()
const props = withDefaults(defineProps<EditGroupType>(), { groups: () => defaultGroupProps })
const currentIndex = ref('item-1')

const newGroups = computed(() => {
  const allNormalProps = props.groups.reduce((pre, cur) => {
    return [...pre, ...cur.items]
  }, [] as string[])
  const specialProps = difference(Object.keys(props.props), allNormalProps)
  return [
    {
      text: '基本属性',
      items: specialProps
    },
    ...props.groups
  ]
})

const editGroups = computed(() => {
  return newGroups.value.map((group) => {
    const propsMap = {} as AllComponentProps
    group.items.forEach((item) => {
      const key = item as keyof AllComponentProps
      propsMap[key] = props.props[key]
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
  <div class="edit-droup">
    <a-collapse v-model:activeKey="currentIndex">
      <a-collapse-panel
        v-for="(item, index) in editGroups"
        :key="`item-${index + 1}`"
        :header="item.name"
      >
        <PropsTable :props="item.props" @change="handleChange" />
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<style scoped lang="less"></style>
