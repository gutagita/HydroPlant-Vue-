import api from './api'

export const getProfile = async () => {
  const response = await api.get('/user')

  return response.data.user ?? response.data.data
}

export const updateProfile = async (payload: {
  name: string
  phone?: string
}) => {
  const response = await api.put('/user', payload)

  return response.data.data
}

export const getMyOrders = async () => {
  const response = await api.get('/my-orders')

  return response.data.data
}
