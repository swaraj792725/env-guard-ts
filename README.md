# env-guard-ts 🛡️

[![npm version](https://img.shields.io/npm/v/env-guard-ts.svg)](https://www.npmjs.com/package/env-guard-ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://github.com/swaraj792725/env-guard-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/swaraj792725/env-guard-ts/actions)

> **Ultra-fast, zero-dependency, type-safe environment variable validator for Node.js & TypeScript.**  
> Parse, validate, cast, and secure `process.env` at startup with zero overhead.

---

## Features

- ⚡ **Zero External Dependencies**: Minimal footprint, instant startup.
- 🎯 **Strict Type Inference**: Inferred TypeScript types matching your schema.
- 🔄 **Smart Casting**: Auto-casts numbers, booleans (`true`/`1`), URLs, ports (1-65535), choices, and JSON.
- 🛠️ **Defaults & Optionals**: Fluent `.default(val)` and `.optional()` chainable helpers.
- 🚨 **Clear Diagnostic Errors**: Combines multiple environment failures into a single clean summary.

---

## Installation

```bash
npm install env-guard-ts
# or
pnpm add env-guard-ts
```

---

## Quick Start

```typescript
import { validateEnv, str, num, bool, port, url, choice } from 'env-guard-ts';

export const env = validateEnv({
  NODE_ENV: choice(['development', 'production', 'test'] as const).default('development'),
  PORT: port().default(3000),
  ENABLE_METRICS: bool().default(false),
  DATABASE_URL: url(),
  API_SECRET: str(),
  MAX_CLIENTS: num().optional(),
});

// `env` is 100% strongly typed!
console.log(`Server starting on port ${env.PORT} in ${env.NODE_ENV} mode.`);
```

---

## Available Validators

| Validator | Target Type | Description |
|---|---|---|
| `str()` | `string` | Validates non-empty string |
| `num()` | `number` | Parses numeric string to JS number |
| `bool()` | `boolean` | Parses `"true"`/`"false"`/`"1"`/`"0"` |
| `port()` | `number` | Validates integer port range (1-65535) |
| `url()` | `string` | Validates URL format via `new URL()` |
| `choice(['a', 'b'])` | `'a' \| 'b'` | Enforces literal enum value set |
| `json<T>()` | `T` | Parses stringified JSON payload |

---

## Contributing

Pull requests and bug reports are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## License

[MIT](./LICENSE) © Swaraj Jakanoor
