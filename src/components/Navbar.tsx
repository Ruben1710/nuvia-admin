import { useAuthStore } from '@/store/auth';

export const Navbar = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Админ-панель</h2>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {user?.email}
        </span>
      </div>
    </div>
  );
};

