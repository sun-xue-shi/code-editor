<script setup lang="ts">
import { computed } from 'vue'
import type { FormProp, AllComponentProps } from '@/types/props'
import { mapPropsToForms } from '@/common/propsMap'
import RenderVNode from '@/hooks/RenderVNode'

interface PropsType {
  type?: AllComponentProps
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
    const item = mapPropsToForms[key as keyof AllComponentProps]
    if (item) {
      const value = props.props[key]

      const {
        valueProp = 'value',
        envenName = 'change',
        initailTransform,
        afterTransform,
        parent
      } = item
      if (parent) {
        isHidden = props.props[parent] === 'url' ? false : true
      }

      const newItem: FormProp = {
        ...item,
        value: initailTransform ? initailTransform(value) : value,
        valueProp,
        envenName,
        isHidden,
        events: {
          [envenName]: (e: any) => {
            emit('change', { key, value: afterTransform ? afterTransform(e) : e })
          }
        }
      }

      result[key as keyof AllComponentProps] = newItem
    }
  })

  return result
})
</script>

<template>
  <div class="props-table">
    <div
      v-for="propItem in finalProps"
      :key="propItem.value"
      class="prop-item"
      :class="{ 'no-text': !propItem.text, 'hide-item': propItem.isHidden }"
    >
      <span class="label" v-if="propItem?.text">{{ propItem.text }}</span>
      <div class="prop-component">
        <component
          v-if="propItem"
          :is="propItem.component"
          :[propItem.valueProp]="propItem.value"
          v-bind="propItem.extraProps"
          v-on="propItem.events"
        >
          <template v-if="propItem.options">
            <component
              :is="propItem.subComponent"
              v-for="option in propItem.options"
              :key="option.value"
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
    text-align: center;
    line-height: 30px;
    width: 25%;
  }
}

.hide-item {
  display: none;
}

.prop-item.no-text {
  display: inline-block;
  margin: 0 10px 0 0;
}
</style>
