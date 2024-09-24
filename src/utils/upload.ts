import type { CheckOption, ErrorType } from '@/types/utils'
import { message } from 'ant-design-vue'

export function checkUpload(file: File, checkOption: CheckOption) {
  const { format, size } = checkOption

  const isValidSize = size ? file.size / 1024 / 1024 < size : true
  const isValidFormat = format ? format.includes(file.type) : true
  let error: ErrorType = ''
  if (!isValidFormat) error = 'formatError'
  if (!isValidSize) error = 'sizeError'

  return {
    passed: isValidFormat && isValidSize,
    error
  }
}

export function commonUploadCheck(file: File) {
  console.log(file)

  const result = checkUpload(file, { format: ['image/png', 'image/jpeg'], size: 1 })
  const { error, passed } = result
  if (error === 'formatError') message.error('上传图片只能是JPG/PNG格式')
  if (error === 'sizeError') message.error('上传图片应该小于1MB')

  return passed
}

export function getImageSize(url: string) {
  return new Promise<{ naturalHeight: number; naturalWidth: number }>((resolve, reject) => {
    const img = new Image()
    img.src = url
    img.addEventListener('load', () => {
      const { naturalHeight, naturalWidth } = img
      resolve({ naturalHeight, naturalWidth })
    })

    img.addEventListener('error', () => {
      reject(new Error('获取文件信息失败'))
    })
  })
}
