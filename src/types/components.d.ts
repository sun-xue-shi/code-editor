import { TemplateList } from '@/components/TemplateList.vue'

declare module 'vue' {
  interface GlobalComponents {
    TemplateList: typeof TemplateList
  }
}
