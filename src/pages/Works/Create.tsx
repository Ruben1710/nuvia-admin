import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { worksApi, CreateWorkDto } from '@/api/works';
import { categoriesApi, Category } from '@/api/categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadInput } from '@/components/UploadInput';

const workSchema = z.object({
  categoryId: z.number().min(1, 'Выберите категорию'),
  titleEn: z.string().min(1, 'Название (EN) обязательно'),
  titleRu: z.string().min(1, 'Название (RU) обязательно'),
  titleArm: z.string().min(1, 'Название (ARM) обязательно'),
  descriptionEn: z.string().optional(),
  descriptionRu: z.string().optional(),
  descriptionArm: z.string().optional(),
  photo: z.string().min(1, 'Загрузите фото'),
});

type WorkFormData = z.infer<typeof workSchema>;

export const WorksCreate = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [photo, setPhoto] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<WorkFormData>({
    resolver: zodResolver(workSchema),
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setValue('photo', photo);
  }, [photo, setValue]);

  const onSubmit = async (data: WorkFormData) => {
    try {
      const workData: CreateWorkDto = {
        ...data,
      };

      await worksApi.create(workData);
      navigate('/works');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ошибка при создании работы');
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Создать работу</h1>
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-white dark:bg-gray-800">
            <CardTitle className="text-xl">Новая работа</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="categoryId" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Категория *
                  </label>
                  <Select
                    id="categoryId"
                    {...register('categoryId', { valueAsNumber: true })}
                    className="w-full"
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nameRu}
                      </option>
                    ))}
                  </Select>
                  {errors.categoryId && (
                    <p className="text-sm text-destructive">{errors.categoryId.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label htmlFor="titleEn" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Название (EN) *
                  </label>
                  <Input id="titleEn" {...register('titleEn')} placeholder="Custom Mug Design" />
                  {errors.titleEn && (
                    <p className="text-sm text-destructive">{errors.titleEn.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="titleRu" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Название (RU) *
                  </label>
                  <Input id="titleRu" {...register('titleRu')} placeholder="Дизайн кружки на заказ" />
                  {errors.titleRu && (
                    <p className="text-sm text-destructive">{errors.titleRu.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="titleArm" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Название (ARM) *
                  </label>
                  <Input id="titleArm" {...register('titleArm')} placeholder="Պատվերով բաժակի դիզայն" />
                  {errors.titleArm && (
                    <p className="text-sm text-destructive">{errors.titleArm.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label htmlFor="descriptionEn" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Описание (EN)
                  </label>
                  <Textarea
                    id="descriptionEn"
                    {...register('descriptionEn')}
                    rows={3}
                    placeholder="Work description in English"
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="descriptionRu" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Описание (RU)
                  </label>
                  <Textarea
                    id="descriptionRu"
                    {...register('descriptionRu')}
                    rows={3}
                    placeholder="Описание работы на русском"
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="descriptionArm" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Описание (ARM)
                  </label>
                  <Textarea
                    id="descriptionArm"
                    {...register('descriptionArm')}
                    rows={3}
                    placeholder="Աշխատանքի նկարագրությունը հայերեն"
                    className="resize-none"
                  />
                </div>
              </div>

              <div className="space-y-4 border-t pt-6">
                <div className="space-y-3">
                  <UploadInput
                    value={photo}
                    onChange={setPhoto}
                    label="Фото *"
                  />
                  {errors.photo && (
                    <p className="text-sm text-destructive mt-1">{errors.photo.message}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t">
                <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                  {isSubmitting ? 'Создание...' : 'Создать работу'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/works')}>
                  Отмена
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

