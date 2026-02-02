/**
 * Consumer module that imports a value but only uses it in type positions.
 *
 * Issue: tsgo emits `require("./provider")` even though `Value` is only
 * used as a type annotation, while tsc correctly elides the import.
 *
 * This causes the provider module's side effects to execute when they shouldn't.
 */

// Import Value as a value (no `type` keyword), but only use it in type positions
import { Value, type ValueData } from "./provider";

// Interface that references Value only in type positions
export interface Record {
  // Value is used as a return type - this is a type-only usage
  getValue(): Value;

  // Value is used as a parameter type - type-only usage
  setValue(value: Value): void;

  // Value is used in a type annotation - type-only usage
  readonly currentValue: Value;
}

// Function signature that uses Value only in type positions
export function processRecord(
  value: Value, // type annotation only
  callback: (result: Value) => void, // type annotation only
): Value {
  // return type annotation only
  // This function body doesn't actually use Value as a value
  // It just passes through the parameter
  callback(value);
  return value;
}

// Generic type that uses Value in type position
export type ValueProcessor<T extends Value> = (input: T) => T;

// Class that uses Value only in type positions
export abstract class BaseProcessor {
  // Value in type annotation
  protected current: Value | null = null;

  // Value in method signature
  abstract process(input: Value): Value;

  // Value in getter return type
  abstract get latestValue(): Value | undefined;
}

/**
 * Expected behavior:
 *
 * tsc: Should NOT emit `require("./provider")` because Value is only used
 *      in type positions (type annotations, return types, parameter types).
 *      The import should be completely elided.
 *
 * tsgo: Currently DOES emit `require("./provider")` which causes the
 *       provider module's side effects to execute unnecessarily.
 */
