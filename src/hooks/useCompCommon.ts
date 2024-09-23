import type { AllComponentProps, ImageComponentProps, TextComponentProps } from '@/types/props'
import { pick } from 'lodash-es'
import { computed } from 'vue'

export const useCompCommon = (props: AllComponentProps, styleNames: string[]) => {
  const styleProps = computed(() => pick(props, styleNames))

  const handleClick = () => {
    if (props.actionType === 'url' && props.url) {
      window.location.href = props.url
    }
  }

  return { styleProps, handleClick }
}
