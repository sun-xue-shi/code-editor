import myRequest from '@/axios'
import html2canvas from 'html2canvas'

export async function useScreenshot(ele: HTMLElement) {
  const canvas = await html2canvas(ele, { width: 420, useCORS: true })
  if (canvas) {
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (blob) {
          const formData = new FormData()
          formData.append('files', blob, 'screenshot.png')
          const res = await myRequest.post({
            url: 'file/upload',
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          if (res) {
            resolve(res)
          }
        }
      })
    })
  }
}
