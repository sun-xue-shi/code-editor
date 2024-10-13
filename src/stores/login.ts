import myRequest from '@/axios'
import router from '@/router'
import type { FormState } from '@/types/login'
import { message } from 'ant-design-vue'
import { defineStore } from 'pinia'

export const useLoginStore = defineStore(
  'login',
  () => {
    function login(formData: FormState) {
      try {
        myRequest
          .post({
            url: 'user/login',
            data: formData
          })
          .then((res) => {
            message.success(res.data.message)
            localStorage.setItem('access_token', res.data.data.accessToken)
            localStorage.setItem('refresh_token', res.data.data.refreshToken)
            localStorage.setItem('userInfo', JSON.stringify(res.data.data.userInfo))
            router.replace({ path: '/home' })
          })
      } catch (error: any) {
        message.error(error)
      }
    }
    function getLoginCode(email: string) {
      try {
        myRequest
          .post({
            url: 'user/login-code',
            params: {
              receiver: email,
              type: 1
            }
          })
          .then((res) => {
            message.success(res.message)
          })
      } catch (error: any) {
        message.error(error)
      }
    }
    return { login, getLoginCode }
  },
  {
    persist: {
      key: 'login',
      paths: ['login']
    }
  }
)
