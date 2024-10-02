import Request from './index'

export async function getWork(id: string) {
  return await Request.get(`work/${id}`)
}
