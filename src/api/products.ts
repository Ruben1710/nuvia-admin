import { api } from './axios';

export interface Product {
  id: number;
  categoryId: number;
  nameEn: string;
  nameRu: string;
  nameArm: string;
  descriptionEn?: string;
  descriptionRu?: string;
  descriptionArm?: string;
  price: number;
  images?: Array<{ url: string; modelIds: number[] }>;
  sliderDescriptionEn?: string;
  sliderDescriptionRu?: string;
  sliderDescriptionArm?: string;
  filters?: any;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: number;
    slug: string;
    nameEn: string;
    nameRu: string;
    nameArm: string;
  };
}

export interface CreateProductDto {
  categoryId: number;
  nameEn: string;
  nameRu: string;
  nameArm: string;
  descriptionEn?: string;
  descriptionRu?: string;
  descriptionArm?: string;
  price: number;
  images?: Array<{ url: string; modelIds: number[] }>;
  sliderDescriptionEn?: string;
  sliderDescriptionRu?: string;
  sliderDescriptionArm?: string;
  filters?: any;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (data: CreateProductDto): Promise<Product> => {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  update: async (id: number, data: UpdateProductDto): Promise<Product> => {
    const response = await api.patch<Product>(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

