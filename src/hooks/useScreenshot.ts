import { uploadFile } from '@/request/file'
import html2canvas from 'html2canvas'

export async function useScreenshot(ele: HTMLElement) {
  const canvas = await html2canvas(ele, { width: 375, useCORS: true })

  canvas.toBlob((blob) => {
    if (blob) {
      console.log(blob)
      const formData = new FormData()
      formData.append('files', blob, 'screenshot.png')
      uploadFile(formData).then((res) => {
        console.log('imgres', res)
      })
    }
  })
}
