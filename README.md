# tsgo vs tsc: Type-Only Import Elision

## Summary

When a module imports a value without the `type` keyword, but only uses that value in type positions (type annotations, return types, parameter types), `tsc` elides the import while `tsgo` emits a `require()` call. This causes unintended module side effects to execute.

## Reproduction

```bash
npm install
npm run build
npm run compare  # Show code diff
npm run test     # Show runtime behavior diff
```

## Runtime Behavioral Difference

Running `npm run test` demonstrates that tsc and tsgo produce **different runtime behavior**:

```
=== tsc output ===
Starting test...
Importing consumer module...
Consumer module loaded successfully

=== tsgo output ===
Starting test...
Importing consumer module...
[SIDE EFFECT] provider.ts module loaded
Consumer module loaded successfully
```

## The Problem

### Source Code (consumer.ts)

```typescript
// Import Value as a value (no `type` keyword), but only use it in type positions
import { Value, type ValueData } from "./provider";

// Value is ONLY used in type positions:
export interface Record {
  getValue(): Value; // return type
  setValue(value: Value): void; // parameter type
  readonly currentValue: Value; // type annotation
}

export function processRecord(
  value: Value, // parameter type
  callback: (result: Value) => void, // parameter type in callback
): Value {
  // return type
  callback(value);
  return value;
}
```

### tsc Output

```javascript
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseProcessor = void 0;
exports.processRecord = processRecord;
// NO require("./provider")

function processRecord(value, callback) {
  callback(value);
  return value;
}

class BaseProcessor {
  constructor() {
    this.current = null;
  }
}
exports.BaseProcessor = BaseProcessor;
```

### tsgo Output

```javascript
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseProcessor = void 0;
exports.processRecord = processRecord;
require("./provider"); // <-- EMITTED!

function processRecord(value, callback) {
  callback(value);
  return value;
}

class BaseProcessor {
  current = null;
}
exports.BaseProcessor = BaseProcessor;
```

## Patterns Affected

- `import { Class } from 'module'` where `Class` is only used as a type annotation
- `import { Interface } from 'module'` (interfaces are always type-only)
- Mixed imports like `import { Value, type Type }` where `Value` is only used in type positions
- Re-exports that only reference types

## Workaround

Use `import type` explicitly:

```typescript
// This works correctly in both tsc and tsgo
import type { Value } from "./provider";
import { type ValueData } from "./provider";
```
