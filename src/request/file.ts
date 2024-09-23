import Request from './index'

export function fileUpload() {
  return Request.post('file/upload')
}
