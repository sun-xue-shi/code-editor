<script setup lang="ts">
import { computed } from 'vue'
import type { TextComponentProps, FormProp } from '@/types/props'
import RenderVNode from '@/hooks/RenderVNode'
import { mapPropsToForms } from '@/common/propsMap';

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
    const item = mapPropsToForms[key as keyof TextComponentProps]
    if (item) {
      const value = props.props[key]
      const { valueProp = 'value', envenName = 'change', initailTransform, afterTransform } = item
      const newItem: FormProp = {
        ...item,
        value: initailTransform ? initailTransform(value) : value,
        valueProp,
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
    <div v-for="(value, key) in finalProps" :key="key" class="prop-item">
      <span class="label" v-if="value?.text">{{ value.text }}</span>
      <div class="prop-component">
        <component
          v-if="value"
          :is="value.component"
          :[value.valueProp]="value.value"
          v-bind="value.extraProps"
          v-on="value.events"
        >
          <template v-if="value.options">
            <component
              :is="value.subComponent"
              v-for="(option, key) in value.options"
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
</style>
