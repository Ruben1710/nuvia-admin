import { api } from './axios';

export const uploadsApi = {
  uploadFile: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    // НЕ указываем Content-Type вручную - браузер сам установит правильный заголовок с boundary
    const response = await api.post<{ url: string }>('/upload', formData);

    return response.data;
  },

  uploadMultipleFiles: async (files: File[]): Promise<{ urls: string[] }> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    // НЕ указываем Content-Type вручную - браузер сам установит правильный заголовок с boundary
    const response = await api.post<{ urls: string[] }>('/upload/multiple', formData);

    return response.data;
  },
};

