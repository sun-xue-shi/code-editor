import Request from './index'

export async function getWork(id: string) {
  return await Request.get(`work/${id}`)
}

export async function updateWork(id: string, data: any) {
  return await Request.patch(`work/update/${id}`, data)
}
