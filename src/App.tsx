import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { FEATURES } from './config/features';
import { Avisos } from './screens/Avisos';
import { Comparativo } from './screens/Comparativo';
import { Cursos } from './screens/Cursos';
import { Detalle } from './screens/Detalle';
import { Tablero } from './screens/Tablero';
import { TasksProvider } from './state/TasksContext';
import { TimeProvider } from './state/TimeContext';
import { ToastProvider } from './state/Toast';

export default function App() {
  return (
    <TimeProvider>
      <TasksProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Solo por liga directa; no aparece en la barra inferior. */}
              <Route
                path="comparativo"
                element={FEATURES.comparativo ? <Comparativo /> : <Navigate to="/" replace />}
              />
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
    </TimeProvider>
  );
}
