import Request from './index'

export async function uploadCropper(formData: FormData) {
  return await Request.post('http://localhost:3000/file/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}