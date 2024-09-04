export type UploadStaus = 'ready' | 'loading' | 'success' | 'error'

export interface UploaderFile {
  uid: string
  size: number
  name: string
  status: UploadStaus
  raw: File
}
export interface ActionType {
  url: string
}
