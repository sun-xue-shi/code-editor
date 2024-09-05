export type UploadStaus = 'ready' | 'loading' | 'success' | 'error'

export interface UploaderFile {
  uid: string
  size: number
  name: string
  status: UploadStaus
  raw: File
  response?: any
  url?: string
}
export interface ActionType {
  url: string
  beforeUpload?: CheckUpload
  drag?: boolean
  autoUpload?: boolean
  listType?: FileListType
  showUploadList?: boolean
}
export type CheckUpload = (file: File) => boolean | Promise<File>
export type FileListType = 'picture' | 'text'
