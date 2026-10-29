import type { ReactNode } from 'react';

type Props = { title: string; left?: ReactNode; right?: ReactNode };

/** Encabezado gris de pantalla (Figma: fondo #E5E7EB, título en negritas). */
export function ScreenHeader({ title, left, right }: Props) {
  return (
    <header className="flex min-h-[72px] items-center gap-2 bg-chrome px-5">
      {left}
      <h1 className="text-[22px] font-bold leading-tight text-ink">{title}</h1>
      {right && <div className="ml-auto">{right}</div>}
    </header>
  );
}
