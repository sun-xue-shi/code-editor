import { uploadFile } from '@/request/file'
import html2canvas from 'html2canvas'

export async function useScreenshot(ele: HTMLElement) {
  let url = ''
  const canvas = await html2canvas(ele, { width: 375, useCORS: true })

  if (canvas) {
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (blob) {
          const formData = new FormData()
          formData.append('files', blob, 'screenshot.png')
          const res = await uploadFile(formData)
          if (res) {
            url = res.data.url[0]
            resolve(url)
          }
        }
      })
    })
  }
}
