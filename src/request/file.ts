import Request from './index'

export async function presignedUrl(fileName: string) {
  return Request.get(`/minio/presignedUrl?name=${fileName}`)
}
