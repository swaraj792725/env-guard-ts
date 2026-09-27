import { describe, test, expect } from 'vitest';
import { validateEnv, str, num, bool, port, url, choice, json } from '../src/index.js';

describe('env-guard-ts', () => {
  test('validates and parses valid environment variables', () => {
    const envSource = {
      NODE_ENV: 'production',
      PORT: '8080',
      ENABLE_LOGS: 'true',
      APP_URL: 'https://api.example.com',
      DB_CONFIG: '{"host":"localhost","port":5432}',
    };

    const env = validateEnv(
      {
        NODE_ENV: choice(['development', 'production', 'test']),
        PORT: port(),
        ENABLE_LOGS: bool(),
        APP_URL: url(),
        DB_CONFIG: json<{ host: string; port: number }>(),
        OPTIONAL_TAG: str().optional(),
        TIMEOUT: num().default(5000),
      },
      envSource
    );

    expect(env.NODE_ENV).toBe('production');
    expect(env.PORT).toBe(8080);
    expect(env.ENABLE_LOGS).toBe(true);
    expect(env.APP_URL).toBe('https://api.example.com/');
    expect(env.DB_CONFIG).toEqual({ host: 'localhost', port: 5432 });
    expect(env.OPTIONAL_TAG).toBeUndefined();
    expect(env.TIMEOUT).toBe(5000);
  });

  test('throws formatted error for missing or invalid variables', () => {
    const envSource = {
      PORT: 'invalid-port',
    };

    expect(() =>
      validateEnv(
        {
          PORT: port(),
          DATABASE_URL: url(),
        },
        envSource
      )
    ).toThrow('Environment validation failed');
  });
});
