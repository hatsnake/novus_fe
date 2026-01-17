import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import { routes } from './routes';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
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
    </BrowserRouter>
  )
}

export default App
