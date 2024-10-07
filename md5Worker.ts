import SparkMD5 from 'spark-md5'

self.addEventListener('message', async (event) => {
  const file = event.data
  const md5 = await getFileHash(file)
  self.postMessage(md5)
})

async function getFileHash(file: File) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = (e: Event) => {
      const fileHash = SparkMD5.ArrayBuffer.hash(e.target?.result)
      resolve(fileHash)
    }
    fileReader.onerror = () => {
      reject('文件读取失败')
    }
    fileReader.readAsArrayBuffer(file)
  })
}
