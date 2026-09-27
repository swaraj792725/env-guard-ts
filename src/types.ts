export type ValidatorFn<T> = (value: string | undefined, key: string) => T;

export interface EnvValidator<T> {
  parse: ValidatorFn<T>;
  default?: (defaultVal: T) => EnvValidator<T>;
  optional: () => EnvValidator<T | undefined>;
}

export type SchemaDefinition = Record<string, EnvValidator<any>>;

export type InferEnvSchema<S extends SchemaDefinition> = {
  [K in keyof S]: ReturnType<S[K]['parse']>;
};

export interface EnvGuardOptions {
  /** If true, masks secret key values in error messages */
  maskSecrets?: boolean;
  /** Custom error handler */
  onError?: (errors: string[]) => void;
}
