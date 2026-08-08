import { db } from '@/lib/db';
import { shipEvents } from '@/drizzle/schema/schema';

/**
 * Anonymous "apps shipped" telemetry ingest.
 *
 * The nextdeploy CLI POSTs one event on a successful `nextdeploy ship`. Official
 * release binaries Ed25519-sign each event; this endpoint verifies the
 * signature so a random `curl` cannot inflate the counter. Payload + canonical
 * signing format are documented in nextdeploy → shared/telemetry/README.md.
 *
 * Runs on the edge runtime so the shared db client uses Neon's HTTP driver
 * (the only one that works on the Worker — see lib/db.ts).
 */
export const runtime = 'edge';

const TARGETS = new Set(['vps', 'aws', 'cloudflare', 'other']);
const MAX_SKEW_SECONDS = 10 * 60;
const SIG_PREFIX = 'ed25519=';

const b64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

let cachedKey: CryptoKey | null = null;
async function publicKey(raw: string): Promise<CryptoKey> {
  if (!cachedKey) {
    cachedKey = await crypto.subtle.importKey('raw', b64(raw), { name: 'Ed25519' }, false, ['verify']);
  }
  return cachedKey;
}

export async function POST(req: Request): Promise<Response> {
  const pub = process.env.TELEMETRY_PUBLIC_KEY;
  if (!pub) return new Response('telemetry not configured', { status: 503 });

  let ev: Record<string, unknown>;
  try {
    ev = await req.json();
  } catch {
    return new Response('bad json', { status: 400 });
  }

  // 1. Shape — reject anything off-spec.
  if (
    ev.event !== 'ship.success' ||
    typeof ev.target !== 'string' || !TARGETS.has(ev.target) ||
    typeof ev.id !== 'string' || typeof ev.nonce !== 'string' ||
    typeof ev.version !== 'string' || typeof ev.ts !== 'number' ||
    typeof ev.os !== 'string' || typeof ev.arch !== 'string'
  ) {
    return new Response('bad shape', { status: 400 });
  }

  // 2. Freshness — drop stale/replayed events.
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - ev.ts) > MAX_SKEW_SECONDS) {
    return new Response('stale', { status: 400 });
  }

  // 3. Signature — the gate against forged "fake deploy" posts.
  const header = req.headers.get('X-NextDeploy-Signature') ?? '';
  if (!header.startsWith(SIG_PREFIX)) return new Response('unsigned', { status: 401 });
  const msg = new TextEncoder().encode(
    [ev.id, ev.event, ev.target, ev.version, ev.os, ev.arch, ev.ts, ev.nonce].join('|'),
  );
  let ok = false;
  try {
    ok = await crypto.subtle.verify('Ed25519', await publicKey(pub), b64(header.slice(SIG_PREFIX.length)), msg);
  } catch {
    ok = false;
  }
  if (!ok) return new Response('bad signature', { status: 401 });

  // 4. Idempotent insert — the nonce PK dedups replays of a valid event.
  await db
    .insert(shipEvents)
    .values({
      nonce: ev.nonce,
      installId: ev.id,
      target: ev.target,
      version: ev.version,
      os: ev.os,
      arch: ev.arch,
      eventTs: ev.ts,
    })
    .onConflictDoNothing();

  return new Response(null, { status: 204 });
}
