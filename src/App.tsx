import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { CategoriesList } from './pages/Categories/List';
import { CategoriesCreate } from './pages/Categories/Create';
import { CategoriesEdit } from './pages/Categories/Edit';
import { ProductsList } from './pages/Products/List';
import { ProductsCreate } from './pages/Products/Create';
import { ProductsEdit } from './pages/Products/Edit';
import { WorksList } from './pages/Works/List';
import { WorksCreate } from './pages/Works/Create';
import { WorksEdit } from './pages/Works/Edit';
import { UsersList } from './pages/Users/List';
import { UsersCreate } from './pages/Users/Create';
import { UsersEdit } from './pages/Users/Edit';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <AppLayout>
                <CategoriesList />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories/create"
          element={
            <ProtectedRoute>
              <AppLayout>
                <CategoriesCreate />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories/edit/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <CategoriesEdit />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ProductsList />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/create"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ProductsCreate />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/edit/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ProductsEdit />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/works"
          element={
            <ProtectedRoute>
              <AppLayout>
                <WorksList />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/works/create"
          element={
            <ProtectedRoute>
              <AppLayout>
                <WorksCreate />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/works/edit/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <WorksEdit />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <AppLayout>
                <UsersList />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/create"
          element={
            <ProtectedRoute>
              <AppLayout>
                <UsersCreate />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/edit/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <UsersEdit />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
