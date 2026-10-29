import { NavLink } from 'react-router-dom';
import { BellIcon, BookIcon, HomeIcon } from './Icons';

const TABS = [
  { to: '/', label: 'Inicio', Icon: HomeIcon, end: true },
  { to: '/cursos', label: 'Cursos', Icon: BookIcon, end: false },
  { to: '/avisos', label: 'Avisos', Icon: BellIcon, end: false },
];

/** Barra inferior fija: Inicio, Cursos, Avisos. `inline` = sin fijar (para el comparativo). */
export function BottomNav({ inline = false }: { inline?: boolean }) {
  return (
    <nav
      aria-label="Navegación principal"
      className={`${inline ? 'sticky w-full' : 'fixed'} inset-x-0 bottom-0 z-20 mx-auto max-w-[480px] border-t border-[#d1d5db] bg-chrome pb-[env(safe-area-inset-bottom)]`}
    >
      <ul className="flex">
        {TABS.map(({ to, label, Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative flex h-16 flex-col items-center justify-center gap-0.5 text-[15px] transition-colors duration-150 focus-visible:outline-3 focus-visible:-outline-offset-4 focus-visible:outline-[var(--lms-accent)] ${
                  isActive ? 'font-bold text-[var(--lms-accent)]' : 'text-ink'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span aria-hidden className="absolute inset-x-6 top-0 h-[3px] rounded-b bg-[var(--lms-accent)]" />
                  )}
                  <Icon className="size-[22px]" />
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
