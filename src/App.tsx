import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Header from '@/components/common/Header';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { routes } from '@/routes';
import { useLoadingStore } from './stores/useLoadingStore';
import LoadingSpinner from '@/components/common/LoadingSpinner';

function App() {
  const loading = useLoadingStore((s) => s.loading);

  return (
    <BrowserRouter>
      <Header />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {routes.map((r: any) => {
            const Element = r.element;
            const element = r.index ? <Element /> : <Element />;
            if (r.protected) {
              return <Route key={r.path} path={r.path} element={<ProtectedRoute>{element}</ProtectedRoute>} />;
            }
            if (r.index) {
              return <Route key={r.path} index element={element} />;
            }
            return <Route key={r.path} path={r.path} element={element} />;
          })}
        </Routes>
      </Suspense>

      {loading && <LoadingSpinner />}
    </BrowserRouter>
  )
}

export default App
