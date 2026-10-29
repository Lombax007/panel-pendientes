import { MenuIcon } from './Icons';

/** Barra superior "tipo LMS". Solo aparece si LMS_ACCENT no es null (src/config/theme.ts). */
export function LmsBar() {
  return (
    <div className="flex h-11 items-center gap-3 bg-[var(--lms-accent)] px-4 text-white">
      <MenuIcon className="size-5 opacity-90" />
      <span className="text-[15px] font-semibold tracking-wide">Campus virtual</span>
      <span
        className="ml-auto flex size-7 items-center justify-center rounded-full bg-white/20 text-xs font-bold"
        aria-label="Tu perfil: Ale"
        role="img"
      >
        AL
      </span>
    </div>
  );
}
