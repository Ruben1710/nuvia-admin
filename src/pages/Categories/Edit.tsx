import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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

export const CategoriesEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [categoryImage, setCategoryImage] = useState<string>('');
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return;
      try {
        const category = await categoriesApi.getById(Number(id));
        setCategoryImage(category.img || '');
        reset(category);
      } catch (error) {
        console.error('Error fetching category:', error);
        navigate('/categories');
      }
    };
    fetchCategory();
  }, [id, navigate, reset]);

  const handleImageChange = (url: string | string[]) => {
    if (typeof url === 'string') {
      setCategoryImage(url);
    } else if (Array.isArray(url) && url.length > 0) {
      setCategoryImage(url[0]);
    }
  };

  useEffect(() => {
    setValue('img', categoryImage);
  }, [categoryImage, setValue]);

  const onSubmit = async (data: CategoryFormData) => {
    if (!id) return;
    try {
      await categoriesApi.update(Number(id), data);
      navigate('/categories');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ошибка при обновлении категории');
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Редактировать категорию</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Редактирование категории</CardTitle>
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
                onChange={handleImageChange}
                label="Изображение категории (необязательно)"
              />
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Сохранение...' : 'Сохранить'}
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

