import { Outlet, useLocation } from 'react-router-dom';
import { LMS_ACCENT } from '../config/theme';
import { BottomNav } from './BottomNav';
import { LmsBar } from './LmsBar';

/** Marco común: barra LMS opcional, pantalla y barra inferior. */
export function Layout() {
  const { pathname } = useLocation();
  const isDetail = pathname.startsWith('/tarea/');
  return (
    <div className="mx-auto flex min-h-dvh max-w-[480px] flex-col overflow-x-clip bg-white shadow-[0_0_0_1px_#e5e7eb]">
      {LMS_ACCENT && <LmsBar />}
      {/* key = ruta: cada cambio de pantalla re-dispara la transición */}
      <div key={pathname} className={`flex flex-1 flex-col ${isDetail ? 'anim-slide' : 'anim-fade pb-20'}`}>
        <Outlet />
      </div>
      {!isDetail && <BottomNav />}
    </div>
  );
}
