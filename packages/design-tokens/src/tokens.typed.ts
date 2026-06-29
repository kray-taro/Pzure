
import tokensJson from './tokens.json';

export interface Tokens {
  color: Record<string, Record<string, string>>;
  font: { family: Record<string, string>; size: Record<string, string>;
          weight: Record<string, string>; lineHeight: Record<string, string>; };
  space: Record<string, string>;
  radius: Record<string, string>;
  shadow: Record<string, string>;
  breakpoint: Record<string, string>;
  z: Record<string, string>;
  motion: { duration: Record<string, string>; easing: Record<string, string>; };
  touch: Record<string, string>;
  layout: Record<string, string>;
}

export const tokens = tokensJson as unknown as Tokens;
