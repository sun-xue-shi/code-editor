import myRequest from '@/axios'
import router from '@/router'
import type { FormState } from '@/types/login'
import { message } from 'ant-design-vue'
import { defineStore } from 'pinia'
import { ref } from 'vue'

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
    function register(formData: FormState) {
      const data = Object.assign(formData, { type: 1 })

      return myRequest.post({
        url: 'user/register',
        data
      })
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
    function getRegisterCode(email: string) {
      try {
        myRequest.post({
          url: 'user/register-code',
          params: {
            receiver: email,
            type: 1
          }
        })
      } catch (error: any) {
        message.error(error)
      }
    }
const loginType = ref(2)
    return { login, getLoginCode, register, getRegisterCode,loginType }
  },
  {
    persist: {
      key: 'login',
      paths: ['login']
    }
  }
)
