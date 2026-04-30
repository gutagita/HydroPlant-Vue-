export interface Product {
id: number
category_id: number
category_name?: string | null
category?: { name?: string | null } | string | null
name: string
slug: string
images: string[] | null
image?: string | null
description: string | null
price: string
is_active: boolean
is_featured: boolean
stock: number
created_at: string
updated_at: string
}

