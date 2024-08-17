/**
 * 用户数据
 */

import { type UserInfo } from '@/types/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref({ isLogin: false, userName: 'zilong' } as UserInfo)

    //存储用户信息
    const setUser = (userData: UserInfo) => {
      user.value = userData
    }

    //清除用户信息
    const removeUser = () => {
      user.value = {} as UserInfo
    }

    return { user, setUser, removeUser }
  },
  // pinia定制化
  {
    persist: {
      key: 'user',
      paths: ['user']
    }
  }
)
