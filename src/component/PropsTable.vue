<script setup lang="ts">
import { computed } from 'vue'
import type { PropToForms, TextComponentProps } from '@/types/props'
import { mapPropsToForms } from '@/types/props'

interface PropsType {
  type?: TextComponentProps
  props: Record<string, any>
}
const props = defineProps<PropsType>()

const finalProps = computed(() => {
  const result: PropToForms = {}
  Object.keys(props.props).map((key) => {
    const item = mapPropsToForms[key as keyof TextComponentProps]
    if (item) {
      item.value = item.initailTransform
        ? item.initailTransform(props.props[key])
        : props.props[key]
      result[key as keyof TextComponentProps] = item
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
          :value="value.value"
          v-bind="value.extraProps"
        >
          <template v-if="value.options">
            <component
              :is="value.subComponent"
              v-for="(option, key) in value.options"
              :key="key"
              :value="option.value"
            >
              {{ option.text }}
            </component>
          </template>
        </component>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less"></style>
