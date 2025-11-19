import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { categoriesApi } from '@/api/categories';
import { productsApi } from '@/api/products';
import { Package, FolderTree } from 'lucide-react';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [categories, products] = await Promise.all([
          categoriesApi.getAll(),
          productsApi.getAll(),
        ]);
        setStats({
          categories: categories.length,
          products: products.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-6">Загрузка...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Категории</CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories}</div>
            <p className="text-xs text-muted-foreground">Всего категорий</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Товары</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.products}</div>
            <p className="text-xs text-muted-foreground">Всего товаров</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

