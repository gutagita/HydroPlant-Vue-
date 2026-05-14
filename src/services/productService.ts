import api from './api'
import type { Product } from "@/types/product"

type ApiProductAttributes = {
  name?: string
  description?: string | null
  price?: number | string
  stock?: number

  // 🔥 TAMBAHAN
  is_featured?: boolean | number
  is_active?: boolean | number

  category_id?: number | string | null
  category_name?: string | null
  category?: { name?: string | null } | string | null

  relationships?: {
    category?: {
      data?: {
        attributes?: {
          name?: string | null
        }
      }
    }
  }

  image_url?: string | null
  images?: string[] | null
  created_at?: string
  updated_at?: string
}

type ApiProductItem = {
  id?: number | string
  type?: string
  attributes?: ApiProductAttributes
  data?: {
    id?: number | string
    type?: string
    attributes?: ApiProductAttributes
  }
}

type ApiProductListResponse = {
  success?: boolean
  message?: string
  data?: ApiProductItem[]
  current_page?: number
  last_page?: number
  per_page?: number
  total?: number
  meta?: {
    current_page?: number
    last_page?: number
    per_page?: number
    total?: number
  }
}

export type ProductPagination = {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
}

export type ProductListResult = {
  items: Product[]
  pagination: ProductPagination
}

const mapProduct = (item: ApiProductItem): Product => {
  const source = item.data ?? item
  const attrs = source.attributes ?? {}

  const relatedCategoryName =
    attrs.relationships?.category?.data?.attributes?.name ?? null

  const categoryValue =
    attrs.category_name ??
    relatedCategoryName ??
    (typeof attrs.category === "string"
      ? attrs.category
      : attrs.category?.name ?? null)

  return {
    id: Number(source.id ?? 0),
    category_id: Number((attrs.category_id ?? 0) || 0),
    category_name: categoryValue,
    category: attrs.category ?? null,
    name: attrs.name ?? "",
    slug: "",

    images: attrs.images ?? (attrs.image_url ? [attrs.image_url] : null),
    image: attrs.image_url ?? attrs.images?.[0] ?? null,

    description: attrs.description ?? null,
    price: String(attrs.price ?? 0),

    // 🔥 FIX DI SINI
    is_active: Boolean(attrs.is_active ?? true),
    is_featured: Boolean(attrs.is_featured),

    stock: Number(attrs.stock ?? 0),
    created_at: attrs.created_at ?? "",
    updated_at: attrs.updated_at ?? "",
  }
}

export const getProducts = async (
  params?: { page?: number; perPage?: number }
): Promise<ProductListResult> => {
  const res = await api.get<ApiProductListResponse>("/products", {
    params: {
      page: params?.page,
      per_page: params?.perPage,
    },
  })

  const items = Array.isArray(res.data?.data) ? res.data.data : []

  const currentPage = Number(
    res.data?.meta?.current_page ?? res.data?.current_page ?? 1
  )
  const lastPage = Number(
    res.data?.meta?.last_page ?? res.data?.last_page ?? 1
  )
  const perPage = Number(
    res.data?.meta?.per_page ??
      res.data?.per_page ??
      params?.perPage ??
      items.length
  )
  const total = Number(
    res.data?.meta?.total ?? res.data?.total ?? items.length
  )

  return {
    items: items.map(mapProduct),
    pagination: {
      currentPage: Number.isFinite(currentPage) ? currentPage : 1,
      lastPage: Number.isFinite(lastPage) ? Math.max(lastPage, 1) : 1,
      perPage: Number.isFinite(perPage) ? perPage : items.length,
      total: Number.isFinite(total) ? total : items.length,
    },
  }

}
