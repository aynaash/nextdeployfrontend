// Typed accessor for Cloudflare bindings + secrets.
//
// At the edge, NextDeploy's runtime exposes the full Worker `env` on
// globalThis.__nextdeployEnv before any app code runs. This helper reads it so
// server code / proxy.ts can reach DB, R2, AI, KV and secrets without importing
// runtime internals. Secrets that are plain strings are also on process.env.
export interface CloudflareEnv {
  // Database binding name depends on the chosen variant (D1: env.DB).
  DB: any;
  ASSETS: R2Bucket;
  AI: any;
  RATE_LIMIT: KVNamespace;
  AUTH_SECRET: string;
  [key: string]: unknown;
}

export function getEnv(): CloudflareEnv {
  const env = (globalThis as any).__nextdeployEnv;
  if (!env) {
    throw new Error(
      "Cloudflare env not available — getEnv() must be called inside a request " +
        "(server component, route handler, action, or proxy.ts).",
    );
  }
  return env as CloudflareEnv;
}
