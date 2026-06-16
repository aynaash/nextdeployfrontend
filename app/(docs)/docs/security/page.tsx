import type { Metadata } from "next"
import { SecurityGates } from "@/components/docs/security-gates"
import { Explainable } from "@/components/docs/explainable"

export const metadata: Metadata = {
  title: "Security Gates | NextDeploy Documentation",
  description:
    "Every command the daemon accepts passes through five authentication gates, ordered cheapest-first. Explore each one — the code, the attack it stops, and why it sits where it does.",
}

export default function SecurityPage() {
  return (
    <div className="prose prose-slate max-w-none dark:prose-invert">
      <h1>Security Gates</h1>
      <p className="lead">
        <code>nextdeployd</code> never trusts a command just because it arrived. Each one runs a five-gate gauntlet,
        ordered <strong>cheapest check first</strong> so that abusive volume is rejected long before any cryptography is
        computed. Click a gate to see the exact code, the attack it prevents, and why it&apos;s ordered the way it is.
      </p>

      <SecurityGates />

      <Explainable
        summary={<p>The ordering isn&apos;t cosmetic — it&apos;s a cost gradient.</p>}
      >
        <p>
          A rate-limit check is a map lookup. An HMAC verification is a SHA-256 over the whole payload. If an attacker
          floods the endpoint, you want to drop them at the map lookup, not after burning a hash per request. So the
          gates climb from nearly-free (rate limit, IP allowlist) to expensive (HMAC, replay nonce) to side-effecting
          (audit log). Fail fast, fail cheap.
        </p>
      </Explainable>

      <h2>Fail-closed by default</h2>
      <p>
        Gate 3 is the one to internalize: if the shared secret is empty,{" "}
        <code>VerifySignature</code> returns <code>false</code> — it rejects <em>everything</em>. A misconfigured daemon
        is a locked daemon, never an open one. That single early-return is the difference between &quot;we forgot to set
        a secret&quot; being a harmless outage versus a wide-open door.
      </p>
    </div>
  )
}
