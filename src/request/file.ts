import Request from './index'

export async function uploadFile(formData: FormData) {
  return await Request.post('file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export async function uploadBigFile(formData: FormData) {
  return await Request.post('file/big-upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export async function mergeFile(data: { name: string; hash: string }) {
  return await Request.get('file/merge', {
    params: data
  })
}

export async function checkFile(data: { name: string; hash: string; chunkTotal: number }) {
  return await Request.get('file/check-chunks', {
    params: data
  })
}
