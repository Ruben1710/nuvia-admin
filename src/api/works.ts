import { api } from './axios';

export interface Work {
  id: number;
  categoryId: number;
  titleEn: string;
  titleRu: string;
  titleArm: string;
  descriptionEn?: string;
  descriptionRu?: string;
  descriptionArm?: string;
  photo: string;
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

export interface CreateWorkDto {
  categoryId: number;
  titleEn: string;
  titleRu: string;
  titleArm: string;
  descriptionEn?: string;
  descriptionRu?: string;
  descriptionArm?: string;
  photo: string;
}

export interface UpdateWorkDto extends Partial<CreateWorkDto> {}

export const worksApi = {
  getAll: async (): Promise<Work[]> => {
    const response = await api.get<Work[]>('/works');
    return response.data;
  },

  getById: async (id: number): Promise<Work> => {
    const response = await api.get<Work>(`/works/${id}`);
    return response.data;
  },

  create: async (data: CreateWorkDto): Promise<Work> => {
    const response = await api.post<Work>('/works', data);
    return response.data;
  },

  update: async (id: number, data: UpdateWorkDto): Promise<Work> => {
    const response = await api.patch<Work>(`/works/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/works/${id}`);
  },
};

