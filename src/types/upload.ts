export type UploadStaus = 'ready' | 'loading' | 'success' | 'error'

export interface UploaderFile {
  uid: string
  size: number
  name: string
  status: UploadStaus
  raw: File
  response?: any
}
export interface ActionType {
  url: string
  beforeUpload?: CheckUpload
  drag?: boolean
}
export type CheckUpload = (file: File) => boolean | Promise<File>
