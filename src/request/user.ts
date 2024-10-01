import Request from './index'

export interface LoginCaptcha {
  receiver: string
  type: number
}

export interface EmailLoginData {
  username: string
  email: string
  code: string
  type: number
}

export interface PwdLoginData {
  username: string
  password: string
  type: number
}

export async function loginCaptcha(data: LoginCaptcha) {
  return await Request.get('user/login-code', {
    params: data
  })
}

export async function login(data: EmailLoginData | PwdLoginData) {
  return await Request.post('user/login', data)
}

export async function refreshToken() {
  const res = await Request.get('/user/refresh', {
    params: {
      refreshToken: localStorage.getItem('refreshToken')
    }
  })

  localStorage.setItem('accessToken', res.data.data.accessToken)
  localStorage.setItem('refreshToken', res.data.data.refreshToken)

  return res.data
}
