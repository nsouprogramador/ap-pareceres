/**
 * lib/nanoid.ts
 * Geração de slugs aleatórios. Usamos um alfabeto sem caracteres ambíguos
 * para facilitar a leitura e digitação manual do link.
 */
import { customAlphabet } from "nanoid";

// Sem 0/O/1/l/I para reduzir confusão visual.
const ALPHABET = "23456789abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";

export const DEFAULT_SLUG_LENGTH = 7;

const generate = customAlphabet(ALPHABET, DEFAULT_SLUG_LENGTH);

export function generateSlug(length: number = DEFAULT_SLUG_LENGTH): string {
  if (length === DEFAULT_SLUG_LENGTH) return generate();
  return customAlphabet(ALPHABET, length)();
}
