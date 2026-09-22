import { useEffect, useRef, useState } from 'react';

type Unsub = () => void;

export function friendlyError(e: Error & { code?: string }): string {
  if (e?.code === 'permission-denied') return 'PERMISSION';
  return 'GENERIC';
}

// Generic realtime subscription hook. `factory` returns null to skip subscribing.
export function useSub<T>(
  factory: (cb: (v: T) => void, err: (e: Error) => void) => Unsub | null,
  initial: T,
  deps: unknown[],
): { data: T; loading: boolean; error: 'PERMISSION' | 'GENERIC' | null } {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<'PERMISSION' | 'GENERIC' | null>(null);
  const factoryRef = useRef(factory);
  factoryRef.current = factory;

  useEffect(() => {
    setError(null);
    const un = factoryRef.current(
      v => { setData(v); setLoading(false); },
      e => { setError(friendlyError(e) as 'PERMISSION' | 'GENERIC'); setLoading(false); },
    );
    if (!un) { setData(initial); setLoading(false); return; }
    setLoading(true);
    return () => un();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
