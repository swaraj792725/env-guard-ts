import { SchemaDefinition, InferEnvSchema, EnvGuardOptions } from './types.js';

export function validateEnv<S extends SchemaDefinition>(
  schema: S,
  source: Record<string, string | undefined> = process.env,
  options: EnvGuardOptions = {}
): InferEnvSchema<S> {
  const result: Record<string, any> = {};
  const errors: string[] = [];

  for (const [key, validator] of Object.entries(schema)) {
    try {
      const rawVal = source[key];
      result[key] = validator.parse(rawVal, key);
    } catch (err: any) {
      errors.push(err.message || String(err));
    }
  }

  if (errors.length > 0) {
    if (options.onError) {
      options.onError(errors);
    }
    const message = `\n🚨 Environment validation failed:\n  - ${errors.join('\n  - ')}\n`;
    throw new Error(message);
  }

  return result as InferEnvSchema<S>;
}
