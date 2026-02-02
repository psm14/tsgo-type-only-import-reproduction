/**
 * Module that exports both values and types.
 * This module has observable side effects when loaded.
 */

// Side effect: logs when module is loaded
console.log("[SIDE EFFECT] provider.ts module loaded");

// Track if this module was loaded
export const PROVIDER_LOADED = true;

// Value export - a class that could be used as a type or value
export class Value {
  constructor(public data: number) {}

  toString(): string {
    return `Value(${this.data})`;
  }
}

// Type-only export
export type ValueData = number | string | bigint;

// Another value export
export function createValue(data: ValueData): Value {
  return new Value(Number(data));
}
