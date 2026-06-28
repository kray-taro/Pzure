import { clsx, type ClassValue } from 'clsx';

/**
 * Class-name combiner. Single responsibility: merge conditional class lists.
 * Kept tiny and dependency-light so every component shares one join strategy.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
