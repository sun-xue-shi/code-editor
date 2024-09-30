import Request from './index'

interface LoginCaptcha {
  receiver: string
  type: number
}

interface EmailLoginData {
  username: string
  email: string
  code: string
  type: number
}

export async function loginCaptcha(data: LoginCaptcha) {
  return await Request.get('user/login-code', {
    params: data
  })
}

export async function loginByEmail(data: EmailLoginData) {
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
