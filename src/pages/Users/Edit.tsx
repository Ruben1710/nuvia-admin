import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usersApi } from '@/api/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const userSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов').optional().or(z.literal('')),
  role: z.string().default('admin'),
});

type UserFormData = z.infer<typeof userSchema>;

export const UsersEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: 'admin',
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const user = await usersApi.getById(Number(id));
        reset({
          email: user.email,
          password: '',
          role: user.role,
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        navigate('/users');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, navigate, reset]);

  const onSubmit = async (data: UserFormData) => {
    if (!id) return;
    try {
      const updateData: any = {
        email: data.email,
        role: data.role,
      };
      
      // Добавляем пароль только если он указан
      if (data.password && data.password.length > 0) {
        updateData.password = data.password;
      }
      
      await usersApi.update(Number(id), updateData);
      navigate('/users');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ошибка при обновлении пользователя');
    }
  };

  if (loading) {
    return <div className="p-6">Загрузка...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Редактировать пользователя</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Редактирование пользователя</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Новый пароль (оставьте пустым, чтобы не менять)</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Роль *</Label>
              <Select id="role" {...register('role')}>
                <option value="admin">Admin</option>
              </Select>
              {errors.role && (
                <p className="text-sm text-destructive">{errors.role.message}</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Сохранение...' : 'Сохранить'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/users')}>
                Отмена
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

