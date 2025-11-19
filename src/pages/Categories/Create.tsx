import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { categoriesApi } from '@/api/categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadInput } from '@/components/UploadInput';

const categorySchema = z.object({
  slug: z.string().min(1, 'Slug обязателен'),
  nameEn: z.string().min(1, 'Название (EN) обязательно'),
  nameRu: z.string().min(1, 'Название (RU) обязательно'),
  nameArm: z.string().min(1, 'Название (ARM) обязательно'),
  img: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export const CategoriesCreate = () => {
  const navigate = useNavigate();
  const [categoryImage, setCategoryImage] = useState<string>('');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    setValue('img', categoryImage);
  }, [categoryImage, setValue]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      await categoriesApi.create(data);
      navigate('/categories');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ошибка при создании категории');
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Создать категорию</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Новая категория</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="slug" className="text-sm font-medium">
                Slug
              </label>
              <Input id="slug" {...register('slug')} />
              {errors.slug && (
                <p className="text-sm text-destructive">{errors.slug.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="nameEn" className="text-sm font-medium">
                Название (EN)
              </label>
              <Input id="nameEn" {...register('nameEn')} />
              {errors.nameEn && (
                <p className="text-sm text-destructive">{errors.nameEn.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="nameRu" className="text-sm font-medium">
                Название (RU)
              </label>
              <Input id="nameRu" {...register('nameRu')} />
              {errors.nameRu && (
                <p className="text-sm text-destructive">{errors.nameRu.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="nameArm" className="text-sm font-medium">
                Название (ARM)
              </label>
              <Input id="nameArm" {...register('nameArm')} />
              {errors.nameArm && (
                <p className="text-sm text-destructive">{errors.nameArm.message}</p>
              )}
            </div>
            <div className="space-y-2 border-t pt-4">
              <UploadInput
                value={categoryImage}
                onChange={setCategoryImage}
                label="Изображение категории (необязательно)"
              />
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Создание...' : 'Создать'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/categories')}>
                Отмена
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

