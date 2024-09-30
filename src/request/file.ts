import Request from './index'

export async function uploadCropper(formData: FormData) {
  return await Request.post('file/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
