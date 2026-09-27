import { EnvValidator, ValidatorFn } from './types.js';

function createValidator<T>(baseFn: ValidatorFn<T>): EnvValidator<T> {
  const validator: EnvValidator<T> = {
    parse: baseFn,
    default(defaultVal: T) {
      return createValidator((val, key) => {
        if (val === undefined || val === '') return defaultVal;
        return baseFn(val, key);
      });
    },
    optional() {
      return createValidator<T | undefined>((val, key) => {
        if (val === undefined || val === '') return undefined;
        return baseFn(val, key);
      });
    },
  };
  return validator;
}

export const str = () =>
  createValidator((val, key) => {
    if (val === undefined || val === '') {
      throw new Error(`Environment variable "${key}" is required but was not provided.`);
    }
    return val;
  });

export const num = () =>
  createValidator((val, key) => {
    if (val === undefined || val === '') {
      throw new Error(`Environment variable "${key}" is required but was not provided.`);
    }
    const parsed = Number(val);
    if (Number.isNaN(parsed)) {
      throw new Error(`Environment variable "${key}" must be a valid number, received "${val}".`);
    }
    return parsed;
  });

export const bool = () =>
  createValidator((val, key) => {
    if (val === undefined || val === '') {
      throw new Error(`Environment variable "${key}" is required but was not provided.`);
    }
    const lower = val.trim().toLowerCase();
    if (lower === 'true' || lower === '1') return true;
    if (lower === 'false' || lower === '0') return false;
    throw new Error(`Environment variable "${key}" must be a boolean ("true"/"false"/"1"/"0"), received "${val}".`);
  });

export const port = () =>
  createValidator((val, key) => {
    const n = num().parse(val, key);
    if (!Number.isInteger(n) || n < 1 || n > 65535) {
      throw new Error(`Environment variable "${key}" must be a valid port number (1-65535), received "${val}".`);
    }
    return n;
  });

export const url = () =>
  createValidator((val, key) => {
    const s = str().parse(val, key);
    try {
      return new URL(s).toString();
    } catch {
      throw new Error(`Environment variable "${key}" must be a valid URL, received "${s}".`);
    }
  });

export const choice = <T extends string>(allowed: readonly T[]) =>
  createValidator<T>((val, key) => {
    const s = str().parse(val, key);
    if (!allowed.includes(s as T)) {
      throw new Error(
        `Environment variable "${key}" must be one of [${allowed.join(', ')}], received "${s}".`
      );
    }
    return s as T;
  });

export const json = <T = unknown>() =>
  createValidator<T>((val, key) => {
    const s = str().parse(val, key);
    try {
      return JSON.parse(s) as T;
    } catch {
      throw new Error(`Environment variable "${key}" must be valid JSON.`);
    }
  });
