import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

const ToastContext = createContext<(msg: string) => void>(() => {});

/** Confirmación breve abajo de la pantalla; la lee el lector de pantalla (aria-live). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<{ text: string; key: number } | null>(null);
  const timer = useRef<number>(undefined);
  const show = useCallback((text: string) => {
    window.clearTimeout(timer.current);
    setMsg({ text, key: Date.now() });
    timer.current = window.setTimeout(() => setMsg(null), 2800);
  }, []);
  return (
    <ToastContext.Provider value={show}>
      {children}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-30">
        {msg && (
          <div
            key={msg.key}
            className="anim-toast absolute left-1/2 w-[calc(100%-40px)] max-w-[440px] -translate-x-1/2 rounded-lg bg-primary px-4 py-3 text-center text-[15px] font-medium text-white shadow-lg"
          >
            {msg.text}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
