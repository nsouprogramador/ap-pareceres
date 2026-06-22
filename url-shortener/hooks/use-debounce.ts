"use client";

/**
 * hooks/use-debounce.ts
 * Retorna um valor "atrasado" — útil para campos de busca, evitando uma
 * requisição a cada tecla digitada.
 */
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
