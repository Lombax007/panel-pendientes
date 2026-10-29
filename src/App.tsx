import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Avisos } from './screens/Avisos';
import { Cursos } from './screens/Cursos';
import { Detalle } from './screens/Detalle';
import { Tablero } from './screens/Tablero';
import { TasksProvider } from './state/TasksContext';
import { ToastProvider } from './state/Toast';

export default function App() {
  return (
    <TasksProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Tablero />} />
              <Route path="avisos" element={<Avisos />} />
              <Route path="tarea/:id" element={<Detalle />} />
              <Route path="cursos" element={<Cursos />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </TasksProvider>
  );
}
