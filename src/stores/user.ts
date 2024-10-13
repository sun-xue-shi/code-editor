/**
 * 用户数据
 */

import { type UserInfo } from '@/types/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const info = localStorage.getItem('userInfo')
    const user = ref(JSON.parse(info as string))

    //清除用户信息
    const removeUser = () => {
      user.value = {} as UserInfo
    }

    return { user, removeUser }
  },
  // pinia定制化
  {
    persist: {
      key: 'user',
      paths: ['user']
    }
  }
)
