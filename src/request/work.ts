import Request from './index'

export async function getWork(id: string) {
  return await Request.get(`work/${id}`)
}

export async function updateWork(id: string, data: any) {
  return await Request.patch(`work/update/${id}`, data)
}

export async function publish(id: string) {
  return await Request.patch(`work/publish/${id}`)
}

export async function createChannel(data: { name: string; workId: string }) {
  return await Request.post(`work/create-channel`, data)
}

export async function getChannels(data: { id: string }) {
  return await Request.get(`work/get-channels`, {
    params: data
  })
}

export async function deleteChannel(data: { id: string; workId: string }) {
  return await Request.delete(`work/delete-channel`, {
    params: data
  })
}
