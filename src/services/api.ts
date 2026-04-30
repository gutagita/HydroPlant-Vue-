import axios from 'axios'
import type { Product } from '@/types/product'

export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ProductPayload {
  name: string
  description: string
  price: number
  stock: number
  image: string
}

export type ProductListResponse = Product[] | { data: Product[] }

export const ProductAPI = {
  getAll: () => api.get('/products'),
  getById: (id: number | string) => api.get(`/products/${id}`),
  create: (payload: ProductPayload) => api.post('/products', payload),
  update: (id: number | string, payload: ProductPayload) => api.put(`/products/${id}`, payload),
  patch: (id: number | string, payload: Partial<ProductPayload>) => api.patch(`/products/${id}`, payload),
  remove: (id: number | string) => api.delete(`/products/${id}`),
}
