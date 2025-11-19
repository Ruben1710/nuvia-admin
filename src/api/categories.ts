import { api } from './axios';

export interface Category {
  id: number;
  slug: string;
  nameEn: string;
  nameRu: string;
  nameArm: string;
  img?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  slug: string;
  nameEn: string;
  nameRu: string;
  nameArm: string;
  img?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  getById: async (id: number): Promise<Category> => {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },

  create: async (data: CreateCategoryDto): Promise<Category> => {
    const response = await api.post<Category>('/categories', data);
    return response.data;
  },

  update: async (id: number, data: UpdateCategoryDto): Promise<Category> => {
    const response = await api.patch<Category>(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

