<script setup lang="ts">
import { computed } from 'vue'
import type { TextComponentProps, FormProp } from '@/types/props'
import { mapPropsToForms } from '@/types/props'
import RenderVNode from '@/hooks/RenderVNode'

interface PropsType {
  type?: TextComponentProps
  props: Record<string, any>
}
const props = defineProps<PropsType>()
const emit = defineEmits<{
  (e: 'change', value: Record<string, any>): void
}>()

const finalProps = computed(() => {
  const result: Record<string, FormProp> = {}
  Object.keys(props.props).map((key) => {
    let isHidden = false
    const item = mapPropsToForms[key as keyof TextComponentProps]
    if (item) {
      if (item.parent) {
        isHidden = props.props[item.parent] === 'url' ? false : true
      }
      const value = props.props[key]
      const { valueProp = 'value', envenName = 'change', initailTransform, afterTransform } = item
      const newItem: FormProp = {
        ...item,
        value: initailTransform ? initailTransform(value) : value,
        valueProp,
        isHidden,
        envenName,
        events: {
          [envenName]: (e: any) => {
            emit('change', { key, value: afterTransform ? afterTransform(e) : e })
          }
        }
      }

      result[key as keyof TextComponentProps] = newItem
    }
  })

  return result
})
</script>

<template>
  <div class="props-table">
    <div
      v-for="(item, index) in finalProps"
      :key="index"
      class="prop-item"
      :class="{ 'hidden-item': item.isHidden }"
    >
      <span class="label" v-if="item?.text">{{ item.text }}</span>
      <div class="prop-component">
        <component
          v-if="item"
          :is="item.component"
          :[item.valueProp]="item.value"
          v-bind="item.extraProps"
          v-on="item.events"
        >
          <template v-if="item.options">
            <component
              :is="item.subComponent"
              v-for="(option, key) in item.options"
              :key="key"
              :value="option.value"
            >
              <render-v-node :v-node="option.text" />
            </component>
          </template>
        </component>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.prop-item {
  display: flex;
  padding-left: 15px;
  padding-bottom: 10px;
  .label {
    display: inline-block;
    width: 25%;
  }
}
.hidden-item {
  display: none;
}
</style>
