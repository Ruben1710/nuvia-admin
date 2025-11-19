import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { productsApi, CreateProductDto } from '@/api/products';
import { categoriesApi, Category } from '@/api/categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MaterialFromUsFilter } from '@/components/filters/MaterialFromUsFilter';
import { SizeFilter } from '@/components/filters/SizeFilter';
import { ImageWithModelsInput } from '@/components/ImageWithModelsInput';

const productSchema = z.object({
  categoryId: z.number().min(1, 'Выберите категорию'),
  nameEn: z.string().min(1, 'Название (EN) обязательно'),
  nameRu: z.string().min(1, 'Название (RU) обязательно'),
  nameArm: z.string().min(1, 'Название (ARM) обязательно'),
  descriptionEn: z.string().optional(),
  descriptionRu: z.string().optional(),
  descriptionArm: z.string().optional(),
  price: z.number().min(0, 'Цена должна быть положительной'),
  images: z.array(z.object({
    url: z.string(),
    modelIds: z.array(z.number()),
  })).optional(),
  sliderDescriptionEn: z.string().optional(),
  sliderDescriptionRu: z.string().optional(),
  sliderDescriptionArm: z.string().optional(),
  filters: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export const ProductsCreate = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [productImages, setProductImages] = useState<Array<{ url: string; modelIds: number[] }>>([]);
  
  // Фильтры
  const [materialFromUs, setMaterialFromUs] = useState({
    required: false,
    type: false,
    priceModifier: 0,
    help: { en: '', ru: '', arm: '' },
  });
  const [productSize, setProductSize] = useState<Array<{ size: { en: string; ru: string; arm: string }; priceModifier: number }>>([]);
  const [printSize, setPrintSize] = useState<Array<{ size: { en: string; ru: string; arm: string }; priceModifier: number }>>([]);
  const [model, setModel] = useState<Array<{ size: { en: string; ru: string; arm: string }; priceModifier: number }>>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      images: [],
      filters: '{}',
    },
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
    setValue('images', productImages);
    
    // Формируем объект фильтров
    const filters: any = {
      materialFromUs,
      photoEdit: false, // По умолчанию false, не показываем в админке
    };
    
    if (productSize.length > 0) {
      filters.productSize = productSize;
    }
    if (printSize.length > 0) {
      filters.printSize = printSize;
    }
    if (model.length > 0) {
      filters.model = model;
    }
    
    setValue('filters', JSON.stringify(filters));
  }, [productImages, materialFromUs, productSize, printSize, model, setValue]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      // Формируем объект фильтров
      const filters: any = {
        materialFromUs,
        photoEdit: false,
      };
      
      if (productSize.length > 0) {
        filters.productSize = productSize;
      }
      if (printSize.length > 0) {
        filters.printSize = printSize;
      }
      if (model.length > 0) {
        filters.model = model;
      }

      const productData: CreateProductDto = {
        ...data,
        images: productImages,
        filters,
      };

      await productsApi.create(productData);
      navigate('/products');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ошибка при создании товара');
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Создать товар</h1>
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-white dark:bg-gray-800">
            <CardTitle className="text-xl">Новый товар</CardTitle>
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

              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Цена (в копейках) *
                </label>
                <Input
                  id="price"
                  type="number"
                  {...register('price', { valueAsNumber: true })}
                  placeholder="1500"
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label htmlFor="nameEn" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Название (EN) *
                </label>
                <Input id="nameEn" {...register('nameEn')} placeholder="Custom Mug" />
                {errors.nameEn && (
                  <p className="text-sm text-destructive">{errors.nameEn.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="nameRu" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Название (RU) *
                </label>
                <Input id="nameRu" {...register('nameRu')} placeholder="Кружка на заказ" />
                {errors.nameRu && (
                  <p className="text-sm text-destructive">{errors.nameRu.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="nameArm" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Название (ARM) *
                </label>
                <Input id="nameArm" {...register('nameArm')} placeholder="Պատվերով բաժակ" />
                {errors.nameArm && (
                  <p className="text-sm text-destructive">{errors.nameArm.message}</p>
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
                  placeholder="Product description in English"
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
                  placeholder="Описание товара на русском"
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
                  placeholder="Արտադրանքի նկարագրությունը հայերեն"
                  className="resize-none"
                />
              </div>
            </div>

            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Изображения товара</h3>
              <ImageWithModelsInput
                value={productImages}
                onChange={setProductImages}
                models={model}
                locale="ru"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3 border-t pt-6">
              <div className="space-y-2">
                <label htmlFor="sliderDescriptionEn" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Описание для слайдера (EN)
                </label>
                <Textarea 
                  id="sliderDescriptionEn" 
                  {...register('sliderDescriptionEn')} 
                  rows={2}
                  placeholder="Slider description"
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="sliderDescriptionRu" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Описание для слайдера (RU)
                </label>
                <Textarea 
                  id="sliderDescriptionRu" 
                  {...register('sliderDescriptionRu')} 
                  rows={2}
                  placeholder="Описание для слайдера"
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="sliderDescriptionArm" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Описание для слайдера (ARM)
                </label>
                <Textarea 
                  id="sliderDescriptionArm" 
                  {...register('sliderDescriptionArm')} 
                  rows={2}
                  placeholder="Սլայդերի նկարագրություն"
                  className="resize-none"
                />
              </div>
            </div>

            {/* Filters Section */}
            <div className="space-y-6 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Фильтры товара</h3>
              
              {/* Material From Us */}
              <MaterialFromUsFilter
                value={materialFromUs}
                onChange={setMaterialFromUs}
              />

              {/* Product Size */}
              <SizeFilter
                value={productSize}
                onChange={setProductSize}
                label="Размер товара"
              />

              {/* Print Size */}
              <SizeFilter
                value={printSize}
                onChange={setPrintSize}
                label="Размер печати"
              />

              {/* Model */}
              <SizeFilter
                value={model}
                onChange={setModel}
                label="Модель"
              />
            </div>

            <div className="flex gap-4 pt-6 border-t">
              <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                {isSubmitting ? 'Создание...' : 'Создать товар'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/products')}>
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

