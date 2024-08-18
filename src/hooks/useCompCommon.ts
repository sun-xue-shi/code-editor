import { pick } from 'lodash-es'
import { computed } from 'vue'

export const useCompCommon = <T extends Record<string, any>>(props: T, styleNames: string[]) => {
  const styleProps = computed(() => pick(props, styleNames))

  const handleClick = () => {
    if (props.actionType === 'url' && props.url) {
      window.location.href = props.url
    }
  }

  return { styleProps, handleClick }
}
