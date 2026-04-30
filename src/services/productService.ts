// Mengambil instance Axios bernama api dari file api.ts
import { api } from "./api"
import type { Product } from "@/types/product"

type ApiProductAttributes = {
  name?: string
  description?: string | null
  price?: number | string
  stock?: number
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
}

const mapProduct = (item: ApiProductItem): Product => {
  const source = item.data ?? item
  const attrs = source.attributes ?? {}
  const relatedCategoryName = attrs.relationships?.category?.data?.attributes?.name ?? null
  const categoryValue =
    attrs.category_name ??
    relatedCategoryName ??
    (typeof attrs.category === 'string' ? attrs.category : attrs.category?.name ?? null)

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
    is_active: true,
    is_featured: false,
    stock: Number(attrs.stock ?? 0),
    created_at: attrs.created_at ?? "",
    updated_at: attrs.updated_at ?? "",
  }
}

export const getProducts = async () => {
  const res = await api.get<ApiProductListResponse>("/products")
  const items = Array.isArray(res.data?.data) ? res.data.data : []
  return items.map(mapProduct)
}

