import axios from 'axios'
import type { Product } from '@/types/product'

export const api = axios.create({
  baseURL: 'http://localhost:8000/api',
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
  getAll: () => api.get<ProductListResponse>('/products'),
  getById: (id: number | string) => api.get<Product>(`/products/${id}`),
  create: (payload: ProductPayload) => api.post<Product>('/products', payload),
  update: (id: number | string, payload: ProductPayload) => api.put<Product>(`/products/${id}`, payload),
  patch: (id: number | string, payload: Partial<ProductPayload>) => api.patch<Product>(`/products/${id}`, payload),
  remove: (id: number | string) => api.delete(`/products/${id}`),
}
